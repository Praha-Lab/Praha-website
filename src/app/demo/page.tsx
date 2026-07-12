"use client";

import { ArrowLeft, FileAudio } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SAMPLES = [
  {
    language: "Hindi",
    text: "नमस्ते। यह रीमा टीटीएस की आवाज़ है, जिसे प्राहा लैब्स ने बनाया है।",
  },
  {
    language: "Bengali",
    text: "নমস্কার। এটি প্রাহা ল্যাবসের রিমা টিটিএস মডেলের কণ্ঠস্বর।",
  },
  {
    language: "Tamil",
    text: "வணக்கம். இது பிராஹா லேப்ஸ் உருவாக்கிய ரிமா டிடிஎஸ் குரல்.",
  },
  {
    language: "English",
    text: "RimaTTS generates multilingual Indian speech from a short reference voice.",
  },
];

const SUPPORTED_LANGUAGES = [
  "Hindi",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
];

type Status = "idle" | "loading" | "done" | "error";

export default function DemoPage() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Enter the text you want RimaTTS to speak.");
      setStatus("error");
      return;
    }

    if (!audioFile) {
      setError("Upload a clear reference voice recording longer than five seconds.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);
    setGenerationTime(null);
    const start = performance.now();

    try {
      const formData = new FormData();
      formData.set("text", text.trim());
      formData.set("audio", audioFile);

      const response = await fetch("/api/inference", {
        method: "POST",
        body: formData,
      });
      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok || contentType.includes("application/json")) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Generation failed (${response.status}).`);
      }

      if (!contentType.includes("audio/")) {
        throw new Error("The model returned an unexpected response.");
      }

      const blob = await response.blob();
      if (blob.size < 500) {
        throw new Error("The generated audio was incomplete. Please try again.");
      }

      const nextAudioUrl = URL.createObjectURL(blob);
      setAudioUrl((currentUrl) => {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        return nextAudioUrl;
      });
      setGenerationTime((performance.now() - start) / 1000);
      setStatus("done");
    } catch (caughtError) {
      setError((caughtError as Error).message);
      setStatus("error");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;

    setAudioFile(nextFile);
    setError(null);
    setStatus("idle");
  };

  const fileSize = audioFile
    ? audioFile.size > 1024 * 1024
      ? `${(audioFile.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.ceil(audioFile.size / 1024)} KB`
    : null;

  return (
    <main className="demo-page">
      <header className="demo-topbar">
        <Link className="wordmark" href="/" aria-label="Back to Praha Lab">
          <span aria-hidden="true" />
          Praha Lab
        </Link>
        <Link className="demo-back" href="/">
          <ArrowLeft aria-hidden="true" size={15} />
          Lab home
        </Link>
      </header>

      <div className="demo-layout">
        <section className="demo-intro" aria-labelledby="demo-title">
          <p className="section-label">Release 001 / Interactive demo</p>
          <h1 id="demo-title">
            RimaTTS <small>V1</small>
          </h1>
          <p className="demo-lede">
            Generate multilingual Indian speech using a short recording of the
            voice you want to clone.
          </p>

          <dl className="demo-facts">
            <div>
              <dt>Coverage</dt>
              <dd>8 Indian languages</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>Voice cloning</dd>
            </div>
          </dl>

          <div className="demo-language-list">
            <span className="meta-label">Supported languages</span>
            <p>{SUPPORTED_LANGUAGES.join(" · ")}</p>
          </div>
        </section>

        <section className="inference-panel" aria-labelledby="inference-title">
          <div className="inference-head">
            <div>
              <p className="section-label">Inference</p>
              <h2 id="inference-title">Generate speech</h2>
            </div>
            <span className="live-indicator">
              <i aria-hidden="true" /> Live
            </span>
          </div>

          <div className="inference-form">
            <div className="field-group">
              <label htmlFor="voice-sample">Reference voice</label>
              <p>Use a clear recording with at least five seconds of speech.</p>
              <input
                ref={fileInputRef}
                id="voice-sample"
                type="file"
                accept="audio/wav,audio/mpeg,audio/mp3,.wav,.mp3"
                onChange={handleFileChange}
                className="visually-hidden-input"
              />
              <button
                type="button"
                className="upload-control"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileAudio aria-hidden="true" size={19} />
                <span>
                  <strong>{audioFile ? audioFile.name : "Choose an audio file"}</strong>
                  <small>{audioFile ? fileSize : "WAV or MP3 · Maximum 10 MB"}</small>
                </span>
              </button>
            </div>

            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="demo-text">Text to synthesise</label>
                <span>{text.length} / 1000</span>
              </div>
              <textarea
                id="demo-text"
                value={text}
                maxLength={1000}
                onChange={(event) => setText(event.target.value)}
                rows={6}
              />
            </div>

            <div className="sample-prompts" aria-label="Example text">
              <span className="meta-label">Examples</span>
              <div>
                {SAMPLES.map((sample) => (
                  <button
                    type="button"
                    key={sample.language}
                    onClick={() => setText(sample.text)}
                  >
                    {sample.language}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="generate-button"
              onClick={handleGenerate}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Preparing the model
                </>
              ) : (
                "Generate speech"
              )}
            </button>
          </div>

          {status === "loading" && (
            <div className="inference-status" role="status">
              A cold start can take longer. Keep this page open while RimaTTS
              prepares the audio.
            </div>
          )}

          {status === "error" && error && (
            <div className="inference-status inference-error" role="alert">
              {error}
            </div>
          )}

          {status === "done" && audioUrl && (
            <div className="result-panel" aria-live="polite">
              <div>
                <span>Generated audio</span>
                <strong>{generationTime?.toFixed(1)} seconds</strong>
              </div>
              <audio controls src={audioUrl} className="audio-player" />
              <a className="download-link" href={audioUrl} download="rimats-v1.wav">
                Download WAV
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
