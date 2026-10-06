export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Praha Lab",
  url: "https://prahalab.com/",
  description: "Praha Lab is an early-stage AI company building intelligent products that combine reasoning models with purpose-built tools.",
  foundingDate: "2026",
  founder: {
    "@type": "Person",
    name: "Pranav Harshan",
    sameAs: ["https://github.com/Pranavharshans", "https://www.linkedin.com/in/pranavharshan-s"],
  },
  email: "founder@prahalab.com",
  sameAs: ["https://github.com/Praha-Lab", "https://huggingface.co/Praha-Labs"],
};

export const projects = [
  { type: "Open model / Voice", title: "PrahaTTS-ML", copy: "A public Malayalam text-to-speech LoRA adapter for the Chatterbox non-turbo base model, with its base-model requirements documented.", href: "https://huggingface.co/Praha-Labs/PrahaTTS-ML", link: "Model card" },
  { type: "Open dataset / Speech", title: "Malayalam emotion-balanced speech", copy: "A public audio and text dataset for Malayalam speech work with language, speaker gender, and style fields.", href: "https://huggingface.co/datasets/Praha-Labs/malayalam-emotion-balanced", link: "Dataset" },
  { type: "Open model / Visual reasoning", title: "Qwen3.5-4B TikZ LoRA", copy: "A published adapter for instruction-to-TikZ generation. Its model card covers training provenance, evaluation, and limitations.", href: "https://huggingface.co/Praha-Labs/Qwen3.5-4B-TikZ-LoRA", link: "Model card" },
  { type: "Founder open source / Agents", title: "AutoScribe-CrewAI", copy: "Pranav Harshan’s public multi-agent research and writing project with planner, writer, and editor roles.", href: "https://github.com/Pranavharshans/AutoScribe-CrewAI", link: "Source code" },
];
