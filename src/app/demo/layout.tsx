import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RimaTTS V1",
  description:
    "RimaTTS V1 is an in-development multilingual Indian text-to-speech project. Public samples are being prepared.",
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
