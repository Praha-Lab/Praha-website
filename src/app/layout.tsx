import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Praha Labs | Applied AI Research",
  description:
    "Praha Labs is a working-name AI lab building private, precise, and production-minded model systems. Models are not released yet.",
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
