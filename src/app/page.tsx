import { ArrowDownRight, ArrowRight } from "lucide-react";
import { DitherCard } from "./dither-card";

const work = [
  { number: "01", title: "Agentic & developer infrastructure", copy: "Building developer tools and experimenting with tool-using agents, context retrieval, and coding workflows for complex tasks." },
  { number: "02", title: "Voice AI", copy: "Developing speech models and voice infrastructure, with public work on Malayalam text-to-speech and speech data." },
  { number: "03", title: "Efficient AI infrastructure", copy: "Researching inference, model serving, and local AI to make capable systems practical on constrained hardware." },
];

const projects = [
  { type: "Open model · Research", title: "PrahaTTS-ML", copy: "A public Malayalam text-to-speech LoRA adapter for the Chatterbox non-turbo base model. The model card documents the adapter and its required base model.", href: "https://huggingface.co/Praha-Labs/PrahaTTS-ML", link: "View model on Hugging Face" },
  { type: "Open dataset", title: "Malayalam emotion-balanced speech", copy: "A public audio and text dataset for Malayalam speech work, with language, speaker gender, and style fields.", href: "https://huggingface.co/datasets/Praha-Labs/malayalam-emotion-balanced", link: "View dataset on Hugging Face" },
  { type: "Open model · Research", title: "Qwen3.5-4B TikZ LoRA", copy: "A published LoRA adapter for instruction-to-TikZ generation. Its model card includes training provenance, evaluation notes, and limitations.", href: "https://huggingface.co/Praha-Labs/Qwen3.5-4B-TikZ-LoRA", link: "View model on Hugging Face" },
  { type: "Founder open source", title: "AutoScribe-CrewAI", copy: "Pranav Harshan's public multi-agent article research and writing project, with planner, writer, and editor roles.", href: "https://github.com/Pranavharshans/AutoScribe-CrewAI", link: "View source on GitHub" },
];

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Praha Lab",
  url: "https://prahalab.com/",
  description: "Praha Lab is an early-stage AI startup building infrastructure and applications across AI agents, developer tools, voice AI, and efficient AI inference.",
  foundingDate: "2026",
  founder: { "@type": "Person", name: "Pranav Harshan", sameAs: ["https://github.com/Pranavharshans", "https://www.linkedin.com/in/pranavharshan-s"] },
  email: "founder@prahalab.com",
  sameAs: ["https://github.com/Praha-Lab", "https://huggingface.co/Praha-Labs"],
};

