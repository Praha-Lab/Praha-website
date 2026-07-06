"""Praha Voice-1 TTS — Modal deployment with LoRA adapter + optimized inference.

Deploy:
    modal deploy modal_app.py

Endpoints:
    POST /generate  —  form data: text + audio file  →  WAV audio
    GET  /health    —  liveness check
"""

from __future__ import annotations

import asyncio
import io
import os
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import modal
from fastapi import File, Form, UploadFile
from starlette.responses import Response

# ── Image ────────────────────────────────────────────────────────────────────

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install(["libsndfile1", "ffmpeg", "git"])
    .pip_install(
        [
            "torch==2.6.0",
            "torchaudio==2.6.0",
            "transformers>=4.45.0,<5.0.0",
            "safetensors>=0.4.0",
            "peft>=0.14.0",
            "librosa>=0.10.0",
            "soundfile>=0.12.0",
            "huggingface_hub>=0.24.0",
            "pyloudnorm",
            "s3tokenizer",
            "tokenizers>=0.19.0",
            "fastapi",
            "python-multipart",
            "numpy>=1.24.0,<2.0.0",
        ],
        extra_index_url="https://download.pytorch.org/whl/cu124",
    )
    .run_commands(
        "git clone --depth 1 https://github.com/Pranavharshans/Lightning-inf.git /opt/lightning-inf",
        "cd /opt/lightning-inf && pip install -e .",
    )
)

app = modal.App("praha-voice-1-v6", image=image)

# Persistent volume so model weights survive container recycles.
model_volume = modal.Volume.from_name("praha-tts-models", create_if_missing=True)
higgs_volume = modal.Volume.from_name("praha-higgs-tts-models", create_if_missing=True)

higgs_image = (
    modal.Image.from_registry("lmsysorg/sglang-omni:dev", add_python="3.12")
    .apt_install(["git", "curl"])
    .pip_install(["fastapi[standard]", "python-multipart", "requests"])
    .run_commands(
        "git clone --depth 1 https://github.com/sgl-project/sglang-omni.git /opt/sglang-omni",
        "cd /opt/sglang-omni && uv venv .venv -p 3.12 && . .venv/bin/activate && uv pip install -v -e .",
    )
    .env(
        {
            "HF_HUB_ENABLE_HF_TRANSFER": "1",
            "SGLANG_OMNI_MODEL_PATH": "/models/higgs-tts-3-4b",
        }
    )
)

omnivoice_volume = modal.Volume.from_name("praha-omnivoice-models", create_if_missing=True)

omnivoice_image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install(["libsndfile1", "ffmpeg", "git"])
    .pip_install(
        [
            "torch==2.8.0",
            "torchaudio==2.8.0",
            "omnivoice",
            "soundfile>=0.12.0",
            "fastapi[standard]",
            "python-multipart",
            "numpy",
        ],
        extra_index_url="https://download.pytorch.org/whl/cu128",
    )
    .env(
        {
            "HF_HOME": "/models/hf",
            "HF_XET_HIGH_PERFORMANCE": "1",
        }
    )
)

# ── Constants ────────────────────────────────────────────────────────────────

BASE_REPO = "ResembleAI/chatterbox"
ADAPTER_REPO = "Praha-Labs/PrahaTTS-ML-Expressive-Adapter"
MODEL_ROOT = Path("/models")
MIN_REFERENCE_SECONDS = 5.0
HIGGS_MODEL_ID = "bosonai/higgs-tts-3-4b"
HIGGS_MODEL_PATH = Path("/models/higgs-tts-3-4b")
HIGGS_SERVER_URL = "http://127.0.0.1:8000/v1/audio/speech"
OMNIVOICE_MODEL_ID = "k2-fsa/OmniVoice"

# ── Utility: tokenizer (MTLTokenizer from Indic-ChatterBox) ──────────────────

SPACE_TOKEN = "[SPACE]"
SOT = "[START]"
EOT = "[STOP]"
UNK = "[UNK]"


