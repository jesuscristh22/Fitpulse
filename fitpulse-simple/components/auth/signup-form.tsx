"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { getAuthErrorMessage } from "@/lib/auth-error-messages";
import { Button } from "@/components/ui/button";
import type { LocaleSlug } from "@/lib/locales-config";
import type { Dictionary } from "@/lib/i18n";

async function provisionAndRedirect(idToken: string, locale: LocaleSlug, router: ReturnType<typeof useRouter>) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    // The Firebase Auth account was created even though this failed — worth
    // knowing, since retrying signup with the same email will now correctly
    // fail with "already in use" rather than the person being stuck.
    throw new Error("provisioning_failed");
  }
  const data = await res.json().catch(() => ({}));
  router.push(data?.isNewUser === false ? `/${locale}/dashboard` : `/${locale}/onboarding`);
}

export function SignupForm({
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

  async function handleEmailSignup(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      const idToken = await credential.user.getIdToken();
      await provisionAndRedirect(idToken, locale, router);
    } catch (err) {
      console.error("[SignupForm] email signup failed:", err);
      const message =
        err instanceof Error && err.message === "provisioning_failed" ? dict.provisioningFailed : getAuthErrorMessage(err, dict);
      if (message) setError(message);
    } finally {
      setBusy(false);
    }
  }

  // Back to popup — signInWithRedirect has a confirmed, currently unresolved
  // Firebase SDK bug ("missing initial state") on Android Chrome with
  // storage partitioning enabled. Popup is the more broadly reliable option
  // as of this writing; revisit if Firebase ships a real fix.
  async function handleGoogleSignup() {
    setError(null);
    setBusy(true);
    try {
      const credential = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      const idToken = await credential.user.getIdToken();
      await provisionAndRedirect(idToken, locale, router);
    } catch (err) {
      console.error("[SignupForm] Google signup failed:", err);
      const message =
        err instanceof Error && err.message === "provisioning_failed" ? dict.provisioningFailed : getAuthErrorMessage(err, dict);
      if (message) setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Google provides name/email/photo only — birth date, gender, height,
          weight, country are collected in onboarding (Phase 4). */}
      <Button type="button" variant="secondary" className="w-full" onClick={handleGoogleSignup} disabled={busy}>
        {dict.google}
      </Button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase text-silver">
        <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
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
          minLength={6}
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
