const labStats = [
  ["Lab", "Applied AI"],
  ["First release", "Praha Voice-1"],
  ["Focus", "Models + tools"],
  ["Access", "API live"],
];

const researchTracks = [
  {
    title: "Speech systems",
    copy: "Voice generation, low-latency audio, and model interfaces for products that need to speak clearly.",
  },
  {
    title: "Agent tooling",
    copy: "APIs, demos, and workflow surfaces that make AI models easier to test, operate, and ship.",
  },
  {
    title: "Compact inference",
    copy: "Smaller, faster model paths for practical deployment rather than benchmark-only research.",
  },
];

const modelStats = [
  ["Model", "Praha Voice-1"],
  ["Type", "Text-to-speech"],
  ["Audio", "48 kHz"],
  ["Latency", "Sub-second"],
];

const voices = ["Atlas", "Mira", "Nora", "Sol"];

const releases = [
  ["Praha Voice-1", "Released", "Text-to-speech for apps, agents, and narration."],
  ["Praha AgentKit", "Research", "Tools for evaluating and operating model-driven workflows."],
  ["Praha Compact", "Research", "Small-model inference experiments for production surfaces."],
];

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Praha Labs home">
          <span className="brand-mark" aria-hidden="true" />
          <span>Praha Labs</span>
        </a>
        <nav>
          <a href="#lab">Lab</a>
          <a href="#voice">Voice-1</a>
          <a href="#releases">Releases</a>
          <a href="/demo">Demo</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Praha Labs / applied AI</p>
          <h1>Building useful AI models and the tools around them.</h1>
          <p className="hero-lede">
            Praha Labs is an applied AI lab building model systems for real
            product surfaces. Our first release is Praha Voice-1, a
            text-to-speech model for agents, apps, narration, and developer
            workflows.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button primary" href="#voice">
              Explore Voice-1
            </a>
            <a className="button secondary" href="/demo">
              Open demo
            </a>
          </div>
        </div>

        <aside className="voice-console" aria-label="Praha Labs first model preview">
          <div className="console-header">
            <span>First model release</span>
            <strong>Praha Voice-1</strong>
          </div>
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 46 }).map((_, index) => (
              <span key={index} style={{ "--i": index } as React.CSSProperties} />
            ))}
          </div>
          <div className="voice-readout">
            {modelStats.map(([label, value]) => (
              <div className="readout-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="status-strip" aria-label="Praha Labs facts">
        {labStats.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section id="lab" className="section work-section">
        <div className="section-heading">
          <p className="eyebrow">The lab</p>
          <h2>One lab, multiple model directions.</h2>
        </div>
        <div className="capability-grid">
          {researchTracks.map((item, index) => (
            <article className="capability" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="voice" className="voice-feature section">
        <div>
          <p className="eyebrow">First release</p>
          <h2>Praha Voice-1 turns text into production-ready speech.</h2>
        </div>
        <div className="feature-copy">
          <p>
            Voice-1 is the first public model from Praha Labs. It is designed
            for products that need clear generated speech with low latency,
            controllable voices, and API behavior that can fit into real
            application stacks.
          </p>
          <div className="feature-actions">
            <a className="button primary" href="/demo">
              Try Voice-1
            </a>
            <a className="button secondary" href="#api">
              View API
            </a>
          </div>
        </div>
      </section>

      <section id="studio" className="voice-studio section">
        <div>
          <p className="eyebrow">Voice studio</p>
          <h2>Choose a voice, set the style, stream the result.</h2>
        </div>
        <div className="voice-grid" aria-label="Available voices">
          {voices.map((voice) => (
            <article className="voice-card" key={voice}>
              <div className="voice-avatar" aria-hidden="true">
                {voice.slice(0, 1)}
              </div>
              <h3>{voice}</h3>
              <p>Balanced, production-ready English voice for app and agent output.</p>
            </article>
          ))}
        </div>
      </section>

      <section id="api" className="section api-section">
        <div className="section-heading">
          <p className="eyebrow">API</p>
          <h2>Generate speech from a simple request.</h2>
        </div>
        <div className="code-panel" aria-label="API example">
          <pre>
            <code>{`POST /api/inference
{
  "model": "praha-voice-1",
  "voice": "atlas",
  "text": "Welcome to Praha Labs."
}`}</code>
          </pre>
        </div>
      </section>

      <section id="releases" className="section usecase-section">
        <div>
          <p className="eyebrow">Model releases</p>
          <h2>The release page starts with voice, not ends there.</h2>
        </div>
        <div className="milestones">
          {releases.map(([title, status, copy], index) => (
            <article className="milestone" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>
                <strong>{status}</strong>
                {copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing">
        <p className="eyebrow">Praha Labs</p>
        <h2>Explore the lab and the first model.</h2>
        <a className="button primary" href="/demo">
          Open Voice-1 demo
        </a>
      </section>
    </main>
  );
}