class MTLTokenizer:
    """Multi-language tokenizer compatible with the Indic adapter vocab.

    Mirrors the preprocessing used during adapter training: lowercase, NFKD
    normalisation, and space→[SPACE] replacement.
    """

    def __init__(self, vocab_path: str):
        from tokenizers import Tokenizer

        self.tokenizer = Tokenizer.from_file(vocab_path)
        voc = self.tokenizer.get_vocab()
        assert SOT in voc and EOT in voc, "tokenizer missing [START]/[STOP]"

    def text_to_tokens(self, text: str):
        import torch

        ids = self.encode(text)
        return torch.IntTensor(ids).unsqueeze(0)

    def encode(self, text: str):
        from unicodedata import normalize

        text = text.lower()
        text = normalize("NFKD", text)
        text = text.replace(" ", SPACE_TOKEN)
        return self.tokenizer.encode(text).ids


# ── Utility: weight resizing (from Indic-ChatterBox src/model.py) ────────────


def resize_and_load_t3_weights(new_model, pretrained_state_dict: dict):
    """Transfer pretrained T3 weights into a model with a different vocab size.
    New embedding/head rows are initialised with the mean of existing rows."""
    import torch

    new_state = new_model.state_dict()
    emb_name = "text_emb.weight"
    head_name = "text_head.weight"

    for name, param in pretrained_state_dict.items():
        if name in (emb_name, head_name):
            continue
        if name in new_state and new_state[name].shape == param.shape:
            new_state[name].copy_(param)

    for layer_name in (emb_name, head_name):
        if layer_name not in pretrained_state_dict:
            continue
        old_w = pretrained_state_dict[layer_name]
        old_vocab, dim = old_w.shape
        new_vocab = new_state[layer_name].shape[0]
        new_state[layer_name][:old_vocab, :].copy_(old_w)
        if new_vocab > old_vocab:
            mean_w = old_w.mean(dim=0)
            for i in range(old_vocab, new_vocab):
                new_state[layer_name][i, :].copy_(mean_w)

    new_model.load_state_dict(new_state)
    return new_model


# ── Service class ────────────────────────────────────────────────────────────


