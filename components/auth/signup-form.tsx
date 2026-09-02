"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { Button } from "@/components/ui/button";
import type { LocaleSlug } from "@/lib/locales-config";

async function provisionAndRedirect(idToken: string, locale: LocaleSlug, router: ReturnType<typeof useRouter>) {
  // Creates the Firestore user doc + default Custom Claims server-side (see
  // /api/auth/register). New users go through onboarding (Phase 4); existing
  // users (e.g. Google sign-in on an already-provisioned account) skip straight
  // to the dashboard.
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json().catch(() => ({}));
  router.push(data?.isNewUser === false ? `/${locale}/dashboard` : `/${locale}/onboarding`);
}

export function SignupForm({
  locale,
  labels,
}: {
  locale: LocaleSlug;
  labels: { google: string; email: string; password: string; submit: string; error: string };
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
    } catch {
      setError(labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignup() {
    setError(null);
    setBusy(true);
    try {
      const credential = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      const idToken = await credential.user.getIdToken();
      await provisionAndRedirect(idToken, locale, router);
    } catch {
      setError(labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Google provides name/email/photo only — birth date, gender, height,
          weight, country are collected in onboarding (Phase 4, not built yet). */}
      <Button type="button" variant="secondary" className="w-full" onClick={handleGoogleSignup} disabled={busy}>
        {labels.google}
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
          placeholder={labels.email}
          className="h-12 rounded-md border border-white/10 bg-carbon px-4 text-sm outline-none focus:border-gold"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={labels.password}
          className="h-12 rounded-md border border-white/10 bg-carbon px-4 text-sm outline-none focus:border-gold"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>
          {labels.submit}
        </Button>
      </form>
    </>
  );
}
