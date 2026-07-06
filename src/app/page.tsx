const focusAreas = [
  {
    title: "Models",
    copy: "Focused releases with clear evaluation targets and product constraints.",
  },
  {
    title: "Inference",
    copy: "Serving paths designed around latency, reliability, and cost.",
  },
  {
    title: "Interfaces",
    copy: "Demos and APIs that make model behavior easier to inspect.",
  },
];

const releaseDetails = [
  ["Release", "001"],
  ["Model", "RimaTTS"],
  ["Track", "Speech"],
  ["Status", "Demo available"],
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
          <a href="#rimatts">RimaTTS</a>
          <a href="/demo">Demo</a>
        </nav>
      </header>

      <section id="top" className="brand-hero">
        <div className="hero-content">
          <p className="section-label">Applied AI laboratory</p>
          <h1>Praha Labs</h1>
          <p>
            Model releases, inference systems, and demos built together for
            production use.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="#lab">
              Explore lab
            </a>
            <a className="button button-secondary" href="#rimatts">
              View RimaTTS
            </a>
          </div>
        </div>

        <aside className="hero-brief" aria-label="Latest release">
          <div className="brief-header">
            <span>Latest release</span>
            <strong>RimaTTS</strong>
          </div>
          <p>
            Speech generation for product demos, agents, narration, and
            workflow tools.
          </p>
          <dl>
            {releaseDetails.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <a className="text-link" href="/demo">
            Open demo
          </a>
        </aside>
      </section>

      <section id="lab" className="lab-statement">
        <p className="section-label">Lab</p>
        <div>
          <h2>Research, serving, and product work in the same loop.</h2>
          <p>
            Praha Labs develops applied AI systems where model behavior,
            inference performance, and the user surface are evaluated together.
          </p>
        </div>
      </section>

      <section className="focus-grid" aria-label="Praha Labs focus areas">
        {focusAreas.map((area) => (
          <article key={area.title}>
            <h3>{area.title}</h3>
            <p>{area.copy}</p>
          </article>
        ))}
      </section>

      <section id="rimatts" className="release-section">
        <div className="release-copy">
          <span>Release 001</span>
          <h2>RimaTTS</h2>
          <p>
            Our first speech model focuses on clear generated voice, fast
            iteration, and a demo path that makes quality easy to judge.
          </p>
          <a className="button button-primary" href="/demo">
            Open demo
          </a>
        </div>

        <dl className="release-details" aria-label="RimaTTS details">
          {releaseDetails.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="closing">
        <p>
          RimaTTS opens the speech track. Future releases will keep the same
          standard: measurable quality, practical serving, and a usable surface.
        </p>
      </section>
    </main>
  );
}
