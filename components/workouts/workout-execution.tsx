"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, SkipForward } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ExerciseVideoPlayer } from "@/components/ui/video-player";
import { getExerciseVideoId } from "@/lib/exercise-videos";
import { useAuth } from "@/lib/auth-context";
import { useMyWorkouts } from "@/lib/workouts-client";
import { saveWorkoutSession } from "@/lib/workout-sessions-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { CompletedSet } from "@/lib/workout-sessions";

const DEFAULT_REST_SECONDS = 60;

export function WorkoutExecution({
  locale,
  dict,
  workoutId,
}: {
  locale: LocaleSlug;
  dict: Dictionary;
  workoutId: string;
}) {
  const we = dict.workoutExecution;
  const router = useRouter();
  const { user } = useAuth();
  const { workouts, loading } = useMyWorkouts();
  const workout = workouts.find((w) => w.id === workoutId);

  const startedAtRef = useRef<string>(new Date().toISOString());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<CompletedSet[]>([]);
  const [actualReps, setActualReps] = useState<number | undefined>();
  const [actualWeight, setActualWeight] = useState<number | undefined>();
  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(0);
  const [saving, setSaving] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentSet = workout?.sets[currentIndex];
  const nextSet = workout?.sets[currentIndex + 1];

  // Pre-fill inputs with the planned target whenever we move to a new set.
  useEffect(() => {
    setActualReps(currentSet?.reps);
    setActualWeight(currentSet?.weightKg);
  }, [currentIndex, currentSet?.reps, currentSet?.weightKg]);

  // Rest countdown.
  useEffect(() => {
    if (!resting) return;
    if (restLeft <= 0) {
      setResting(false);
      return;
    }
    const timer = setTimeout(() => setRestLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resting, restLeft]);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `finished` intentionally
  // triggers a recompute of "now" the moment the session ends; it isn't read
  // inside the callback itself.
  const elapsedSeconds = useMemo(() => {
    return Math.round((Date.now() - new Date(startedAtRef.current).getTime()) / 1000);
  }, [finished]);

  function completeCurrentSet() {
    if (!currentSet) return;
    setCompleted((prev) => [
      ...prev,
      {
        exerciseId: currentSet.exerciseId,
        exerciseName: currentSet.exerciseName ?? currentSet.exerciseId,
        setNumber: currentSet.setNumber,
        reps: actualReps,
        weightKg: actualWeight,
        durationSeconds: currentSet.durationSeconds,
      },
    ]);

    const isLast = !nextSet;
    if (isLast) {
      setFinished(true);
      return;
    }

    const restSeconds = currentSet.restSeconds ?? DEFAULT_REST_SECONDS;
    if (restSeconds > 0) {
      setRestLeft(restSeconds);
      setResting(true);
    }
    setCurrentIndex((i) => i + 1);
  }

  async function handleSaveAndFinish() {
    if (!user || !workout) return;
    setSaving(true);
    try {
      await saveWorkoutSession(user.uid, {
        workoutId: workout.id!,
        workoutName: workout.name,
        startedAt: startedAtRef.current,
        completedAt: new Date().toISOString(),
        completedSets: completed,
      });
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error("[WorkoutExecution] save session failed:", err);
      setSaving(false);
    }
  }

  if (loading) return null;

  if (!workout) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-28 text-center text-silver">
        <p>{we.notFound}</p>
        <Link href={`/${locale}/treinos`} className="mt-4 inline-block text-gold hover:underline">
          {we.backToWorkouts}
        </Link>
      </div>
    );
  }

  const total = workout.sets.length;

  // ---------- Summary screen ----------
  if (finished) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-28 text-center">
        <CheckCircle2 size={48} className="mx-auto text-gold" />
        <h1 className="mt-4 font-heading text-3xl font-extrabold">{we.summaryTitle}</h1>
        <div className="mt-8 flex justify-center gap-10">
          <div>
            <p className="font-heading text-3xl font-extrabold text-gold">{completed.length}</p>
            <p className="text-xs text-silver">{we.setsCompletedLabel}</p>
          </div>
          <div>
            <p className="font-heading text-3xl font-extrabold text-gold">
              {elapsedSeconds < 60 ? `${elapsedSeconds}s` : `${Math.floor(elapsedSeconds / 60)}m`}
            </p>
            <p className="text-xs text-silver">{we.elapsedTimeLabel}</p>
          </div>
        </div>
        <Button variant="primary" size="lg" onClick={handleSaveAndFinish} disabled={saving} className="mt-10 w-full">
          {we.saveAndFinish}
        </Button>
      </div>
    );
  }

  // ---------- Rest screen ----------
  if (resting) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-28 text-center">
        <p className="text-xs uppercase tracking-wide text-silver">{we.restTitle}</p>
        <p className="mt-4 font-heading text-7xl font-extrabold text-gold">{restLeft}s</p>
        {nextSet && (
          <>
            <p className="mt-6 text-silver">
              {we.nextUp}: <span className="font-semibold text-white">{nextSet.exerciseName}</span>
            </p>
            {nextSet.exerciseSlug && getExerciseVideoId(nextSet.exerciseSlug, locale) && (
              <div className="mx-auto mt-4 max-w-sm">
                <ExerciseVideoPlayer slug={nextSet.exerciseSlug} title={nextSet.exerciseName ?? ""} locale={locale} />
              </div>
            )}
          </>
        )}
        <button
          onClick={() => setResting(false)}
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-gold"
        >
          <SkipForward size={16} /> {we.restSkip}
        </button>
      </div>
    );
  }

  // ---------- Active set screen ----------
  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-28">
      <p className="text-center text-xs uppercase tracking-wide text-silver">
        {we.setOf.replace("{current}", String(currentIndex + 1)).replace("{total}", String(total))}
      </p>
      <ProgressBar value={((currentIndex + 1) / total) * 100} className="mt-3" />

      <Card className="mt-8">
        <h1 className="font-heading text-2xl font-bold">{currentSet?.exerciseName}</h1>
        <p className="mt-1 text-sm text-silver">
          {we.target}: {currentSet?.reps ? `${currentSet.reps} ${we.actualReps}` : ""}
          {currentSet?.weightKg ? ` · ${currentSet.weightKg} kg` : ""}
          {currentSet?.durationSeconds ? ` · ${currentSet.durationSeconds}s` : ""}
        </p>

        {currentSet?.exerciseSlug && getExerciseVideoId(currentSet.exerciseSlug, locale) && (
          <div className="mt-4">
            <ExerciseVideoPlayer slug={currentSet.exerciseSlug} title={currentSet.exerciseName ?? ""} locale={locale} />
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-silver">{we.actualReps}</label>
            <Input
              type="number"
              value={actualReps ?? ""}
              onChange={(e) => setActualReps(e.target.value ? Number(e.target.value) : undefined)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-silver">{we.actualWeight}</label>
            <Input
              type="number"
              value={actualWeight ?? ""}
              onChange={(e) => setActualWeight(e.target.value ? Number(e.target.value) : undefined)}
              className="mt-1"
            />
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={completeCurrentSet} className="mt-8 w-full gap-2">
          <CheckCircle2 size={18} /> {we.completeSet}
        </Button>
      </Card>

      <button
        onClick={() => setFinished(true)}
        className="mx-auto mt-6 block text-sm text-silver hover:text-white"
      >
        {we.finishNow}
      </button>
    </div>
  );
}
