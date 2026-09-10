"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PricingCard } from "@/components/ui/pricing-card";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseAuth } from "@/lib/firebase-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

// Only the Member Pro plan (index 1: Free, Member Pro, Business) has real
// Stripe checkout wired up so far. Business subscriptions are a later phase.
const MEMBER_PRO_INDEX = 1;

export function PricingPlans({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  async function handleSelect(index: number) {
    if (index !== MEMBER_PRO_INDEX) return;
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    setLoadingIndex(index);
    try {
      const idToken = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/checkout/member-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      console.error("[PricingPlans] checkout failed:", err);
      setLoadingIndex(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {dict.pages.pricing.plans.map((plan, i) => (
        <PricingCard
          key={plan.name}
          name={plan.name}
          price={plan.price}
          interval={plan.interval || undefined}
          features={plan.features}
          highlighted={i === MEMBER_PRO_INDEX}
          onSelect={() => handleSelect(i)}
          ctaLabel={loadingIndex === i ? "..." : `${dict.pages.pricing.choosePlan} ${plan.name}`}
        />
      ))}
    </div>
  );
}