export default function Home() {
  return (
    <main id="top" className="site-shell">
      <link rel="canonical" href="https://prahalab.com/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="topbar" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Praha Lab home"><span aria-hidden="true" />Praha Lab</a>
        <nav aria-label="Primary"><a href="#work">Work</a><a href="#projects">Projects</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
      </header>
      <div id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-rail" aria-hidden="true"><span>LAB / 001</span><span>Applied AI</span></div>
          <div className="hero-main">
            <p className="section-label">AI / Machine Learning · India</p>
            <h1 id="hero-title">Praha Lab</h1>
            <p className="hero-tagline">Building practical AI infrastructure for agents, voice, and developer tools.</p>
            <p className="hero-summary">Praha Lab is an early-stage AI startup building developer tools, agentic systems, voice AI infrastructure, and efficient AI inference.</p>
            <div className="hero-actions" aria-label="Primary actions">
              <a className="button button-primary" href="#projects">Explore our work <ArrowDownRight aria-hidden="true" size={16} /></a>
              <a className="text-link" href="https://huggingface.co/Praha-Labs">Praha Lab on Hugging Face <ArrowRight aria-hidden="true" size={16} /></a>
            </div>
          </div>
          <aside className="lab-register" aria-label="Praha Lab facts">
            <div className="register-head"><span>Lab register</span><span>2026</span></div>
            <dl><div><dt>Founded</dt><dd>2026</dd></div><div><dt>Based in</dt><dd>India</dd></div><div><dt>Field</dt><dd>AI / Machine Learning</dd></div><div><dt>Stage</dt><dd>Bootstrapped</dd></div></dl>
            <p>Public models and datasets document part of our ongoing research and engineering work.</p>
          </aside>
        </section>
        <section id="work" className="domains-section" aria-labelledby="work-title">
          <div className="section-intro section-intro-light"><p className="section-label">Areas of work</p><h2 id="work-title">What we&apos;re building</h2><p>Research and engineering across software, speech, and model systems.</p></div>
          <div className="domain-grid">{work.map((item) => <article key={item.title}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
        </section>
        <section id="projects" className="release-section" aria-labelledby="projects-title">
          <div className="release-heading"><div><p className="section-label">Public technical work</p><h2 id="projects-title">Projects &amp; Research</h2></div><p>Selected Praha Lab releases and founder work. Each link leads to the underlying public artifact.</p></div>
          <div className="project-list">{projects.map((project, index) => (
            <article className="project-row" key={project.title}>
              <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
              <div><span className="meta-label">{project.type}</span><h3>{project.title}</h3><p>{project.copy}</p></div>
              <a className="text-link" href={project.href}>{project.link}<ArrowRight aria-hidden="true" size={16} /></a>
            </article>
          ))}</div>
          <p className="project-more">More public work: <a href="https://huggingface.co/Praha-Labs">Praha Lab on Hugging Face</a> · <a href="https://github.com/Praha-Lab">Praha Lab on GitHub</a></p>
        </section>
        <section className="release-section preview-section" aria-labelledby="release-title">
          <div className="release-heading"><div><p className="section-label">Voice AI / In development</p><h2 id="release-title">RimaTTS <small>V1</small></h2></div><p>Our multilingual Indian speech preview. Public generation and curated samples are being prepared.</p></div>
          <div className="release-layout">
            <DitherCard className="release-dither-panel"><span>Praha Lab / Voice AI</span><strong>RimaTTS <small>V1</small></strong></DitherCard>
            <div className="release-details preview-details"><div className="release-statement"><p>RimaTTS is an in-development text-to-speech project. Its listening room describes the planned sample release.</p></div><a className="release-action" href="/demo"><span><small>Research preview</small>View RimaTTS</span><ArrowRight aria-hidden="true" size={22} /></a></div>
          </div>
        </section>
        <section id="about" className="lab-section" aria-labelledby="about-title">
          <div className="section-intro"><p className="section-label">The lab</p><h2 id="about-title">About Praha Lab</h2><p>Praha Lab is an early-stage, bootstrapped AI startup founded in 2026 and based in India. We work across AI agents, developer tools, voice AI, and efficient inference.</p></div>
          <div className="lab-system about-details">
            <article><span>01</span><h3>Founder</h3><div><p><strong>Pranav Harshan</strong><br />Founder, Praha Lab</p><p>Pranav works across AI infrastructure, developer tools, agentic systems, and voice AI.</p><a href="https://www.linkedin.com/in/pranavharshan-s">Pranav Harshan on LinkedIn <ArrowRight aria-hidden="true" size={15} /></a><a href="https://github.com/Pranavharshans">Pranav Harshan on GitHub <ArrowRight aria-hidden="true" size={15} /></a></div></article>
            <article><span>02</span><h3>Company facts</h3><p>Founded 2026 · India · AI / Machine Learning · Bootstrapped</p></article>
            <article><span>03</span><h3>Public work</h3><div><a href="https://huggingface.co/Praha-Labs">Praha Lab on Hugging Face</a><a href="https://github.com/Praha-Lab">Praha Lab on GitHub</a></div></article>
          </div>
        </section>
        <section id="contact" className="contact-band" aria-labelledby="contact-title">
          <div><p className="section-label">Contact</p><h2 id="contact-title">Get in touch.</h2></div>
          <div className="contact-copy"><p>For collaborations, research, developer inquiries, and general questions:</p><a className="contact-email" href="mailto:founder@prahalab.com">founder@prahalab.com</a></div>
        </section>
      </div>
      <footer className="site-footer">
        <div className="footer-identity"><a className="wordmark footer-wordmark" href="#top"><span aria-hidden="true" />Praha Lab</a><p>AI infrastructure for agents, voice, and developer tools.<br />Founded 2026 · India</p></div>
        <a href="mailto:founder@prahalab.com">founder@prahalab.com</a>
        <div className="footer-links"><a href="https://github.com/Praha-Lab">GitHub</a><a href="https://huggingface.co/Praha-Labs">Hugging Face</a><a href="https://www.linkedin.com/in/pranavharshan-s">LinkedIn</a></div>
      </footer>
    </main>
  );
}
