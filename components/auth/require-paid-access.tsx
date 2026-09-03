"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";
import { Lock } from "lucide-react";
import { getFirebaseDb } from "@/lib/firebase-client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

// Full exercise library access is a paid perk — this only checks the
// Military AI Workout subscription for now (the only real paid product
// wired up so far). Once Member Pro (Phase 13) exists, this should also
// accept an active Member Pro status.
export function RequirePaidAccess({
  locale,
  dict,
  children,
}: {
  locale: LocaleSlug;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const base = `/${locale}`;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`${base}/login`);
      return;
    }
    const db = getFirebaseDb();
    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        setStatus((snap.data()?.militaryAiSubscriptionStatus as string) ?? null);
        setChecked(true);
      },
      (err) => {
        console.error("[RequirePaidAccess] listener failed:", err);
        setChecked(true);
      },
    );
    return unsubscribe;
  }, [user, authLoading, router, base]);

  if (authLoading || !checked) {
    return <div className="flex min-h-screen items-center justify-center bg-carbon text-sm text-silver">Loading…</div>;
  }

  const hasPaidAccess = status === "active" || status === "trialing";

  if (!hasPaidAccess) {
    return (
      <div className="mx-auto max-w-lg px-6 pt-28 text-center">
        <Card>
          <Lock size={32} className="mx-auto text-gold" />
          <h1 className="mt-4 font-heading text-xl font-bold">{dict.library.paywallTitle}</h1>
          <p className="mt-3 text-sm text-silver">{dict.library.paywallSubtitle}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href={`${base}/exercicios/gerador`}>
              <Button variant="secondary" size="md" className="w-full">
                {dict.library.tryFreeGenerator}
              </Button>
            </Link>
            <Link href={`${base}/militar`}>
              <Button variant="primary" size="md" className="w-full">
                {dict.library.subscribeCta}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
