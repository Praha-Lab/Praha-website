import { ArrowRight } from "lucide-react";

import { DitherCard } from "./dither-card";

const releases = [
  {
    name: "RimaTTS",
    number: "Current",
    status: "Demo available",
    track: "Official Praha Labs release",
    copy: "Multilingual text-to-speech and voice cloning model. The first public release from Praha Labs.",
    featured: true,
  },
  {
    name: "Higgs TTS Evaluation",
    number: "Eval",
    status: "Benchmarking",
    track: "External model",
    copy: "External speech model used for comparison, inference tests, and quality benchmarking.",
  },
  {
    name: "OmniVoice Experiments",
    number: "Exp",
    status: "Research",
    track: "External experiments",
    copy: "Voice cloning and multilingual speech experiments used to study broader speaker and language coverage.",
  },
];

const labRows = [
  ["Research", "We explore model architectures, training methods, evaluation targets, and failure cases."],
  ["Serving", "We care about latency, cold starts, routing, deployment cost, and reliable inference."],
  ["Surface", "Demos and APIs that make model behavior easy to judge."],
];

const buildAreas = [
  ["Speech Models", "Text-to-speech, voice cloning, ASR, and real-time speech systems."],
  ["Language Systems", "LLM workflows, reasoning systems, evaluation tools, and applied language models."],
  ["Agentic AI", "Tool-using agents, automation workflows, memory systems, and model orchestration."],
  ["Multimodal Models", "Systems that combine text, audio, vision, and interaction into usable AI products."],
];

const roadmap = [
  "RimaTTS demo release",
  "Better multilingual speech quality",
  "Voice cloning improvements",
  "API access",
  "Real-time speech systems",
  "ASR experiments",
  "Agent and multimodal model releases",
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
          <a href="#build">Build</a>
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
          <p className="hero-tagline">Beyond Artificial. Toward Intelligence.</p>
          <p>
            Praha Labs is an applied AI lab building models, tools, and systems
            for speech, language, agents, and multimodal intelligence.
          </p>
          <p>
            Our work begins with RimaTTS, a multilingual text-to-speech and voice
            cloning model, and expands toward a broader release line of practical
            AI systems.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="/demo">
              Try RimaTTS
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
                RimaTTS is the first public release from Praha Labs: a
                multilingual text-to-speech and voice cloning model.
              </p>
            </div>

            <dl className="release-specs">
              <div>
                <dt>Status</dt>
                <dd>Demo available</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Speech generation</dd>
              </div>
            </dl>

            <a className="release-info-action" href="/demo">
              <span>Try RimaTTS</span>
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
            </a>
          </div>
        </aside>
      </section>

      <section id="lab" className="lab-section">
        <div className="section-head">
          <p className="section-label">Lab system</p>
          <h2>A lab for usable AI releases.</h2>
          <p>
            Praha Labs builds applied AI systems that move from research
            prototypes to usable model releases.
          </p>
          <p>
            We work across speech, language, agents, and multimodal AI. Each
            release is designed to be tested through demos, improved through
            real-world feedback, and eventually shaped into production-ready
            systems.
          </p>
          <p>
            Praha Labs connects research, inference, and product surfaces so
            models can be tested beyond notebooks.
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

      <section id="first-release" className="first-release-section">
        <div className="section-head">
          <p className="section-label">Release 001</p>
          <h2>First Release: RimaTTS</h2>
          <p>
            RimaTTS is the first public release from Praha Labs: a multilingual
            text-to-speech and voice cloning model.
          </p>
          <p>
            It represents the lab&apos;s release philosophy: build useful models,
            expose them through demos, test them in real scenarios, and improve
            them toward production-ready systems.
          </p>
        </div>

        <div className="release-cta-row" aria-label="RimaTTS actions">
          <a className="button button-primary" href="/demo">
            Try RimaTTS
          </a>
          <a className="button button-secondary" href="#releases">
            View Model
          </a>
        </div>
      </section>

      <section id="build" className="build-section">
        <div className="section-head">
          <p className="section-label">Scope</p>
          <h2>What We Build</h2>
        </div>

        <div className="build-grid">
          {buildAreas.map(([title, copy]) => (
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
          <h2>Current Release</h2>
          <p>
            Official Praha Labs releases are listed separately from external
            evaluations and experiments.
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

      <section className="roadmap-section">
        <div className="section-head">
          <p className="section-label">Roadmap</p>
          <h2>Roadmap</h2>
        </div>

        <ol className="roadmap-list">
          {roadmap.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="closing-band">
        <div>
          <p className="section-label">Praha Labs</p>
          <h2>Build with Praha Labs</h2>
          <p>
            We are opening early access to demos, model releases, and applied AI
            experiments. Reach out for collaborations, API access, evaluations,
            or research partnerships.
          </p>
        </div>
        <div className="closing-actions">
          <a className="button button-primary" href="mailto:hello@prahalabs.ai">
            Contact
          </a>
          <a className="button button-primary" href="/demo">
            Try RimaTTS
          </a>
          <a className="button button-primary" href="#releases">
            View Releases
          </a>
        </div>
      </section>
    </main>
  );
}
