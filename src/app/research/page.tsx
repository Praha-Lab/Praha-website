import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { projects } from "../site-data";

export const metadata: Metadata = { title: "Research & Open Source | Praha Lab", description: "Explore genuine public models, datasets, and code from Praha Lab and founder Pranav Harshan.", openGraph: { title: "Research & Open Source | Praha Lab", description: "Public technical work from Praha Lab and its founder.", url: "https://prahalab.com/research" } };

export default function ResearchPage() {
  return <main className="cut-site" id="top"><link rel="canonical" href="https://prahalab.com/research" /><a className="cut-skip" href="#main-content">Skip to content</a><SiteHeader active="research" /><div id="main-content"><section className="cut-container research-hero"><p className="cut-eyebrow">PRAHA LAB / PUBLIC WORK</p><h1>Built in<br /><em>the open.</em></h1><div><p>Praha Cut is our flagship product. Our broader work in speech, visual generation, and agents is documented through public models, datasets, and source code.</p><Link href="/cut">Meet Praha Cut ↗</Link></div></section><section className="cut-container research-index"><div className="visual-intro"><span>SELECTED WORK</span><span>LINKED TO THE SOURCE</span></div>{projects.map((project, index) => <article key={project.title}><span className="research-index-number">{String(index + 1).padStart(2, "0")}</span><div><small>{project.type}</small><h2>{project.title}</h2><p>{project.copy}</p></div><a href={project.href} target="_blank" rel="noopener noreferrer">{project.link} ↗</a></article>)}</section><section className="cut-container research-more"><p>More from Praha Lab</p><div><a href="https://huggingface.co/Praha-Labs">Hugging Face ↗</a><a href="https://github.com/Praha-Lab">GitHub ↗</a><Link href="/demo">RimaTTS preview ↗</Link></div></section></div><SiteFooter /></main>;
}
