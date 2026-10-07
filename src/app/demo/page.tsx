import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export default function DemoPage() {
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
          <p className="section-label">Release 001 / RimaTTS</p>
          <h1 id="demo-title">
            RimaTTS <small>V1</small>
          </h1>
          <p className="demo-lede">
            An in-development multilingual Indian text-to-speech project.
            Public samples are being prepared.
          </p>

          <dl className="demo-facts">
            <div>
              <dt>Coverage</dt>
              <dd>Eight languages planned</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>Research preview</dd>
            </div>
          </dl>

          <div className="demo-language-list">
            <span className="meta-label">Planned sample languages</span>
            <p>{SUPPORTED_LANGUAGES.join(" · ")}</p>
          </div>
        </section>

        <section className="inference-panel" aria-labelledby="samples-title">
          <div className="inference-head">
            <div>
              <p className="section-label">Listening room</p>
              <h2 id="samples-title">Audio samples</h2>
            </div>
            <span className="release-indicator">Preparing</span>
          </div>

          <div className="sample-release">
            <span className="sample-release-index">001 / Preview release</span>
            <div>
              <h3>Samples are being prepared.</h3>
              <p>
                Curated RimaTTS samples across the supported languages will be
                published here. Public generation is currently unavailable.
              </p>
            </div>
            <div className="sample-language-grid" aria-label="Planned sample languages">
              {SUPPORTED_LANGUAGES.map((language, index) => (
                <span key={language}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div className="inference-status" role="status">
            Sample playback will be enabled with the first curated release.
          </div>
        </section>
      </div>
    </main>
  );
}
