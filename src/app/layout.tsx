import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Praha Labs | Applied AI Models",
  description:
    "Praha Labs is an applied AI lab building models and tools for production workflows. Its first release is Praha Voice-1, a text-to-speech model.",
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
