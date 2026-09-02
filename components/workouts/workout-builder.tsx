"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { saveWorkout } from "@/lib/workouts-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { Exercise, WorkoutSet } from "@/lib/workouts";

interface SetRow {
  reps?: number;
  weightKg?: number;
  durationSeconds?: number;
  restSeconds?: number;
  notes?: string;
}

interface EntryRow {
  exerciseId: string;
  exerciseName: string;
  sets: SetRow[];
}

export function WorkoutBuilder({
  locale,
  dict,
  exercises,
}: {
  locale: LocaleSlug;
  dict: Dictionary;
  exercises: Exercise[];
}) {
  const wb = dict.workoutBuilder;
  const router = useRouter();
  const { user } = useAuth();

  const [workoutName, setWorkoutName] = useState("");
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const searchResults =
    search.trim().length > 0
      ? exercises.filter((e) => e.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
      : [];

  function addExercise(exercise: Exercise) {
    setEntries((prev) => [
      ...prev,
      { exerciseId: exercise.id, exerciseName: exercise.name, sets: [{ reps: 10 }] },
    ]);
    setSearch("");
  }

  function removeExercise(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function addSet(entryIndex: number) {
    setEntries((prev) =>
      prev.map((entry, i) => (i === entryIndex ? { ...entry, sets: [...entry.sets, {}] } : entry)),
    );
  }

  function removeSet(entryIndex: number, setIndex: number) {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === entryIndex ? { ...entry, sets: entry.sets.filter((_, si) => si !== setIndex) } : entry,
      ),
    );
  }

  function updateSet(entryIndex: number, setIndex: number, patch: Partial<SetRow>) {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === entryIndex
          ? { ...entry, sets: entry.sets.map((s, si) => (si === setIndex ? { ...s, ...patch } : s)) }
          : entry,
      ),
    );
  }

  async function handleSave() {
    setError(null);
    if (!workoutName.trim()) return setError(wb.nameRequired);
    if (entries.length === 0) return setError(wb.atLeastOneExercise);
    if (!user) return;

    setSaving(true);
    try {
      const sets: WorkoutSet[] = entries.flatMap((entry) =>
        entry.sets.map((s, i) => ({
          exerciseId: entry.exerciseId,
          exerciseName: entry.exerciseName,
          setNumber: i + 1,
          ...s,
        })),
      );
      await saveWorkout(user.uid, { name: workoutName.trim(), createdBy: "member", sets });
      router.push(`/${locale}/treinos`);
    } catch (err) {
      console.error("[WorkoutBuilder] save failed:", err);
      setError(`${wb.saveError} (${err instanceof Error ? err.message : "unknown error"})`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-28">
      <h1 className="font-heading text-2xl font-bold">{wb.title}</h1>

      <Input
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        placeholder={wb.namePlaceholder}
        className="mt-6"
      />

      {/* Exercise search */}
      <div className="relative mt-6">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={wb.searchPlaceholder} />
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-white/10 bg-graphite shadow-xl">
            {searchResults.map((ex) => (
              <button
                key={ex.id}
                onClick={() => addExercise(ex)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-white/5"
              >
                <span>{ex.name}</span>
                <Plus size={14} className="text-gold" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Added exercises */}
      <div className="mt-8 flex flex-col gap-5">
        {entries.length === 0 && <p className="text-sm text-silver">{wb.noExercisesAdded}</p>}

        {entries.map((entry, entryIndex) => (
          <Card key={`${entry.exerciseId}-${entryIndex}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold">{entry.exerciseName}</h3>
              <button onClick={() => removeExercise(entryIndex)} className="text-silver hover:text-red-400">
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {entry.sets.map((set, setIndex) => (
                <div key={setIndex} className="grid grid-cols-2 gap-2 border-t border-white/5 pt-3 sm:grid-cols-6">
                  <span className="col-span-2 self-center text-xs text-silver sm:col-span-1">
                    {wb.set} {setIndex + 1}
                  </span>
                  <Input
                    type="number"
                    placeholder={wb.reps}
                    value={set.reps ?? ""}
                    onChange={(e) => updateSet(entryIndex, setIndex, { reps: e.target.value ? Number(e.target.value) : undefined })}
                  />
                  <Input
                    type="number"
                    placeholder={wb.weightKg}
                    value={set.weightKg ?? ""}
                    onChange={(e) => updateSet(entryIndex, setIndex, { weightKg: e.target.value ? Number(e.target.value) : undefined })}
                  />
                  <Input
                    type="number"
                    placeholder={wb.durationSec}
                    value={set.durationSeconds ?? ""}
                    onChange={(e) => updateSet(entryIndex, setIndex, { durationSeconds: e.target.value ? Number(e.target.value) : undefined })}
                  />
                  <Input
                    type="number"
                    placeholder={wb.restSec}
                    value={set.restSeconds ?? ""}
                    onChange={(e) => updateSet(entryIndex, setIndex, { restSeconds: e.target.value ? Number(e.target.value) : undefined })}
                  />
                  <button
                    onClick={() => removeSet(entryIndex, setIndex)}
                    className="text-xs text-silver hover:text-red-400"
                  >
                    {wb.removeSet}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addSet(entryIndex)}
              className="mt-3 text-sm font-semibold text-gold hover:underline"
            >
              {wb.addSet}
            </button>
          </Card>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <Button variant="primary" size="lg" onClick={handleSave} disabled={saving} className="mt-8 w-full">
        {saving ? wb.saving : wb.save}
      </Button>
    </div>
  );
}
