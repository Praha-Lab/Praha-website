import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Praha Lab | Applied AI Laboratory",
    template: "%s | Praha Lab",
  },
  description:
    "Praha Lab develops AI models and systems across speech, language, agents, and multimodal intelligence. RimaTTS V1 is its first public release.",
  applicationName: "Praha Lab",
  authors: [{ name: "Praha Lab" }],
  creator: "Praha Lab",
  keywords: [
    "Praha Lab",
    "RimaTTS",
    "Indian text to speech",
    "voice cloning",
    "AI research lab",
    "multilingual speech",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Praha Lab",
    title: "Praha Lab | Applied AI Laboratory",
    description:
      "Models and systems across speech, language, agents, and multimodal intelligence.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Praha Lab | Applied AI Laboratory",
    description:
      "Models and systems across speech, language, agents, and multimodal intelligence.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
