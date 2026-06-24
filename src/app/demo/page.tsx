import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="demo-page">
      <section className="demo-shell">
        <p className="eyebrow">Demo surface</p>
        <h1>Sample inference will live here.</h1>
        <p>
          This route is intentionally quiet for now. When the first model is
          ready, it can connect to a server-side inference endpoint without
          exposing private keys in the browser.
        </p>
        <Link className="button secondary" href="/">
          Back to Praha Labs
        </Link>
      </section>
    </main>
  );
}
