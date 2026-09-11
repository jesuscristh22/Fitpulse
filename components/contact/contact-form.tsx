"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";

export function ContactForm({ dict }: { dict: Dictionary["pages"]["contact"] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("[ContactForm] submit failed:", err);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="text-sm text-emerald-400">{dict.formSent}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={dict.formName} />
      <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={dict.formEmail} />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={dict.formMessage}
        rows={5}
        className="w-full rounded-md border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none placeholder:text-silver/60 focus:border-gold"
      />
      {status === "error" && <p className="text-sm text-red-400">{dict.formError}</p>}
      <Button type="submit" variant="primary" className="gap-2 self-start" disabled={status === "sending"}>
        <Mail size={16} /> {status === "sending" ? dict.formSending : dict.formSubmit}
      </Button>
    </form>
  );
}
