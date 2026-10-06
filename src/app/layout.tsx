import type { Metadata } from "next";
import "./globals.css";
import "./cut.css";

const siteUrl = "https://prahalab.com";
const description = "Praha Lab builds intelligent products that combine frontier AI models with purpose-built tools. Meet Praha Cut, our agentic video editor for turning editing intent into an editable timeline.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Praha Lab — Building Agentic Creative Tools",
    template: "%s | Praha Lab",
  },
  description,
  applicationName: "Praha Lab",
  authors: [{ name: "Praha Lab" }],
  creator: "Praha Lab",
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Praha Lab",
    "Praha Cut",
    "agentic video editor",
    "editable timeline",
    "creative tools",
  ],
  openGraph: {
    type: "website",
    siteName: "Praha Lab",
    title: "Praha Lab — Building Agentic Creative Tools",
    description,
    url: "https://prahalab.com/",
    images: [{ url: "/cut-social.svg", width: 1200, height: 630, alt: "Praha Cut editor concept with video preview and editable timeline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Praha Lab — Building Agentic Creative Tools",
    description,
    images: ["/cut-social.svg"],
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