@app.cls(
    gpu="A10G",
    volumes={"/models": model_volume},
    scaledown_window=20,
    enable_memory_snapshot=True,
    experimental_options={"enable_gpu_snapshot": True},
)
@modal.concurrent(max_inputs=4)
class PragaTTS:
    @modal.enter(snap=True)
    def load(self):
        """Download models + load engine with adapter (run once, snapshotted).

        GPU memory snapshots are enabled, so the engine is moved to GPU during
        container warmup instead of during the first user request.
        """
        import torch
        from huggingface_hub import snapshot_download
        from peft import PeftModel

        print("→ Checking / downloading base model …")
        t_start = time.time()
        t0 = time.time()
        base_path = MODEL_ROOT / "base"
        if not (base_path / "t3_cfg.safetensors").exists():
            self.base_dir = snapshot_download(
                BASE_REPO,
                local_dir=str(base_path),
                allow_patterns=[
                    "*.safetensors",
                    "*.json",
                    "*.txt",
                    "*.pt",
                    "*.model",
                ],
                max_workers=4,
            )
        else:
            self.base_dir = str(base_path)
        print(f"  base model ready ({time.time() - t0:.0f}s)")

        print("→ Checking / downloading adapter …")
        t0 = time.time()
        adapter_path = MODEL_ROOT / "adapter"
        if not (adapter_path / "adapter_model.safetensors").exists():
            self.adapter_dir = snapshot_download(
                ADAPTER_REPO,
                local_dir=str(adapter_path),
                max_workers=4,
            )
        else:
            self.adapter_dir = str(adapter_path)
        print(f"  adapter ready ({time.time() - t0:.0f}s)")

        # Patch importlib so chatterbox __init__.py can resolve its version.
        import importlib.metadata as _imd
        _orig_version = _imd.version
        def _patched_version(name):
            if name == "chatterbox-tts":
                name = "chatterbox-tts-optimized"
            return _orig_version(name)
        _imd.version = _patched_version

        sys.path.insert(0, "/opt/lightning-inf/src")
        from chatterbox.tts import ChatterboxTTS
        from chatterbox.models.t3 import T3

        print(f"  torch={torch.__version__} cuda_avail={torch.cuda.is_available()}")

        # Load everything on CPU first, then move to GPU before snapshotting.
        print("→ Loading base engine (CPU) …")
        engine = ChatterboxTTS.from_local(Path(self.base_dir), device="cpu")

        pretrained_t3_state = engine.t3.state_dict()
        original_hp = engine.t3.hp

        # Determine expanded vocab size from the adapter tokenizer.
        adapter_tok_path = Path(self.adapter_dir) / "tokenizer_indic.json"
        new_vocab_size = len(MTLTokenizer(str(adapter_tok_path)).tokenizer.get_vocab())
        print(f"  new vocab size = {new_vocab_size}")

        # Build new T3 with expanded vocab and transfer pretrained weights.
        print("→ Building T3 with expanded vocab …")
        original_hp.text_tokens_dict_size = new_vocab_size
        if hasattr(original_hp, "use_cache"):
            original_hp.use_cache = False

        new_t3 = T3(hp=original_hp)
        new_t3 = resize_and_load_t3_weights(new_t3, pretrained_t3_state)
        del pretrained_t3_state

        # Load LoRA adapter.
        print("→ Loading LoRA adapter …")
        engine.t3 = PeftModel.from_pretrained(
            new_t3, self.adapter_dir, is_trainable=False,
        )
        engine.tokenizer = MTLTokenizer(str(adapter_tok_path))

        self.engine = engine
        self._gpu_ready = False
        self._ensure_gpu()
        print(f"✓ Praha Voice-1 ready on GPU ({time.time() - t_start:.0f}s total)")

    def _ensure_gpu(self):
        """Move engine to GPU before snapshotting, or no-op after restore."""
        if self._gpu_ready:
            return
        import torch
        from chatterbox.models.t3.clean_forward_bf16 import apply_optimized_inference

        device = "cuda" if torch.cuda.is_available() else "cpu"
        if device == "cpu":
            self._gpu_ready = True
            return
        print(f"→ Moving engine to GPU …")
        t0 = time.time()
        self.engine.t3.to(device).eval()
        self.engine.s3gen.to(device).eval()
        self.engine.ve.to(device).eval()
        self.engine.device = device
        if self.engine.conds is not None:
            self.engine.conds = self.engine.conds.to(device)
        apply_optimized_inference(self.engine)
        self._gpu_ready = True
        print(f"  GPU ready ({time.time() - t0:.0f}s)")

    @modal.fastapi_endpoint(method="POST", docs=True)
    async def generate(
        self,
        text: str = Form(...),
        audio: UploadFile = File(...),
    ):
        """Generate speech from text + reference audio (voice cloning).

        Accepts multipart/form-data:
            text  – the text to synthesise (required)
            audio – reference voice sample, WAV/MP3 (required, ≥ 5 seconds)

        Returns audio/wav.
        """
        self._ensure_gpu()

        import librosa
        import numpy as np
        import soundfile as sf

        t_req = time.time()
        raw = await audio.read()
        t_decode = time.time()
        audio_data, sr = librosa.load(io.BytesIO(raw), sr=None)
        duration = len(audio_data) / sr
        if duration < MIN_REFERENCE_SECONDS:
            return {
                "error": f"Reference audio must be > {MIN_REFERENCE_SECONDS:.0f} seconds (got {duration:.1f}s)."
            }, 422

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            sf.write(tmp.name, audio_data, sr)
            ref_path = tmp.name

        try:
            t_gen = time.time()
            wav = self.engine.generate(
                text=text,
                audio_prompt_path=ref_path,
                temperature=0.8,
                repetition_penalty=1.2,
                cfg_weight=0.5,
                exaggeration=0.5,
            )
            if isinstance(wav, tuple):
                wav = wav[0]
            audio_np = wav.squeeze().detach().cpu().numpy()
            t_audio = time.time()
        finally:
            os.unlink(ref_path)

        buf = io.BytesIO()
        sf.write(buf, audio_np, self.engine.sr, format="WAV")
        buf.seek(0)
        t_done = time.time()
        print(
            "timing adapter "
            f"read={t_decode - t_req:.2f}s "
            f"decode={t_gen - t_decode:.2f}s "
            f"generate={t_audio - t_gen:.2f}s "
            f"encode={t_done - t_audio:.2f}s "
            f"total={t_done - t_req:.2f}s"
        )

        return Response(
            content=buf.read(),
            media_type="audio/wav",
            headers={
                "X-Sample-Rate": str(self.engine.sr),
                "X-Duration": str(len(audio_np) / self.engine.sr),
                "X-Backend-Time": f"{t_done - t_req:.2f}",
            },
        )

    @modal.fastapi_endpoint(method="GET")
    def health(self):
        self._ensure_gpu()
        import torch
        return {
            "status": "ready",
            "device": "cuda" if torch.cuda.is_available() else "cpu",
            "gpu_ready": self._gpu_ready,
        }


