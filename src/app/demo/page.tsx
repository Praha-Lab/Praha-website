"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const SAMPLES = [
  "Welcome to Praha Labs. This is Praha Voice-1 speaking in a clear, expressive product voice.",
  "Generate narration, assistant replies, and onboarding audio from a single API endpoint.",
  "Text-to-speech should feel fast, controlled, and ready for real production users.",
];

const HIGGS_SAMPLES = [
  "Hello, how are you? This is Higgs TTS running through the Praha Labs inference console.",
  "<|emotion:amusement|><|prosody:expressive_high|>Wait, wait, that was kind of hilarious. <|sfx:laughter|>Hehe, no, seriously, I was not ready for that.",
  "Have a nice day and enjoy south California sunshine.",
];

const OMNIVOICE_SAMPLES = [
  "Hello, this is a multilingual voice cloning test from OmniVoice.",
  "Bonjour, ceci est une démonstration de synthèse vocale multilingue.",
  "Voice cloning should preserve speaker identity while keeping the words clear.",
];

type Model = "adapter" | "turbo";
type Status = "idle" | "loading" | "done" | "error";

export default function DemoPage() {
  const [text, setText] = useState(SAMPLES[0]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [model, setModel] = useState<Model>("adapter");
  const [status, setStatus] = useState<Status>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [higgsText, setHiggsText] = useState(HIGGS_SAMPLES[0]);
  const [higgsReferenceText, setHiggsReferenceText] = useState(
    "Hey, Adam here. Let’s create something that feels real, sounds human, and connects every time.",
  );
  const [higgsAudioFile, setHiggsAudioFile] = useState<File | null>(null);
  const [higgsStatus, setHiggsStatus] = useState<Status>("idle");
  const [higgsAudioUrl, setHiggsAudioUrl] = useState<string | null>(null);
  const [higgsError, setHiggsError] = useState<string | null>(null);
  const [higgsGenerationTime, setHiggsGenerationTime] = useState<number | null>(null);
  const [omniText, setOmniText] = useState(OMNIVOICE_SAMPLES[0]);
  const [omniReferenceText, setOmniReferenceText] = useState(
    "Hey, Adam here. Let’s create something that feels real, sounds human, and connects every time.",
  );
  const [omniAudioFile, setOmniAudioFile] = useState<File | null>(null);
  const [omniStatus, setOmniStatus] = useState<Status>("idle");
  const [omniAudioUrl, setOmniAudioUrl] = useState<string | null>(null);
  const [omniError, setOmniError] = useState<string | null>(null);
  const [omniGenerationTime, setOmniGenerationTime] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const higgsFileInputRef = useRef<HTMLInputElement>(null);
  const omniFileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    if (!audioFile) {
      setError("Upload a reference voice sample first (> 5 seconds).");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);
    setAudioUrl(null);
    const start = Date.now();

    try {
      const fd = new FormData();
      fd.set("text", text.trim());
      fd.set("audio", audioFile);
      fd.set("model", model);

      const res = await fetch("/api/inference", { method: "POST", body: fd });
      const ct = res.headers.get("content-type") || "";

      if (!res.ok || ct.includes("application/json")) {
        let msg = `Server returned ${res.status}`;
        try {
          const body = await res.json();
          msg = body.error || msg;
        } catch {
          msg = (await res.text().catch(() => msg)) || msg;
        }
        throw new Error(msg);
      }

      if (!ct.includes("audio/")) {
        throw new Error(`Unexpected response type: ${ct}. Expected audio.`);
      }

      const blob = await res.blob();
      if (blob.size < 500) {
        const text = await blob.text();
        throw new Error(`Tiny response (${blob.size}B): ${text.slice(0, 200)}`);
      }

      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(URL.createObjectURL(blob));
      setStatus("done");
      setGenerationTime((Date.now() - start) / 1000);
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setError(null);
    }
  };

  const handleHiggsGenerate = async () => {
    if (!higgsText.trim()) return;

    setHiggsStatus("loading");
    setHiggsError(null);
    setHiggsAudioUrl(null);
    const start = Date.now();

    try {
      const fd = new FormData();
      fd.set("text", higgsText.trim());
      if (higgsAudioFile) fd.set("audio", higgsAudioFile);
      if (higgsReferenceText.trim()) fd.set("referenceText", higgsReferenceText.trim());

      const res = await fetch("/api/higgs", { method: "POST", body: fd });
      const ct = res.headers.get("content-type") || "";

      if (!res.ok || ct.includes("application/json")) {
        let msg = `Server returned ${res.status}`;
        try {
          const body = await res.json();
          msg = body.error || msg;
        } catch {
          msg = (await res.text().catch(() => msg)) || msg;
        }
        throw new Error(msg);
      }

      if (!ct.includes("audio/")) {
        throw new Error(`Unexpected response type: ${ct}. Expected audio.`);
      }

      const blob = await res.blob();
      if (blob.size < 500) {
        const text = await blob.text();
        throw new Error(`Tiny response (${blob.size}B): ${text.slice(0, 200)}`);
      }

      if (higgsAudioUrl) URL.revokeObjectURL(higgsAudioUrl);
      setHiggsAudioUrl(URL.createObjectURL(blob));
      setHiggsStatus("done");
      setHiggsGenerationTime((Date.now() - start) / 1000);
    } catch (e) {
      setHiggsError((e as Error).message);
      setHiggsStatus("error");
    }
  };

  const handleHiggsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHiggsAudioFile(file);
      setHiggsError(null);
    }
  };

  const handleOmniGenerate = async () => {
    if (!omniText.trim()) return;
    if (!omniAudioFile) {
      setOmniError("Upload a reference voice sample first.");
      setOmniStatus("error");
      return;
    }
    if (!omniReferenceText.trim()) {
      setOmniError("Add the reference transcript for better cloning.");
      setOmniStatus("error");
      return;
    }

    setOmniStatus("loading");
    setOmniError(null);
    setOmniAudioUrl(null);
    const start = Date.now();

    try {
      const fd = new FormData();
      fd.set("text", omniText.trim());
      fd.set("audio", omniAudioFile);
      fd.set("referenceText", omniReferenceText.trim());

      const res = await fetch("/api/omnivoice", { method: "POST", body: fd });
      const ct = res.headers.get("content-type") || "";

      if (!res.ok || ct.includes("application/json")) {
        let msg = `Server returned ${res.status}`;
        try {
          const body = await res.json();
          msg = body.error || msg;
        } catch {
          msg = (await res.text().catch(() => msg)) || msg;
        }
        throw new Error(msg);
      }

      if (!ct.includes("audio/")) {
        throw new Error(`Unexpected response type: ${ct}. Expected audio.`);
      }

      const blob = await res.blob();
      if (blob.size < 500) {
        const text = await blob.text();
        throw new Error(`Tiny response (${blob.size}B): ${text.slice(0, 200)}`);
      }

      if (omniAudioUrl) URL.revokeObjectURL(omniAudioUrl);
      setOmniAudioUrl(URL.createObjectURL(blob));
      setOmniStatus("done");
      setOmniGenerationTime((Date.now() - start) / 1000);
    } catch (e) {
      setOmniError((e as Error).message);
      setOmniStatus("error");
    }
  };

  const handleOmniFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOmniAudioFile(file);
      setOmniError(null);
    }
  };

  const fileName = audioFile?.name ?? null;
  const fileSize = audioFile
    ? audioFile.size > 1024 * 1024
      ? `${(audioFile.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(audioFile.size / 1024).toFixed(0)} KB`
    : null;
  const higgsFileName = higgsAudioFile?.name ?? null;
  const higgsFileSize = higgsAudioFile
    ? higgsAudioFile.size > 1024 * 1024
      ? `${(higgsAudioFile.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(higgsAudioFile.size / 1024).toFixed(0)} KB`
    : null;
  const omniFileName = omniAudioFile?.name ?? null;
  const omniFileSize = omniAudioFile
    ? omniAudioFile.size > 1024 * 1024
      ? `${(omniAudioFile.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(omniAudioFile.size / 1024).toFixed(0)} KB`
    : null;

  return (
    <main className="demo-page">
      <section className="demo-shell">
        <p className="eyebrow">Praha Voice-1 demo</p>
        <h1>Clone a voice, generate speech.</h1>
        <p>
          Upload a reference voice sample and enter text to generate speech with
          voice cloning. The reference audio should be longer than 5 seconds of
          clear speech.
        </p>

        {/* Model selector */}
        <div className="model-toggle" role="radiogroup" aria-label="Model selection">
          <button
            type="button"
            className={`model-option ${model === "adapter" ? "active" : ""}`}
            onClick={() => setModel("adapter")}
            role="radio"
            aria-checked={model === "adapter"}
          >
            <strong>Adapter</strong>
            <span>Expressive · Voice cloning · Emotion tags</span>
          </button>
          <button
            type="button"
            className={`model-option ${model === "turbo" ? "active" : ""}`}
            onClick={() => setModel("turbo")}
            role="radio"
            aria-checked={model === "turbo"}
          >
            <strong>Turbo</strong>
            <span>Fast · Raw Chatterbox Turbo · No adapter</span>
          </button>
        </div>

        <div className="demo-composer" aria-label="Voice cloning composer">
          {/* Voice sample upload */}
          <div className="upload-zone">
            <label className="upload-label" htmlFor="voice-sample">
              Reference voice sample
            </label>
            <input
              ref={fileInputRef}
              id="voice-sample"
              type="file"
              accept="audio/wav,audio/mpeg,audio/mp3,.wav,.mp3"
              onChange={handleFileChange}
              className="file-input"
            />
            <button
              type="button"
              className="button secondary upload-trigger"
              onClick={() => fileInputRef.current?.click()}
            >
              {audioFile ? "Change file" : "Choose audio file"}
            </button>
            {fileName && (
              <span className="file-info">
                {fileName} ({fileSize})
              </span>
            )}
          </div>

          {/* Text input */}
          <label htmlFor="demo-text">Text to synthesise</label>
          <textarea
            id="demo-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />

          <div className="demo-controls">
            <button
              type="button"
              className="button primary"
              onClick={handleGenerate}
              disabled={status === "loading"}
            >
              {status === "loading"
                ? `Generating with ${model === "turbo" ? "Turbo" : "Adapter"} …`
                : `Generate (${model === "turbo" ? "Turbo" : "Adapter"})`}
            </button>
            <Link className="button secondary" href="/">
              Back to Praha Labs
            </Link>
          </div>
        </div>

        {/* Status feedback */}
        {status === "loading" && (
          <div className="status-bar loading" role="status">
            <span className="spinner" aria-hidden="true" />
            Generating speech with {model === "turbo" ? "Turbo" : "Adapter"} model …
          </div>
        )}

        {status === "done" && audioUrl && (
          <div className="result-panel">
            <div className="status-bar success" role="status">
              Generated in {generationTime?.toFixed(1)}s · {model === "turbo" ? "Turbo" : "Adapter"}
            </div>
            <audio ref={audioRef} controls src={audioUrl} className="audio-player" />
            <a
              className="button secondary"
              href={audioUrl}
              download={`praha-voice-1-${model}.wav`}
            >
              Download WAV
            </a>
          </div>
        )}

        {status === "error" && error && (
          <div className="status-bar error" role="alert">
            {error}
          </div>
        )}

        {/* Sample prompts */}
        <div className="sample-stack" aria-label="Sample prompts">
          {SAMPLES.map((sample) => (
            <p
              key={sample}
              role="button"
              tabIndex={0}
              onClick={() => setText(sample)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setText(sample);
              }}
            >
              {sample}
            </p>
          ))}
        </div>
      </section>

      <section className="demo-shell higgs-shell">
        <p className="eyebrow">External model bench</p>
        <h2>Higgs TTS inference.</h2>
        <p>
          Run zero-shot synthesis or add a reference voice sample with transcript
          for voice cloning. This endpoint is served by SGLang Omni on Modal.
        </p>

        <div className="demo-composer higgs-composer" aria-label="Higgs TTS composer">
          <label htmlFor="higgs-text">Text to synthesise</label>
          <textarea
            id="higgs-text"
            value={higgsText}
            onChange={(e) => setHiggsText(e.target.value)}
            rows={4}
          />

          <div className="upload-zone">
            <label className="upload-label" htmlFor="higgs-voice-sample">
              Optional reference voice
            </label>
            <input
              ref={higgsFileInputRef}
              id="higgs-voice-sample"
              type="file"
              accept="audio/wav,audio/mpeg,audio/mp3,.wav,.mp3"
              onChange={handleHiggsFileChange}
              className="file-input"
            />
            <button
              type="button"
              className="button secondary upload-trigger"
              onClick={() => higgsFileInputRef.current?.click()}
            >
              {higgsAudioFile ? "Change file" : "Choose reference"}
            </button>
            {higgsFileName && (
              <span className="file-info">
                {higgsFileName} ({higgsFileSize})
              </span>
            )}
          </div>

          <label htmlFor="higgs-reference-text">Reference transcript</label>
          <textarea
            id="higgs-reference-text"
            value={higgsReferenceText}
            onChange={(e) => setHiggsReferenceText(e.target.value)}
            rows={3}
          />

          <div className="demo-controls">
            <button
              type="button"
              className="button primary"
              onClick={handleHiggsGenerate}
              disabled={higgsStatus === "loading"}
            >
              {higgsStatus === "loading" ? "Generating with Higgs …" : "Generate with Higgs"}
            </button>
          </div>
        </div>

        {higgsStatus === "loading" && (
          <div className="status-bar loading" role="status">
            <span className="spinner" aria-hidden="true" />
            Generating speech with Higgs TTS …
          </div>
        )}

        {higgsStatus === "done" && higgsAudioUrl && (
          <div className="result-panel">
            <div className="status-bar success" role="status">
              Generated in {higgsGenerationTime?.toFixed(1)}s · Higgs TTS
            </div>
            <audio controls src={higgsAudioUrl} className="audio-player" />
            <a className="button secondary" href={higgsAudioUrl} download="higgs-tts.wav">
              Download WAV
            </a>
          </div>
        )}

        {higgsStatus === "error" && higgsError && (
          <div className="status-bar error" role="alert">
            {higgsError}
          </div>
        )}

        <div className="sample-stack higgs-samples" aria-label="Higgs sample prompts">
          {HIGGS_SAMPLES.map((sample) => (
            <p
              key={sample}
              role="button"
              tabIndex={0}
              onClick={() => setHiggsText(sample)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setHiggsText(sample);
              }}
            >
              {sample}
            </p>
          ))}
        </div>
      </section>

      <section className="demo-shell omnivoice-shell">
        <p className="eyebrow">Multilingual model bench</p>
        <h2>OmniVoice cloning.</h2>
        <p>
          Test k2-fsa OmniVoice for multilingual zero-shot cloning across more
          than 600 supported languages. Reference audio and transcript are
          required for this mode.
        </p>

        <div className="demo-composer omnivoice-composer" aria-label="OmniVoice composer">
          <label htmlFor="omnivoice-text">Text to synthesise</label>
          <textarea
            id="omnivoice-text"
            value={omniText}
            onChange={(e) => setOmniText(e.target.value)}
            rows={4}
          />

          <div className="upload-zone">
            <label className="upload-label" htmlFor="omnivoice-voice-sample">
              Reference voice sample
            </label>
            <input
              ref={omniFileInputRef}
              id="omnivoice-voice-sample"
              type="file"
              accept="audio/wav,audio/mpeg,audio/mp3,.wav,.mp3"
              onChange={handleOmniFileChange}
              className="file-input"
            />
            <button
              type="button"
              className="button secondary upload-trigger"
              onClick={() => omniFileInputRef.current?.click()}
            >
              {omniAudioFile ? "Change file" : "Choose reference"}
            </button>
            {omniFileName && (
              <span className="file-info">
                {omniFileName} ({omniFileSize})
              </span>
            )}
          </div>

          <label htmlFor="omnivoice-reference-text">Reference transcript</label>
          <textarea
            id="omnivoice-reference-text"
            value={omniReferenceText}
            onChange={(e) => setOmniReferenceText(e.target.value)}
            rows={3}
          />

          <div className="demo-controls">
            <button
              type="button"
              className="button primary"
              onClick={handleOmniGenerate}
              disabled={omniStatus === "loading"}
            >
              {omniStatus === "loading" ? "Generating with OmniVoice …" : "Generate with OmniVoice"}
            </button>
          </div>
        </div>

        {omniStatus === "loading" && (
          <div className="status-bar loading" role="status">
            <span className="spinner" aria-hidden="true" />
            Generating speech with OmniVoice …
          </div>
        )}

        {omniStatus === "done" && omniAudioUrl && (
          <div className="result-panel">
            <div className="status-bar success" role="status">
              Generated in {omniGenerationTime?.toFixed(1)}s · OmniVoice
            </div>
            <audio controls src={omniAudioUrl} className="audio-player" />
            <a className="button secondary" href={omniAudioUrl} download="omnivoice.wav">
              Download WAV
            </a>
          </div>
        )}

        {omniStatus === "error" && omniError && (
          <div className="status-bar error" role="alert">
            {omniError}
          </div>
        )}

        <div className="sample-stack omnivoice-samples" aria-label="OmniVoice sample prompts">
          {OMNIVOICE_SAMPLES.map((sample) => (
            <p
              key={sample}
              role="button"
              tabIndex={0}
              onClick={() => setOmniText(sample)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setOmniText(sample);
              }}
            >
              {sample}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
