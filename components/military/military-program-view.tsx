"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { useMilitaryProgram } from "@/lib/military-program-client";
import { buildExerciseVideoSearchUrl } from "@/lib/youtube-search-link";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

export function MilitaryProgramView({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const mp = dict.militaryProgram;
  const { user } = useAuth();
  const { program, subscriptionStatus, loading } = useMilitaryProgram();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsQuestionnaire, setNeedsQuestionnaire] = useState(false);
  const base = `/${locale}`;

  const hasActiveSubscription = subscriptionStatus === "active" || subscriptionStatus === "trialing";

  async function handleGenerate() {
    if (!user) return;
    setGenerating(true);
    setError(null);
    setNeedsQuestionnaire(false);
    try {
      const idToken = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/military/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
    } catch (err) {
      console.error("[MilitaryProgramView] generate failed:", err);
      const code = err instanceof Error ? err.message : "";
      if (code === "rate_limited") {
        setError(mp.rateLimited);
      } else if (code === "free_limit_reached") {
        setError(mp.freeLimitReached);
      } else if (code === "no_questionnaire") {
        setNeedsQuestionnaire(true);
      } else {
        setError(mp.error);
      }
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return null;

  const freeTierBanner = !hasActiveSubscription && (
    <Card className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-silver">{mp.freeTierNote}</p>
      <Link href={`${base}/militar`}>
        <Button variant="secondary" size="sm">
          {mp.subscribeCta}
        </Button>
      </Link>
    </Card>
  );

  if (!program) {
    if (needsQuestionnaire) {
      return (
        <>
          {freeTierBanner}
          <Card className="mx-auto max-w-lg text-center">
            <p className="text-silver">{mp.needsQuestionnaire}</p>
            <Link href={`${base}/militar/questionario`}>
              <Button variant="primary" size="lg" className="mt-6 w-full">
                {mp.goToQuestionnaire}
              </Button>
            </Link>
          </Card>
        </>
      );
    }
    return (
      <>
        {freeTierBanner}
        <Card className="mx-auto max-w-lg text-center">
          <p className="text-silver">{mp.subtitle}</p>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          <Button variant="primary" size="lg" onClick={handleGenerate} disabled={generating} className="mt-6 w-full gap-2">
            <Zap size={16} className="fill-carbon" /> {generating ? mp.generating : mp.generateButton}
          </Button>
        </Card>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {freeTierBanner}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold">{program.programName}</h2>
          <p className="mt-1 text-sm text-silver">
            {program.durationWeeks} {mp.weekLabel} · {program.daysPerWeek}x/{mp.weekLabel.slice(0, -1)} · {program.estimatedDuration} min
          </p>
        </div>
        <Badge variant="gold">{dict.library.difficulty[program.difficulty]}</Badge>
      </div>

      <p className="mt-4 text-silver">{program.goal}</p>
      <p className="mt-2 text-xs text-silver/60">{mp.videoSearchNote}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {program.sessions.map((session) => (
          <Card key={session.day}>
            <h3 className="font-heading text-sm font-bold text-gold">{session.splitLabel}</h3>
            <ul className="mt-3 space-y-2">
              {session.exercises.map((ex, i) => (
                <li key={i} className="text-sm text-silver">
                  {ex.slug ? (
                    <Link
                      href={`${base}/exercicios/${ex.slug}`}
                      className="font-semibold text-white hover:text-gold hover:underline"
                    >
                      {ex.name}
                    </Link>
                  ) : (
                    <a
                      href={buildExerciseVideoSearchUrl(ex.name, locale, "military")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-gold hover:underline"
                    >
                      {ex.name}
                    </a>
                  )}{" "}
                  — {ex.sets}x{ex.reps} · {mp.restLabel} {ex.restSeconds}s
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <Button variant="secondary" size="md" onClick={handleGenerate} disabled={generating} className="mt-6">
        {generating ? mp.generating : mp.regenerateButton}
      </Button>
      <p className="mt-3 text-xs text-silver/60">{hasActiveSubscription ? mp.regenerateNote : mp.freeTierNote}</p>
      <p className="mt-6 text-xs text-silver/70">{mp.disclaimer}</p>
    </div>
  );
}
