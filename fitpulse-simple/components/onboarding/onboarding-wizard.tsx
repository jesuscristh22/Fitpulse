"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { LOCALE_SLUGS, type LocaleSlug } from "@/lib/locales-config";
import type { Dictionary } from "@/lib/i18n";
import {
  GENDER_OPTIONS,
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  GOAL_OPTIONS,
  ENVIRONMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
  DAYS_OPTIONS,
  MINUTES_OPTIONS,
  EQUIPMENT_OPTIONS,
} from "@/lib/onboarding-options";
import type {
  SupportedCountry,
  SupportedLocale,
  FitnessGoal,
  TrainingEnvironment,
  ExperienceLevel,
} from "@/lib/types";

const STEP_KEYS = [
  "name",
  "birthDate",
  "gender",
  "country",
  "language",
  "height",
  "weight",
  "goal",
  "environment",
  "experience",
  "days",
  "time",
  "equipment",
  "review",
] as const;

interface FormState {
  displayName: string;
  birthDate: string;
  gender?: (typeof GENDER_OPTIONS)[number];
  country?: SupportedCountry;
  locale?: SupportedLocale;
  heightCm: number;
  weightKg: number;
  goals: FitnessGoal[];
  environment: TrainingEnvironment[];
  experience?: ExperienceLevel;
  daysAvailable?: number;
  minutesAvailable?: number;
  equipment: string[];
}

function calcAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "border-gold bg-gold text-carbon"
          : "border-white/15 text-white hover:border-gold/60"
      }`}
    >
      {children}
    </button>
  );
}

export function OnboardingWizard({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const router = useRouter();
  const { user } = useAuth();
  const o = dict.onboarding;
  const [stepIndex, setStepIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(() => ({
    displayName: user?.displayName ?? "",
    birthDate: "",
    heightCm: 170,
    weightKg: 70,
    goals: [],
    environment: [],
    equipment: [],
    country: locale === "pt-br" ? "BR" : locale === "es" ? "ES" : "US",
    locale: LOCALE_SLUGS[locale],
  }));

  const step = STEP_KEYS[stepIndex];
  const total = STEP_KEYS.length;

  const isValid = useMemo(() => {
    switch (step) {
      case "name":
        return form.displayName.trim().length > 0;
      case "birthDate":
        return form.birthDate.length > 0 && calcAge(form.birthDate) !== null;
      case "country":
        return !!form.country;
      case "language":
        return !!form.locale;
      case "height":
        return form.heightCm >= 80 && form.heightCm <= 260;
      case "weight":
        return form.weightKg >= 25 && form.weightKg <= 400;
      case "goal":
        return form.goals.length >= 1;
      case "environment":
        return form.environment.length >= 1;
      case "experience":
        return !!form.experience;
      case "days":
        return !!form.daysAvailable;
      case "time":
        return !!form.minutesAvailable;
      default:
        return true; // gender, equipment, review
    }
  }, [step, form]);

  function toggleMulti<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  async function handleFinish() {
    setError(null);
    setBusy(true);
    try {
      const currentUser = getFirebaseAuth().currentUser ?? user;
      if (!currentUser) throw new Error("Not signed in");
      const idToken = await currentUser.getIdToken();
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, ...form }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push(`/${locale}/dashboard`);
    } catch {
      setError(dict.authForm.error);
    } finally {
      setBusy(false);
    }
  }

  function goNext() {
    if (step === "review") {
      handleFinish();
    } else {
      setStepIndex((i) => Math.min(i + 1, total - 1));
    }
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  const age = calcAge(form.birthDate);

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-16">
      <p className="mb-2 text-center text-xs uppercase tracking-wide text-silver">
        {o.stepOf.replace("{current}", String(stepIndex + 1)).replace("{total}", String(total))}
      </p>
      <ProgressBar value={((stepIndex + 1) / total) * 100} className="mb-8" />

      <Card>
        {/* -------- name -------- */}
        {step === "name" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.name.title}</h2>
            <Input
              autoFocus
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              placeholder={o.steps.name.placeholder}
              className="mt-5"
            />
          </div>
        )}

        {/* -------- birthDate -------- */}
        {step === "birthDate" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.birthDate.title}</h2>
            <Input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
              className="mt-5"
            />
            {age !== null && (
              <p className="mt-3 text-sm text-silver">
                {age} {o.steps.birthDate.ageLabel}
              </p>
            )}
          </div>
        )}

        {/* -------- gender -------- */}
        {step === "gender" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.gender.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((g) => (
                <Pill key={g} active={form.gender === g} onClick={() => setForm((f) => ({ ...f, gender: g }))}>
                  {o.steps.gender.options[g]}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* -------- country -------- */}
        {step === "country" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.country.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {COUNTRY_OPTIONS.map((c) => (
                <Pill key={c} active={form.country === c} onClick={() => setForm((f) => ({ ...f, country: c }))}>
                  {o.steps.country.options[c]}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* -------- language -------- */}
        {step === "language" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.language.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((l) => (
                <Pill key={l} active={form.locale === l} onClick={() => setForm((f) => ({ ...f, locale: l }))}>
                  {o.steps.language.options[l]}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* -------- height -------- */}
        {step === "height" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.height.title}</h2>
            <div className="mt-5 flex items-center gap-3">
              <Input
                type="number"
                value={form.heightCm}
                onChange={(e) => setForm((f) => ({ ...f, heightCm: Number(e.target.value) }))}
                className="w-32"
              />
              <span className="text-silver">{o.steps.height.unit}</span>
            </div>
          </div>
        )}

        {/* -------- weight -------- */}
        {step === "weight" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.weight.title}</h2>
            <div className="mt-5 flex items-center gap-3">
              <Input
                type="number"
                value={form.weightKg}
                onChange={(e) => setForm((f) => ({ ...f, weightKg: Number(e.target.value) }))}
                className="w-32"
              />
              <span className="text-silver">{o.steps.weight.unit}</span>
            </div>
          </div>
        )}

        {/* -------- goal (single select) -------- */}
        {step === "goal" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.goal.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((g) => (
                <Pill key={g} active={form.goals.includes(g)} onClick={() => setForm((f) => ({ ...f, goals: toggleMulti(f.goals, g) }))}>
                  {o.steps.goal.options[g]}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* -------- environment (multi select) -------- */}
        {step === "environment" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.environment.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {ENVIRONMENT_OPTIONS.map((e) => (
                <Pill
                  key={e}
                  active={form.environment.includes(e)}
                  onClick={() => setForm((f) => ({ ...f, environment: toggleMulti(f.environment, e) }))}
                >
                  {o.steps.environment.options[e]}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* -------- experience -------- */}
        {step === "experience" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.experience.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map((x) => (
                <Pill key={x} active={form.experience === x} onClick={() => setForm((f) => ({ ...f, experience: x }))}>
                  {o.steps.experience.options[x]}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* -------- days -------- */}
        {step === "days" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.days.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {DAYS_OPTIONS.map((d) => (
                <Pill key={d} active={form.daysAvailable === d} onClick={() => setForm((f) => ({ ...f, daysAvailable: d }))}>
                  {d} {o.steps.days.suffix}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* -------- time -------- */}
        {step === "time" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.time.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {MINUTES_OPTIONS.map((m) => (
                <Pill
                  key={m}
                  active={form.minutesAvailable === m}
                  onClick={() => setForm((f) => ({ ...f, minutesAvailable: m }))}
                >
                  {m} {o.steps.time.suffix}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* -------- equipment (multi select) -------- */}
        {step === "equipment" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.equipment.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map((eq) => (
                <Pill
                  key={eq}
                  active={form.equipment.includes(eq)}
                  onClick={() => setForm((f) => ({ ...f, equipment: toggleMulti(f.equipment, eq) }))}
                >
                  {o.steps.equipment.options[eq]}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* -------- review -------- */}
        {step === "review" && (
          <div>
            <h2 className="font-heading text-xl font-bold">{o.steps.review.title}</h2>
            <p className="mt-2 text-sm text-silver">{o.steps.review.subtext}</p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-silver">{o.steps.name.title}</dt>
                <dd className="font-semibold">{form.displayName}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-silver">{o.steps.birthDate.ageLabel}</dt>
                <dd className="font-semibold">{age ?? "—"}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-silver">{o.steps.goal.title}</dt>
                <dd className="font-semibold">{form.goals.map((g) => o.steps.goal.options[g]).join(", ") || "—"}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-silver">{o.steps.experience.title}</dt>
                <dd className="font-semibold">{form.experience ? o.steps.experience.options[form.experience] : "—"}</dd>
              </div>
            </dl>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          {stepIndex > 0 ? (
            <button onClick={goBack} className="text-sm text-silver hover:text-white" disabled={busy}>
              {o.back}
            </button>
          ) : (
            <span />
          )}
          <Button variant="primary" onClick={goNext} disabled={!isValid || busy}>
            {step === "review" ? o.finish : o.next}
          </Button>
        </div>
      </Card>
    </div>
  );
}
