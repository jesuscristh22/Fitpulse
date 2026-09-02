"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMyWorkouts } from "@/lib/workouts-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

export function WorkoutDetail({
  locale,
  dict,
  workoutId,
}: {
  locale: LocaleSlug;
  dict: Dictionary;
  workoutId: string;
}) {
  const mw = dict.myWorkouts;
  const wb = dict.workoutBuilder;
  const { workouts, loading } = useMyWorkouts();
  const workout = workouts.find((w) => w.id === workoutId);

  const base = `/${locale}`;

  if (loading) return null;

  if (!workout) {
    return (
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-28 text-center text-silver">
        <p>{mw.empty}</p>
        <Link href={`${base}/treinos`} className="mt-4 inline-block text-gold hover:underline">
          {mw.back}
        </Link>
      </div>
    );
  }

  // Group flat sets back by exercise for display.
  const groups = new Map<string, { exerciseName: string; sets: typeof workout.sets }>();
  for (const set of workout.sets) {
    const key = set.exerciseId;
    if (!groups.has(key)) groups.set(key, { exerciseName: set.exerciseName ?? key, sets: [] });
    groups.get(key)!.sets.push(set);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-28">
      <Link href={`${base}/treinos`} className="inline-flex items-center gap-2 text-sm text-silver hover:text-white">
        <ArrowLeft size={14} /> {mw.back}
      </Link>

      <h1 className="mt-6 font-heading text-3xl font-extrabold">{workout.name}</h1>

      <div className="mt-8 flex flex-col gap-5">
        {Array.from(groups.entries()).map(([exerciseId, group]) => (
          <Card key={exerciseId}>
            <h2 className="font-heading text-base font-bold">{group.exerciseName}</h2>
            <div className="mt-3 flex flex-col gap-2">
              {group.sets.map((set, i) => (
                <div key={i} className="flex flex-wrap gap-x-4 gap-y-1 border-t border-white/5 pt-2 text-sm text-silver">
                  <span className="font-semibold text-white">{wb.set} {set.setNumber ?? i + 1}</span>
                  {set.reps !== undefined && <span>{set.reps} {wb.reps}</span>}
                  {set.weightKg !== undefined && <span>{set.weightKg} {wb.weightKg}</span>}
                  {set.durationSeconds !== undefined && <span>{set.durationSeconds}s</span>}
                  {set.restSeconds !== undefined && <span>{wb.restSec}: {set.restSeconds}s</span>}
                  {set.notes && <span className="italic">{set.notes}</span>}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
