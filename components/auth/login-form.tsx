"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
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
  const checkedRedirect = useRef(false);

  // Google sign-in uses a full-page redirect, not a popup — popups are
  // unreliable on mobile browsers (often silently blocked, or behave
  // inconsistently across in-app/mobile browser variants). This effect picks
  // up the result once Google sends the person back to this page.
  useEffect(() => {
    if (checkedRedirect.current) return;
    checkedRedirect.current = true;
    getRedirectResult(getFirebaseAuth())
      .then((credential) => {
        if (credential) router.push(`/${locale}/dashboard`);
      })
      .catch((err) => {
        console.error("[LoginForm] Google redirect result failed:", err);
        const message = getAuthErrorMessage(err, dict);
        if (message) setError(message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function handleGoogleLogin() {
    setError(null);
    setBusy(true);
    try {
      await signInWithRedirect(getFirebaseAuth(), new GoogleAuthProvider());
      // Page navigates away here — result is handled by the effect above
      // once the person is redirected back.
    } catch (err) {
      console.error("[LoginForm] Google login failed:", err);
      const message = getAuthErrorMessage(err, dict);
      if (message) setError(message);
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