# ── Turbo model (no adapter, raw ChatterboxTurboTTS + custom BF16 cache) ─────

@app.cls(
    gpu="A10G",
    volumes={"/models": model_volume},
    scaledown_window=20,
    enable_memory_snapshot=True,
    experimental_options={"enable_gpu_snapshot": True},
)
@modal.concurrent(max_inputs=4)
class PragaTurboTTS:
    @modal.enter(snap=True)
    def load(self):
        """Load Turbo, move it to GPU during warmup, then snapshot.

        Triton kernel cache is stored on the Modal volume so torch.compile
        output survives container restarts.
        """
        import torch
        from huggingface_hub import snapshot_download

        # torch.compile disabled to keep snapshot compatibility.

        # Keep custom BF16 cache OFF — its torch.compile crashes on snapshot restore.
        os.environ["CHATTERBOX_CUSTOM_BF16_CACHE"] = "0"
        # Enable instant optimizations: BF16 autocast wrapping.
        os.environ["CHATTERBOX_BF16_AUTOCAST"] = "1"

        print("→ Turbo base model …")
        t_start = time.time()
        turbo_path = MODEL_ROOT / "turbo"
        if not (turbo_path / "t3_turbo_v1.safetensors").exists():
            snapshot_download(
                "ResembleAI/chatterbox-turbo",
                local_dir=str(turbo_path),
                allow_patterns=["*.safetensors", "*.json", "*.txt", "*.pt", "*.model"],
                max_workers=4,
            )

        import importlib.metadata as _imd
        _orig_version = _imd.version
        def _patched_version(name):
            if name == "chatterbox-tts":
                name = "chatterbox-tts-optimized"
            return _orig_version(name)
        _imd.version = _patched_version

        sys.path.insert(0, "/opt/lightning-inf/src")
        from chatterbox.tts_turbo import ChatterboxTurboTTS

        print(f"  torch={torch.__version__} cuda={torch.cuda.is_available()}")
        print("→ Loading Turbo on CPU …")
        self.engine = ChatterboxTurboTTS.from_local(turbo_path, device="cpu")
        self._gpu_ready = False
        self._ensure_gpu()
        print(f"✓ Turbo ready on GPU ({time.time() - t_start:.0f}s)")

    def _ensure_gpu(self):
        if self._gpu_ready:
            return
        import torch
        from chatterbox.models.t3.clean_forward_bf16 import apply_optimized_inference

        device = "cuda" if torch.cuda.is_available() else "cpu"
        if device == "cpu":
            self._gpu_ready = True
            return
        print("→ Moving Turbo to GPU + compiling …")
        t0 = time.time()
        self.engine.t3.to(device).eval()
        self.engine.s3gen.to(device).eval()
        self.engine.ve.to(device).eval()
        self.engine.device = device
        if self.engine.conds is not None:
            self.engine.conds = self.engine.conds.to(device)
        apply_optimized_inference(self.engine)
        self._gpu_ready = True
        print(f"  Turbo GPU ready ({time.time() - t0:.0f}s)")

    @modal.fastapi_endpoint(method="POST", docs=True)
    async def generate(
        self,
        text: str = Form(...),
        audio: UploadFile = File(...),
    ):
        self._ensure_gpu()

        import librosa
        import numpy as np
        import soundfile as sf

        t_req = time.time()
        raw = await audio.read()
        t_decode = time.time()
        audio_data, sr = librosa.load(io.BytesIO(raw), sr=None)
        duration = len(audio_data) / sr
        if duration < MIN_REFERENCE_SECONDS:
            return {
                "error": f"Reference audio must be > {MIN_REFERENCE_SECONDS:.0f} seconds (got {duration:.1f}s)."
            }, 422

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            sf.write(tmp.name, audio_data, sr)
            ref_path = tmp.name

        try:
            t_gen = time.time()
            wav = self.engine.generate(
                text=text,
                audio_prompt_path=ref_path,
                temperature=0.8,
                repetition_penalty=1.2,
                n_cfm_timesteps=1,
            )
            if isinstance(wav, tuple):
                wav = wav[0]
            audio_np = wav.squeeze().detach().cpu().numpy()
            t_audio = time.time()
        finally:
            os.unlink(ref_path)

        buf = io.BytesIO()
        sf.write(buf, audio_np, self.engine.sr, format="WAV")
        buf.seek(0)
        t_done = time.time()
        print(
            "timing turbo "
            f"read={t_decode - t_req:.2f}s "
            f"decode={t_gen - t_decode:.2f}s "
            f"generate={t_audio - t_gen:.2f}s "
            f"encode={t_done - t_audio:.2f}s "
            f"total={t_done - t_req:.2f}s"
        )

        return Response(
            content=buf.read(),
            media_type="audio/wav",
            headers={
                "X-Sample-Rate": str(self.engine.sr),
                "X-Duration": str(len(audio_np) / self.engine.sr),
                "X-Backend-Time": f"{t_done - t_req:.2f}",
            },
        )

    @modal.fastapi_endpoint(method="GET")
    def health(self):
        self._ensure_gpu()
        return {
            "status": "ready",
            "device": "cuda",
            "model": "turbo",
        }


