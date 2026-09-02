"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useUserData, calculateBmi, bmiCategory } from "@/lib/use-user-data";
import { saveProfile } from "@/lib/profile-client";
import { calculateAge, calculateBodyFatPercent, calculateBmr, calculateTdee, type ActivityLevel } from "@/lib/health-metrics";
import {
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  ENVIRONMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
  DAYS_OPTIONS,
  MINUTES_OPTIONS,
  EQUIPMENT_OPTIONS,
  ACTIVITY_LEVEL_OPTIONS,
} from "@/lib/onboarding-options";
import type { Dictionary } from "@/lib/i18n";
import type { FitnessGoal, TrainingEnvironment } from "@/lib/types";

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? "border-gold bg-gold text-carbon" : "border-white/15 text-white hover:border-gold/60"
      }`}
    >
      {children}
    </button>
  );
}

export function ProfileForm({ dict }: { dict: Dictionary }) {
  const p = dict.profile;
  const { user } = useAuth();
  const { account, profile, fitness, loading } = useUserData();

  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<(typeof GENDER_OPTIONS)[number] | undefined>();
  const [heightCm, setHeightCm] = useState<number | undefined>();
  const [weightKg, setWeightKg] = useState<number | undefined>();
  const [waistCm, setWaistCm] = useState<number | undefined>();
  const [neckCm, setNeckCm] = useState<number | undefined>();
  const [hipCm, setHipCm] = useState<number | undefined>();
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<FitnessGoal | undefined>();
  const [environment, setEnvironment] = useState<TrainingEnvironment[]>([]);
  const [experience, setExperience] = useState<(typeof EXPERIENCE_OPTIONS)[number] | undefined>();
  const [daysAvailable, setDaysAvailable] = useState<number | undefined>();
  const [minutesAvailable, setMinutesAvailable] = useState<number | undefined>();
  const [equipment, setEquipment] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  // Hydrate form fields once live data arrives.
  useEffect(() => {
    if (account?.displayName) setDisplayName(account.displayName);
    if (profile) {
      setBirthDate(profile.birthDate ?? "");
      setGender(profile.gender);
      setHeightCm(profile.heightCm);
      setWeightKg(profile.weightKg);
      setWaistCm(profile.waistCm);
      setNeckCm(profile.neckCm);
      setHipCm(profile.hipCm);
      if (profile.activityLevel) setActivityLevel(profile.activityLevel);
    }
    if (fitness) {
      setGoal(fitness.goals?.[0]);
      setEnvironment(fitness.environment ?? []);
      setExperience(fitness.experience);
      setDaysAvailable(fitness.daysAvailable);
      setMinutesAvailable(fitness.minutesAvailable);
      setEquipment(fitness.equipment ?? []);
    }
  }, [account, profile, fitness]);

  function toggleMulti<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setStatus("idle");
    try {
      await saveProfile(user.uid, {
        displayName,
        profile: { birthDate, gender, heightCm, weightKg, waistCm, neckCm, hipCm, activityLevel },
        fitness: {
          goals: goal ? [goal] : undefined,
          environment,
          experience,
          daysAvailable,
          minutesAvailable,
          equipment,
        },
      });
      setStatus("saved");
    } catch (err) {
      console.error("[ProfileForm] save failed:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  const age = calculateAge(birthDate);
  const bmi = calculateBmi(heightCm, weightKg);
  const category = bmi !== null ? bmiCategory(bmi) : null;
  const bodyFat = calculateBodyFatPercent({ gender, heightCm, waistCm, neckCm, hipCm });
  const bmr = calculateBmr({ gender, heightCm, weightKg, age });
  const tdee = calculateTdee(bmr, activityLevel);

  if (loading) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <h1 className="font-heading text-2xl font-bold">{p.title}</h1>
      <p className="mt-1 text-sm text-silver">{p.subtitle}</p>

      {/* ---------------- Personal ---------------- */}
      <Card className="mt-8">
        <h2 className="font-heading text-sm font-bold uppercase text-gold">{p.sections.personal}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-silver">{p.fields.name}</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-silver">{p.fields.birthDate}</label>
            <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-1" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-silver">{p.fields.gender}</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {GENDER_OPTIONS.map((g) => (
              <Pill key={g} active={gender === g} onClick={() => setGender(g)}>
                {dict.onboarding.steps.gender.options[g]}
              </Pill>
            ))}
          </div>
        </div>
      </Card>

      {/* ---------------- Body measurements ---------------- */}
      <Card className="mt-6">
        <h2 className="font-heading text-sm font-bold uppercase text-gold">{p.sections.body}</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs text-silver">{p.fields.height}</label>
            <Input type="number" value={heightCm ?? ""} onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : undefined)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-silver">{p.fields.weight}</label>
            <Input type="number" value={weightKg ?? ""} onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : undefined)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-silver">{p.fields.activityLevel}</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="mt-1 h-12 w-full rounded-md border border-white/10 bg-carbon px-3 text-sm text-white outline-none focus:border-gold"
            >
              {ACTIVITY_LEVEL_OPTIONS.map((a) => (
                <option key={a} value={a}>{p.activityLevels[a]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-silver">{p.fields.waist}</label>
            <Input type="number" value={waistCm ?? ""} onChange={(e) => setWaistCm(e.target.value ? Number(e.target.value) : undefined)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-silver">{p.fields.neck}</label>
            <Input type="number" value={neckCm ?? ""} onChange={(e) => setNeckCm(e.target.value ? Number(e.target.value) : undefined)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-silver">{p.fields.hip}</label>
            <Input type="number" value={hipCm ?? ""} onChange={(e) => setHipCm(e.target.value ? Number(e.target.value) : undefined)} className="mt-1" />
          </div>
        </div>
        <p className="mt-3 text-xs text-silver/70">{p.fields.bodyMeasurementsNote}</p>
      </Card>

      {/* ---------------- Health summary (computed, read-only) ---------------- */}
      <Card className="mt-6">
        <h2 className="font-heading text-sm font-bold uppercase text-gold">{p.sections.health}</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-silver">{p.health.bmiLabel}</p>
            <p className="mt-1 font-heading text-xl font-extrabold">
              {bmi ?? "—"} {category && <span className="text-xs font-normal text-silver">{dict.dashboardExtra.bmiCategories[category]}</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-silver">{p.health.bodyFatLabel}</p>
            <p className="mt-1 font-heading text-xl font-extrabold">
              {bodyFat !== null ? `${bodyFat}%` : "—"}
            </p>
            {bodyFat === null && <p className="mt-1 text-[11px] text-silver/70">{p.health.bodyFatMissing}</p>}
          </div>
          <div>
            <p className="text-xs text-silver">{p.health.bmrLabel}</p>
            <p className="mt-1 font-heading text-xl font-extrabold">{bmr ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-silver">{p.health.tdeeLabel}</p>
            <p className="mt-1 font-heading text-xl font-extrabold text-gold">{tdee ?? "—"}</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-silver/70">{p.health.tdeeSubtext}</p>
        <p className="mt-2 text-xs text-silver/70">{p.health.disclaimer}</p>
      </Card>

      {/* ---------------- Diet tips (general, educational) ---------------- */}
      <Card className="mt-6">
        <h2 className="font-heading text-sm font-bold uppercase text-gold">{p.sections.diet}</h2>
        <p className="mt-2 text-sm text-silver">{p.diet.intro}</p>
        <ul className="mt-3 space-y-2">
          {p.diet.tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-silver">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {tip}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-silver/70">{p.diet.disclaimer}</p>
      </Card>

      {/* ---------------- Training profile ---------------- */}
      <Card className="mt-6">
        <h2 className="font-heading text-sm font-bold uppercase text-gold">{p.sections.training}</h2>

        <div className="mt-4">
          <label className="text-xs text-silver">{dict.onboarding.steps.goal.title}</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((g) => (
              <Pill key={g} active={goal === g} onClick={() => setGoal(g)}>
                {dict.onboarding.steps.goal.options[g]}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-silver">{dict.onboarding.steps.environment.title}</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {ENVIRONMENT_OPTIONS.map((e) => (
              <Pill key={e} active={environment.includes(e)} onClick={() => setEnvironment((prev) => toggleMulti(prev, e))}>
                {dict.onboarding.steps.environment.options[e]}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-silver">{dict.onboarding.steps.experience.title}</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXPERIENCE_OPTIONS.map((x) => (
              <Pill key={x} active={experience === x} onClick={() => setExperience(x)}>
                {dict.onboarding.steps.experience.options[x]}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-silver">{dict.onboarding.steps.days.title}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DAYS_OPTIONS.map((d) => (
                <Pill key={d} active={daysAvailable === d} onClick={() => setDaysAvailable(d)}>
                  {d}
                </Pill>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-silver">{dict.onboarding.steps.time.title}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {MINUTES_OPTIONS.map((m) => (
                <Pill key={m} active={minutesAvailable === m} onClick={() => setMinutesAvailable(m)}>
                  {m}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-silver">{dict.onboarding.steps.equipment.title}</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((eq) => (
              <Pill key={eq} active={equipment.includes(eq)} onClick={() => setEquipment((prev) => toggleMulti(prev, eq))}>
                {dict.onboarding.steps.equipment.options[eq]}
              </Pill>
            ))}
          </div>
        </div>
      </Card>

      {status === "saved" && <p className="mt-4 text-sm text-emerald-400">{p.saved}</p>}
      {status === "error" && <p className="mt-4 text-sm text-red-400">{p.saveError}</p>}

      <Button variant="primary" size="lg" onClick={handleSave} disabled={saving} className="mt-6 w-full">
        {p.save}
      </Button>
    </div>
  );
}
