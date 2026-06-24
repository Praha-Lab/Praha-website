const capabilities = [
  {
    title: "Small model runtime",
    copy: "Compact inference targets for demos, internal agents, and production endpoints.",
  },
  {
    title: "Evaluation loop",
    copy: "Private harnesses for latency, quality, failure modes, and release readiness.",
  },
  {
    title: "Developer surface",
    copy: "A clean demo route now, API-backed sample inference when the first model is ready.",
  },
];

const milestones = [
  ["01", "Private model workbench", "Active"],
  ["02", "Sample inference demo", "Next"],
  ["03", "Public model card", "Queued"],
  ["04", "API access", "Queued"],
];

const consoleRows = [
  ["route", "/api/inference"],
  ["model", "private-preview"],
  ["state", "not released"],
  ["latency target", "real-time"],
];

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Praha Labs home">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>Praha Labs</span>
        </a>
        <nav>
          <a href="#work">Work</a>
          <a href="#roadmap">Roadmap</a>
          <a href="/demo">Demo</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Working name / private lab</p>
          <h1>Applied AI systems, released when ready.</h1>
          <p className="hero-lede">
            Praha Labs is preparing compact model systems, inference demos, and
            developer tools. No public model is released yet; the site is ready
            for the launch path.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button primary" href="mailto:hello@prahalabs.ai">
              Request early access
            </a>
            <a className="button secondary" href="/demo">
              Open demo shell
            </a>
          </div>
        </div>

        <div className="product-visual" aria-label="Praha Labs inference preview">
          <div className="visual-toolbar">
            <span>praha://preview</span>
            <span>Private</span>
          </div>
          <div className="visual-grid">
            <div className="orbit" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="console-card">
              <p>Inference endpoint</p>
              {consoleRows.map(([key, value]) => (
                <div className="console-row" key={key}>
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="visual-footer">
            <span>Release gate</span>
            <strong>Awaiting public model</strong>
          </div>
        </div>
      </section>

      <section id="work" className="section work-section">
        <div className="section-kicker">
          <p className="eyebrow">What is being built</p>
          <h2>A launch surface for models, demos, and developer access.</h2>
        </div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <article className="capability" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="statement-band" aria-label="Lab thesis">
        <p>
          Small models. Clear interfaces. Release only when behavior, latency,
          and failure modes are understood.
        </p>
      </section>

      <section id="roadmap" className="section roadmap-section">
        <div>
          <p className="eyebrow">Release path</p>
          <h2>Built now for the demos that come next.</h2>
        </div>
        <div className="milestones">
          {milestones.map(([number, title, status]) => (
            <article className="milestone" key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{status}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <p className="eyebrow">Early access</p>
          <h2>Want to see the first demo when it is live?</h2>
        </div>
        <a className="button primary" href="mailto:hello@prahalabs.ai">
          Contact the lab
        </a>
      </section>
    </main>
  );
}
