import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RimaTTS V1 Demo",
  description:
    "Try RimaTTS V1, a multilingual Indian text-to-speech model with voice cloning across eight languages.",
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
