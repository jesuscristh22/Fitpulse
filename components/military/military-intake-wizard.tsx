"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { saveMilitaryIntake, type MilitaryIntake } from "@/lib/military-intake-client";
import { MILITARY_FOCUS_OPTIONS, MILITARY_DURATION_WEEKS_OPTIONS } from "@/lib/military-options";
import { EXPERIENCE_OPTIONS, DAYS_OPTIONS } from "@/lib/onboarding-options";
import type { Dictionary } from "@/lib/i18n";

const STEPS = ["experience", "focus", "days", "weeks", "limitations"] as const;

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active ? "border-gold bg-gold text-carbon" : "border-white/15 text-white hover:border-gold/60"
      }`}
    >
      {children}
    </button>
  );
}

export function MilitaryIntakeWizard({ dict }: { dict: Dictionary }) {
  const mi = dict.militaryIntake;
  const { user } = useAuth();
  const params = useParams();
  const locale = params.locale as string;
  const [stepIndex, setStepIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<MilitaryIntake>>({ daysPerWeek: 4, durationWeeks: 4 });

  const step = STEPS[stepIndex];
  const total = STEPS.length;

  const isValid =
    step === "experience" ? !!form.experience :
    step === "focus" ? !!form.focus :
    step === "days" ? !!form.daysPerWeek :
    step === "weeks" ? !!form.durationWeeks :
    true;

  async function handleNext() {
    if (step === "limitations") {
      if (!user || !form.experience || !form.focus || !form.daysPerWeek || !form.durationWeeks) return;
      setSaving(true);
      try {
        await saveMilitaryIntake(user.uid, form as MilitaryIntake);
        setSaved(true);
      } catch (err) {
        console.error("[MilitaryIntakeWizard] save failed:", err);
      } finally {
        setSaving(false);
      }
      return;
    }
    setStepIndex((i) => Math.min(i + 1, total - 1));
  }

  function handleBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function handleCheckout() {
    if (!user) return;
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const idToken = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/checkout/military", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      console.error("[MilitaryIntakeWizard] checkout failed:", err);
      setCheckoutError(mi.checkoutError);
      setCheckingOut(false);
    }
  }

  if (saved) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h2 className="font-heading text-2xl font-bold text-gold">{mi.savedTitle}</h2>
        <p className="mt-4 text-silver">{mi.readyForCheckout}</p>
        {checkoutError && <p className="mt-4 text-sm text-red-400">{checkoutError}</p>}
        <Button variant="primary" size="lg" onClick={handleCheckout} disabled={checkingOut} className="mt-6 w-full">
          {checkingOut ? mi.redirecting : mi.goToCheckout}
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="mb-2 text-center text-xs uppercase tracking-wide text-silver">
        {stepIndex + 1} / {total}
      </p>
      <ProgressBar value={((stepIndex + 1) / total) * 100} className="mb-8" />

      <Card>
        {step === "experience" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{mi.steps.experience.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map((x) => (
                <Pill key={x} active={form.experience === x} onClick={() => setForm((f) => ({ ...f, experience: x }))}>
                  {dict.onboarding.steps.experience.options[x]}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {step === "focus" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{mi.steps.focus.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {MILITARY_FOCUS_OPTIONS.map((f) => (
                <Pill key={f} active={form.focus === f} onClick={() => setForm((prev) => ({ ...prev, focus: f }))}>
                  {mi.steps.focus.options[f]}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {step === "days" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{mi.steps.days.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {DAYS_OPTIONS.map((d) => (
                <Pill key={d} active={form.daysPerWeek === d} onClick={() => setForm((f) => ({ ...f, daysPerWeek: d }))}>
                  {d} {mi.steps.days.suffix}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {step === "weeks" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{mi.steps.weeks.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {MILITARY_DURATION_WEEKS_OPTIONS.map((w) => (
                <Pill key={w} active={form.durationWeeks === w} onClick={() => setForm((f) => ({ ...f, durationWeeks: w }))}>
                  {w} {mi.steps.weeks.suffix}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {step === "limitations" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{mi.steps.limitations.title}</h2>
            <textarea
              value={form.limitations ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, limitations: e.target.value }))}
              placeholder={mi.steps.limitations.placeholder}
              rows={4}
              className="mt-5 w-full rounded-md border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none placeholder:text-silver/60 focus:border-gold"
            />
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          {stepIndex > 0 ? (
            <button onClick={handleBack} className="text-sm text-silver hover:text-white" disabled={saving}>
              {mi.back}
            </button>
          ) : (
            <span />
          )}
          <Button variant="primary" onClick={handleNext} disabled={!isValid || saving}>
            {step === "limitations" ? mi.submit : mi.next}
          </Button>
        </div>
      </Card>
    </div>
  );
}
