"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMyWorkouts, updateWorkoutSchedule } from "@/lib/workouts-client";
import { useWeeklySessionsByDay } from "@/lib/workout-sessions-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export function TrainingCalendar({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const c = dict.calendar;
  const { workouts, loading } = useMyWorkouts();
  const { byDay } = useWeeklySessionsByDay();
  const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null);

  async function assign(day: string, workoutId: string) {
    // Remove this day from any other workout it might already be on, then add it here.
    await Promise.all(
      workouts
        .filter((w) => w.id && w.scheduledDays?.includes(day) && w.id !== workoutId)
        .map((w) => updateWorkoutSchedule(w.id!, (w.scheduledDays ?? []).filter((d) => d !== day))),
    );
    const target = workouts.find((w) => w.id === workoutId);
    const nextDays = Array.from(new Set([...(target?.scheduledDays ?? []), day]));
    await updateWorkoutSchedule(workoutId, nextDays);
    setPickerOpenFor(null);
  }

  async function unassign(day: string, workoutId: string) {
    const target = workouts.find((w) => w.id === workoutId);
    if (!target) return;
    await updateWorkoutSchedule(workoutId, (target.scheduledDays ?? []).filter((d) => d !== day));
  }

  if (loading) return null;

  if (workouts.length === 0) {
    return (
      <div className="text-center text-silver">
        <p>{c.noWorkouts}</p>
        <Link href={`/${locale}/treinos/novo`} className="mt-3 inline-block text-gold hover:underline">
          {c.createWorkout}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
      {WEEKDAYS.map((day) => {
        const assignedWorkout = workouts.find((w) => w.scheduledDays?.includes(day));
        const sessionsToday = byDay[day] ?? [];

        return (
          <Card key={day} className="flex min-h-[160px] flex-col">
            <p className="text-xs font-bold uppercase tracking-wide text-gold">{c.days[day]}</p>

            {assignedWorkout ? (
              <div className="mt-3 flex-1">
                <p className="font-heading text-sm font-bold">{assignedWorkout.name}</p>
                <p className="mt-1 text-xs text-silver">
                  {dict.myWorkouts.exercisesCount.replace(
                    "{count}",
                    String(new Set(assignedWorkout.sets.map((s) => s.exerciseId)).size),
                  )}
                </p>
                <button
                  onClick={() => assignedWorkout.id && unassign(day, assignedWorkout.id)}
                  className="mt-2 text-xs text-silver hover:text-red-400"
                >
                  {c.unassign}
                </button>
              </div>
            ) : (
              <div className="mt-3 flex-1">
                <p className="text-xs text-silver/60">{c.restDay}</p>
              </div>
            )}

            {sessionsToday.length > 0 && (
              <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 size={12} /> {c.completed}
              </p>
            )}

            {!assignedWorkout && (
              <div className="relative mt-3">
                <button
                  onClick={() => setPickerOpenFor(pickerOpenFor === day ? null : day)}
                  className="text-xs font-semibold text-gold hover:underline"
                >
                  {c.assign}
                </button>
                {pickerOpenFor === day && (
                  <ul className="absolute bottom-full left-0 z-10 mb-2 w-48 overflow-hidden rounded-md border border-white/10 bg-graphite shadow-xl">
                    {workouts.map((w) => (
                      <li key={w.id}>
                        <button
                          onClick={() => w.id && assign(day, w.id)}
                          className="block w-full px-3 py-2 text-left text-xs text-white hover:bg-white/5"
                        >
                          {w.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
