"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { getAuthErrorMessage } from "@/lib/auth-error-messages";
import { Button } from "@/components/ui/button";
import type { LocaleSlug } from "@/lib/locales-config";
import type { Dictionary } from "@/lib/i18n";

export function LoginForm({
  locale,
  dict,
  submitLabel,
}: {
  locale: LocaleSlug;
  dict: Dictionary["authForm"];
  submitLabel: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error("[LoginForm] email login failed:", err);
      const message = getAuthErrorMessage(err, dict);
      if (message) setError(message);
    } finally {
      setBusy(false);
    }
  }

  // Back to popup — signInWithRedirect has a confirmed, currently unresolved
  // Firebase SDK bug ("missing initial state") on Android Chrome with
  // storage partitioning enabled. Popup is the more broadly reliable option
  // as of this writing; revisit if Firebase ships a real fix.
  async function handleGoogleLogin() {
    setError(null);
    setBusy(true);
    try {
      await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error("[LoginForm] Google login failed:", err);
      const message = getAuthErrorMessage(err, dict);
      if (message) setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button type="button" variant="secondary" className="w-full" onClick={handleGoogleLogin} disabled={busy}>
        {dict.google}
      </Button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase text-silver">
        <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.email}
          className="h-12 rounded-md border border-white/10 bg-carbon px-4 text-sm outline-none focus:border-gold"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={dict.password}
          className="h-12 rounded-md border border-white/10 bg-carbon px-4 text-sm outline-none focus:border-gold"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>
          {submitLabel}
        </Button>
      </form>
    </>
  );
}
