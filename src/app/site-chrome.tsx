import Link from "next/link";

export function SiteHeader({ active }: { active?: "product" | "research" | "about" }) {
  return <header className="cut-header">
    <Link className="cut-wordmark" href="/" aria-label="Praha Lab home"><span className="cut-mark" aria-hidden="true"><i /><i /><i /></span><span>Praha Lab</span></Link>
    <nav aria-label="Primary navigation">
      <Link className={active === "product" ? "is-active" : ""} href="/cut">Product</Link>
      <Link href="/cut#how-it-works">How it works</Link>
      <Link className={active === "research" ? "is-active" : ""} href="/research">Research</Link>
      <Link className={active === "about" ? "is-active" : ""} href="/#about">About</Link>
    </nav>
    <Link className="cut-header-cta" href="/#early-access">Join early access <span aria-hidden="true">↗</span></Link>
  </header>;
}

export function SiteFooter() {
  return <footer className="cut-footer cut-container">
    <div><Link className="cut-wordmark" href="/"><span className="cut-mark" aria-hidden="true"><i /><i /><i /></span><span>Praha Lab</span></Link><p>Building intelligent creative tools.<br />Founded 2026 · India</p></div>
    <div className="cut-footer-links"><Link href="/cut">Praha Cut</Link><Link href="/research">Research</Link><Link href="/demo">RimaTTS preview</Link><a href="https://github.com/Praha-Lab">GitHub</a><a href="https://huggingface.co/Praha-Labs">Hugging Face</a><a href="https://www.linkedin.com/in/pranavharshan-s">LinkedIn</a></div>
    <a href="mailto:founder@prahalab.com">founder@prahalab.com</a>
    <small>© {new Date().getFullYear()} Praha Lab</small>
  </footer>;
}
