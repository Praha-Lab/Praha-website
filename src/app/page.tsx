import { ArrowDownRight, ArrowRight } from "lucide-react";

import { DitherCard } from "./dither-card";

const domains = [
  {
    index: "01",
    title: "Speech",
    copy: "Speech generation, recognition, voice interfaces, and real-time audio systems.",
  },
  {
    index: "02",
    title: "Language",
    copy: "Language models, reasoning systems, evaluation, and domain-specific intelligence.",
  },
  {
    index: "03",
    title: "Agents",
    copy: "Tool-using systems that can plan, act, remember, and operate across workflows.",
  },
  {
    index: "04",
    title: "Multimodal",
    copy: "Models and products that work across text, audio, vision, and interaction.",
  },
];

const languages = [
  "Hindi",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
];

const labSystem = [
  {
    number: "01",
    title: "Research",
    copy: "Model architecture, training, evaluation, and the failure modes that determine whether a system is useful.",
  },
  {
    number: "02",
    title: "Infrastructure",
    copy: "Inference, latency, deployment, and the operational layer required to run models beyond a notebook.",
  },
  {
    number: "03",
    title: "Products",
    copy: "Focused interfaces and APIs that make model behavior observable, testable, and accessible.",
  },
];

export default function Home() {
  return (
    <main id="top" className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="topbar" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Praha Lab home">
          <span aria-hidden="true" />
          Praha Lab
        </a>
        <nav aria-label="Primary">
          <a href="#lab">Lab</a>
          <a href="#domains">Research</a>
          <a href="#rimats">RimaTTS</a>
          <a href="/demo">Demo</a>
        </nav>
      </header>

      <div id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-rail" aria-hidden="true">
            <span>LAB / 001</span>
            <span>Applied intelligence</span>
          </div>

          <div className="hero-main">
            <p className="section-label">Applied AI laboratory</p>
            <h1 id="hero-title">Praha Lab</h1>
            <p className="hero-tagline">Beyond Artificial. Toward Intelligence.</p>
            <p className="hero-summary">
              We develop AI models and the systems required to evaluate, deploy,
              and use them across speech, language, agents, and multimodal
              intelligence.
            </p>
            <div className="hero-actions" aria-label="Primary actions">
              <a className="button button-primary" href="#rimats">
                Explore the first release
                <ArrowDownRight aria-hidden="true" size={16} />
              </a>
              <a className="text-link" href="#domains">
                Research areas
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </div>
          </div>

          <aside className="lab-register" aria-label="Praha Lab research register">
            <div className="register-head">
              <span>Lab register</span>
              <span>2026</span>
            </div>
            <dl>
              <div>
                <dt>Current release</dt>
                <dd>RimaTTS V1</dd>
              </div>
              <div>
                <dt>Research areas</dt>
                <dd>04</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>Models + systems</dd>
              </div>
            </dl>
            <p>
              Research and engineering for AI systems that can be examined in
              real use, not only measured in isolation.
            </p>
          </aside>
        </section>

        <section id="domains" className="domains-section" aria-labelledby="domains-title">
          <div className="section-intro section-intro-light">
            <p className="section-label">Research domains</p>
            <h2 id="domains-title">One lab. Multiple model systems.</h2>
            <p>
              Praha Lab works across the layers between model research and
              deployed intelligence.
            </p>
          </div>

          <div className="domain-grid">
            {domains.map((domain) => (
              <article key={domain.title}>
                <span>{domain.index}</span>
                <h3>{domain.title}</h3>
                <p>{domain.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="rimats" className="release-section" aria-labelledby="release-title">
          <div className="release-heading">
            <div>
              <p className="section-label">Release 001 / Speech</p>
              <h2 id="release-title">RimaTTS <small>V1</small></h2>
            </div>
            <p>
              A multilingual Indian text-to-speech model with voice cloning,
              built for natural speech across eight languages.
            </p>
          </div>

          <div className="release-layout">
            <DitherCard className="release-dither-panel">
              <span>Praha Lab / Model 001</span>
              <strong>
                RimaTTS <small>V1</small>
              </strong>
            </DitherCard>

            <div className="release-details">
              <div className="release-statement">
                <p>
                  RimaTTS generates speech and clones a speaker&apos;s voice from a
                  short reference recording. It is the first public model from
                  Praha Lab.
                </p>
              </div>

              <dl className="release-facts">
                <div>
                  <dt>Languages</dt>
                  <dd>8 Indian languages</dd>
                </div>
                <div>
                  <dt>Capability</dt>
                  <dd>Voice cloning</dd>
                </div>
                <div>
                  <dt>Version</dt>
                  <dd>V1</dd>
                </div>
                <div>
                  <dt>Access</dt>
                  <dd>Live demo</dd>
                </div>
              </dl>

              <div className="language-block">
                <span className="meta-label">Language coverage</span>
                <ul>
                  {languages.map((language) => (
                    <li key={language}>{language}</li>
                  ))}
                </ul>
              </div>

              <a className="release-action" href="/demo">
                <span>
                  <small>Interactive inference</small>
                  Try RimaTTS
                </span>
                <ArrowRight aria-hidden="true" size={22} />
              </a>
            </div>
          </div>
        </section>

        <section id="lab" className="lab-section" aria-labelledby="lab-title">
          <div className="section-intro">
            <p className="section-label">The lab</p>
            <h2 id="lab-title">Models are one part of the system.</h2>
            <p>
              Our work combines research, infrastructure, and product
              engineering. Each layer informs the next.
            </p>
          </div>

          <div className="lab-system">
            {labSystem.map((item) => (
              <article key={item.title}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-band" aria-labelledby="contact-title">
          <div>
            <p className="section-label">The lab</p>
            <h2 id="contact-title">Research. Systems. Intelligence.</h2>
          </div>
          <div className="contact-copy">
            <p>
              For model access, evaluation, research, or technical
              collaboration.
            </p>
            <a className="button button-light" href="mailto:hello@prahalabs.ai">
              Contact the lab
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top">
          <span aria-hidden="true" />
          Praha Lab
        </a>
        <p>Beyond Artificial. Toward Intelligence.</p>
        <div>
          <a href="/demo">RimaTTS demo</a>
          <a href="mailto:hello@prahalabs.ai">Email</a>
        </div>
      </footer>
    </main>
  );
}
