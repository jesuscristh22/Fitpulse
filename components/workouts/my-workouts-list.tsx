"use client";

import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useMyWorkouts, deleteWorkout } from "@/lib/workouts-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

export function MyWorkoutsList({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const mw = dict.myWorkouts;
  const { workouts, loading, error } = useMyWorkouts();
  const base = `/${locale}`;

  async function handleDelete(id: string) {
    if (!confirm(mw.confirmDelete)) return;
    await deleteWorkout(id);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{mw.title}</h1>
        <Link href={`${base}/treinos/novo`}>
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus size={14} /> {mw.newWorkout}
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        {error ? (
          <p className="text-sm text-red-400">Error: {error}</p>
        ) : loading ? null : workouts.length === 0 ? (
          <EmptyState
            title={mw.empty}
            action={
              <Link href={`${base}/treinos/novo`}>
                <Button variant="primary" size="sm">{mw.createFirst}</Button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {workouts.map((workout) => {
              const exerciseCount = new Set(workout.sets.map((s) => s.exerciseId)).size;
              return (
                <Card key={workout.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-heading text-base font-bold">{workout.name}</p>
                    <p className="mt-1 text-sm text-silver">{mw.exercisesCount.replace("{count}", String(exerciseCount))}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href={`${base}/treinos/${workout.id}`} className="text-sm font-semibold text-gold hover:underline">
                      {mw.viewDetails}
                    </Link>
                    <button onClick={() => workout.id && handleDelete(workout.id)} className="text-silver hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
