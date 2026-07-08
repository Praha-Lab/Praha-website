import { ArrowRight } from "lucide-react";

import { DitherCard } from "./dither-card";

const releases = [
  {
    name: "RimaTTS",
    number: "001",
    status: "Demo available",
    track: "Indian multilingual TTS",
    copy: "RimaTTS V1 is a multilingual Indian text-to-speech model with voice cloning support across 12 languages.",
    featured: true,
  },
  {
    name: "Higgs TTS",
    number: "002",
    status: "Research backend",
    track: "Expressive speech",
    copy: "A larger speech system kept in the lab for comparison, streaming, and inference experiments.",
  },
  {
    name: "OmniVoice",
    number: "003",
    status: "Experimental",
    track: "Multilingual voice",
    copy: "Voice cloning tests across broader language and speaker coverage.",
  },
];

const labRows = [
  ["Research", "Quality targets, failure cases, and release criteria."],
  ["Serving", "Latency, cold starts, routing, and cost discipline."],
  ["Surface", "Demos and APIs that make model behavior easy to judge."],
];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Praha Labs home">
          Praha Labs
        </a>
        <nav>
          <a href="#lab">Lab</a>
          <a href="#releases">Releases</a>
          <a href="/demo">Demo</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-index" aria-hidden="true">
          <span>AI LAB</span>
          <span>PRG</span>
        </div>

        <div className="hero-copy">
          <p className="section-label">Applied AI laboratory</p>
          <h1>Praha Labs</h1>
          <p>Applied AI systems lab for model releases, inference, and demos.</p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="/demo">
              Open demo
            </a>
            <a className="button button-secondary" href="#releases">
              View releases
            </a>
          </div>
        </div>

        <aside className="hero-release-card" aria-label="Featured model release">
          <DitherCard className="hero-dither-panel">
            <span>Release 001 / Speech</span>
            <strong>
              RimaTTS <small>V1</small>
            </strong>
          </DitherCard>

          <div className="release-info-panel">
            <div className="release-info-copy">
              <p>
                RimaTTS V1 is a multilingual Indian text-to-speech model with
                voice cloning support across 12 languages.
              </p>
            </div>

            <dl className="release-specs">
              <div>
                <dt>Status</dt>
                <dd>Demo available</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>12 Indian languages</dd>
              </div>
            </dl>

            <a className="release-info-action" href="/demo">
              <span>Open demo</span>
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
            </a>
          </div>
        </aside>
      </section>

      <section id="lab" className="lab-section">
        <div className="section-head">
          <p className="section-label">Lab system</p>
          <h2>A model lab, not a single product page.</h2>
          <p>
            Praha Labs keeps research, serving, and interface work in the same
            release loop.
          </p>
        </div>

        <div className="lab-rows">
          {labRows.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="releases" className="release-deck">
        <div className="section-head release-head">
          <p className="section-label">Model releases</p>
          <h2>First release: RimaTTS.</h2>
          <p>
            Speech is the first model track. The release catalogue is designed
            to grow beyond it.
          </p>
        </div>

        <div className="release-list">
          {releases.map((release) => (
            <article
              className={`model-card ${release.featured ? "featured-model" : ""}`}
              key={release.name}
            >
              <div className="model-number">{release.number}</div>
              <div className="model-main">
                <span className="model-track">{release.track}</span>
                <h3>{release.name}</h3>
                <p>{release.copy}</p>
              </div>

              <div className="model-status">
                <span>Status</span>
                <strong>{release.status}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-band">
        <div>
          <p className="section-label">Praha Labs</p>
          <h2>RimaTTS starts the release line. The lab keeps building from there.</h2>
        </div>
        <a className="button button-primary" href="/demo">
          Test the models
        </a>
      </section>
    </main>
  );
}
