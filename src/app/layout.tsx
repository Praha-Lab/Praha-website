import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://prahalab.com";
const description = "Praha Lab is an early-stage AI startup building infrastructure and applications across AI agents, developer tools, voice AI, and efficient AI inference.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Praha Lab — AI Infrastructure, Agents, Voice & Developer Tools",
    template: "%s | Praha Lab",
  },
  description,
  applicationName: "Praha Lab",
  authors: [{ name: "Praha Lab" }],
  creator: "Praha Lab",
  keywords: [
    "Praha Lab",
    "AI infrastructure",
    "AI agents",
    "developer tools",
    "voice AI",
    "efficient inference",
  ],
  alternates: {
    canonical: "https://prahalab.com/",
  },
  openGraph: {
    type: "website",
    siteName: "Praha Lab",
    title: "Praha Lab",
    description,
    url: "https://prahalab.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Praha Lab",
    description,
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
