"use client";

import { useState } from "react";

export function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [opened, setOpened] = useState(false);

  function requestAccess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const subject = encodeURIComponent("Praha Cut early access request");
    const body = encodeURIComponent(`Email: ${email.trim()}\nRole / use case: ${role.trim() || "Not provided"}\n\nI would like to hear about Praha Cut early access.`);
    setOpened(true);
    window.location.href = `mailto:founder@prahalab.com?subject=${subject}&body=${body}`;
  }

  return <form className="access-form" onSubmit={requestAccess}>
    <div className="access-fields"><label>Email address<input type="email" name="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={event => setEmail(event.target.value)} required /></label><label>Role or use case <span>(optional)</span><input name="role" maxLength={120} placeholder="Creator, founder, content team…" value={role} onChange={event => setRole(event.target.value)} /></label></div>
    <button type="submit">Request early access <span aria-hidden="true">↗</span></button>
    <p className="access-note" role="status">{opened ? "Your email app should open with the request. Send the draft to complete it." : "This opens a prefilled email to our founder. Your request is sent only when you send that email."}</p>
  </form>;
}