# ── Higgs TTS 3 4B via SGLang Omni ──────────────────────────────────────────

@app.cls(
    image=higgs_image,
    gpu="A100-40GB",
    volumes={"/models": higgs_volume},
    scaledown_window=20,
    timeout=60 * 30,
    enable_memory_snapshot=True,
    experimental_options={"enable_gpu_snapshot": True},
)
@modal.concurrent(max_inputs=8)
class HiggsTTS:
    @modal.enter(snap=True)
    def load(self):
        """Download Higgs weights and launch SGLang Omni before snapshotting."""
        self.proc: subprocess.Popen | None = None
        self._ensure_model()
        self._ensure_server()
        print("✓ Higgs TTS server ready")

    def _ensure_model(self):
        if (HIGGS_MODEL_PATH / "config.json").exists():
            return
        HIGGS_MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        print(f"→ Downloading {HIGGS_MODEL_ID} to {HIGGS_MODEL_PATH}")
        subprocess.run(
            [
                "hf",
                "download",
                HIGGS_MODEL_ID,
                "--local-dir",
                str(HIGGS_MODEL_PATH),
            ],
            check=True,
        )

    def _port_is_open(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(0.25)
            return sock.connect_ex(("127.0.0.1", 8000)) == 0

    def _ensure_server(self):
        if self._port_is_open():
            return

        env = os.environ.copy()
        env["PATH"] = f"/opt/sglang-omni/.venv/bin:{env.get('PATH', '')}"
        cmd = [
            "/opt/sglang-omni/.venv/bin/sgl-omni",
            "serve",
            "--model-path",
            str(HIGGS_MODEL_PATH),
            "--port",
            "8000",
        ]
        print("→ Starting Higgs SGLang Omni server")
        self.proc = subprocess.Popen(cmd, env=env)

        deadline = time.time() + 20 * 60
        while time.time() < deadline:
            if self.proc.poll() is not None:
                raise RuntimeError(f"Higgs server exited with code {self.proc.returncode}")
            if self._port_is_open():
                return
            time.sleep(2)
        raise TimeoutError("Timed out waiting for Higgs SGLang server on port 8000")

    @modal.fastapi_endpoint(method="POST", docs=True)
    async def generate(
        self,
        text: str = Form(...),
        audio: UploadFile | None = File(default=None),
        reference_text: str = Form(default=""),
        temperature: float = Form(default=0.8),
        top_k: int = Form(default=50),
        max_new_tokens: int = Form(default=1024),
    ):
        """Generate speech with Higgs TTS.

        Optional uploaded reference audio is saved inside the Modal container
        because SGLang Omni expects a local audio_path for voice cloning.
        """
        self._ensure_server()

        import requests

        payload: dict[str, object] = {
            "input": text,
            "temperature": temperature,
            "top_k": top_k,
            "max_new_tokens": max_new_tokens,
        }

        ref_path = None
        if audio is not None:
            suffix = Path(audio.filename or "reference.wav").suffix or ".wav"
            raw = await audio.read()
            with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
                tmp.write(raw)
                ref_path = tmp.name
            payload["references"] = [
                {
                    "audio_path": ref_path,
                    "text": reference_text,
                }
            ]

        t0 = time.time()
        try:
            response = await asyncio.to_thread(
                requests.post,
                HIGGS_SERVER_URL,
                json=payload,
                timeout=300,
            )
        finally:
            if ref_path is not None:
                os.unlink(ref_path)

        if not response.ok:
            return Response(
                content=response.content,
                status_code=response.status_code,
                media_type=response.headers.get("content-type", "text/plain"),
            )

        elapsed = time.time() - t0
        print(f"timing higgs total={elapsed:.2f}s bytes={len(response.content)}")
        return Response(
            content=response.content,
            media_type=response.headers.get("content-type", "audio/wav"),
            headers={
                "X-Backend-Time": f"{elapsed:.2f}",
                "Cache-Control": "no-cache",
            },
        )

    @modal.fastapi_endpoint(method="GET")
    def health(self):
        self._ensure_server()
        return {
            "status": "ready",
            "model": HIGGS_MODEL_ID,
            "server": "sglang-omni",
        }


# ── OmniVoice multilingual zero-shot TTS ─────────────────────────────────────

@app.cls(
    image=omnivoice_image,
    gpu="A10G",
    volumes={"/models": omnivoice_volume},
    scaledown_window=20,
    timeout=60 * 15,
    enable_memory_snapshot=True,
    experimental_options={"enable_gpu_snapshot": True},
)
@modal.concurrent(max_inputs=2)
class OmniVoiceTTS:
    @modal.enter(snap=True)
    def load(self):
        import torch
        from omnivoice import OmniVoice

        t0 = time.time()
        print("→ Loading OmniVoice")
        self.model = OmniVoice.from_pretrained(
            OMNIVOICE_MODEL_ID,
            device_map="cuda:0" if torch.cuda.is_available() else "cpu",
            dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        )
        print(f"✓ OmniVoice ready ({time.time() - t0:.1f}s)")

    @modal.fastapi_endpoint(method="POST", docs=True)
    async def generate(
        self,
        text: str = Form(...),
        audio: UploadFile = File(...),
        reference_text: str = Form(default=""),
    ):
        """Generate multilingual cloned speech with OmniVoice."""
        import soundfile as sf

        if not reference_text.strip():
            return {"error": "Reference transcript is required for OmniVoice voice cloning."}, 422

        raw = await audio.read()
        suffix = Path(audio.filename or "reference.wav").suffix or ".wav"
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(raw)
            ref_path = tmp.name

        t0 = time.time()
        try:
            wavs = self.model.generate(
                text=text,
                ref_audio=ref_path,
                ref_text=reference_text,
            )
        finally:
            os.unlink(ref_path)

        if not wavs:
            return {"error": "OmniVoice returned no audio."}, 502

        buf = io.BytesIO()
        sf.write(buf, wavs[0], 24000, format="WAV")
        buf.seek(0)
        elapsed = time.time() - t0
        print(f"timing omnivoice total={elapsed:.2f}s")
        return Response(
            content=buf.read(),
            media_type="audio/wav",
            headers={
                "X-Sample-Rate": "24000",
                "X-Backend-Time": f"{elapsed:.2f}",
                "Cache-Control": "no-cache",
            },
        )

    @modal.fastapi_endpoint(method="GET")
    def health(self):
        return {
            "status": "ready",
            "model": OMNIVOICE_MODEL_ID,
            "device": "cuda",
        }
