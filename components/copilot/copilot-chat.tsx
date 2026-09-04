"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, Sparkles, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useUserData } from "@/lib/use-user-data";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { saveWorkout } from "@/lib/workouts-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { WorkoutSet } from "@/lib/workouts";

interface AdaptedWorkout {
  message: string;
  workoutName: string;
  sets: WorkoutSet[];
}

export function CopilotChat({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const c = dict.copilot;
  const { user } = useAuth();
  const { account } = useUserData();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdaptedWorkout | null>(null);
  const [saving, setSaving] = useState(false);

  const isActive = (s?: string) => s === "active" || s === "trialing";
  const hasPaidAccess =
    isActive(account?.militaryAiSubscriptionStatus) || isActive(account?.memberProSubscriptionStatus);

  async function handleSend() {
    if (!user || !message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const idToken = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/copilot/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, locale, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult(data);
    } catch (err) {
      console.error("[CopilotChat] adapt failed:", err);
      setError(c.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAndExecute() {
    if (!user || !result) return;
    setSaving(true);
    try {
      const workoutId = await saveWorkout(user.uid, {
        name: result.workoutName,
        createdBy: "ai",
        sets: result.sets,
      });
      router.push(`/${locale}/treinos/${workoutId}/executar`);
    } catch (err) {
      console.error("[CopilotChat] save failed:", err);
      setSaving(false);
    }
  }

  if (!hasPaidAccess) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <ShieldAlert size={32} className="mx-auto text-gold" />
        <p className="mt-4 text-silver">{c.noSubscription}</p>
        <Link href={`/${locale}/planos`}>
          <Button variant="primary" size="lg" className="mt-6 w-full">
            {c.subscribeCta}
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <div className="flex gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={c.placeholder}
            rows={3}
            className="w-full rounded-md border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none placeholder:text-silver/60 focus:border-gold"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <Button variant="primary" size="md" onClick={handleSend} disabled={loading || !message.trim()} className="mt-4 gap-2">
          <Send size={14} /> {loading ? c.adapting : c.send}
        </Button>
      </Card>

      {result && (
        <Card className="mt-6">
          <p className="flex items-start gap-2 text-sm text-silver">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-gold" /> {result.message}
          </p>

          <h3 className="mt-5 font-heading text-lg font-bold">{result.workoutName}</h3>
          <ul className="mt-3 space-y-1">
            {result.sets.map((s, i) => (
              <li key={i} className="text-sm text-silver">
                <span className="font-semibold text-white">{s.exerciseName}</span>
                {s.reps ? ` — ${s.reps} reps` : s.durationSeconds ? ` — ${s.durationSeconds}s` : ""}
                {s.weightKg ? ` · ${s.weightKg}kg` : ""}
                {s.restSeconds !== undefined ? ` · ${s.restSeconds}s rest` : ""}
              </li>
            ))}
          </ul>

          <Button variant="primary" size="md" onClick={handleSaveAndExecute} disabled={saving} className="mt-5 w-full">
            {c.saveAndExecute}
          </Button>
        </Card>
      )}
    </div>
  );
}
