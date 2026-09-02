"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { Exercise, ExerciseCategory } from "@/lib/workouts";

const CATEGORIES: ExerciseCategory[] = [
  "strength",
  "cardio",
  "calisthenics",
  "military",
  "mobility",
  "warm-up",
  "recovery",
];

export function ExerciseLibraryClient({
  locale,
  dict,
  exercises,
}: {
  locale: LocaleSlug;
  dict: Dictionary;
  exercises: Exercise[];
}) {
  const lib = dict.library;
  const [category, setCategory] = useState<ExerciseCategory | "all">("all");
  const [muscle, setMuscle] = useState("all");
  const [equipment, setEquipment] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const muscleOptions = useMemo(
    () => Array.from(new Set(exercises.flatMap((e) => e.muscles))).sort(),
    [exercises],
  );
  const equipmentOptions = useMemo(
    () => Array.from(new Set(exercises.flatMap((e) => e.equipment))).sort(),
    [exercises],
  );

  const filtered = exercises.filter((e) => {
    if (category !== "all" && e.category !== category) return false;
    if (muscle !== "all" && !e.muscles.includes(muscle)) return false;
    if (equipment !== "all" && !e.equipment.includes(equipment)) return false;
    if (difficulty !== "all" && e.difficulty !== difficulty) return false;
    return true;
  });

  function clearFilters() {
    setCategory("all");
    setMuscle("all");
    setEquipment("all");
    setDifficulty("all");
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("all")}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            category === "all" ? "border-gold bg-gold text-carbon" : "border-white/15 text-white hover:border-gold/60"
          }`}
        >
          {lib.allCategories}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              category === c ? "border-gold bg-gold text-carbon" : "border-white/15 text-white hover:border-gold/60"
            }`}
          >
            {lib.categories[c]}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Select value={muscle} onChange={(e) => setMuscle(e.target.value)}>
          <option value="all">{lib.allMuscles}</option>
          {muscleOptions.map((m) => (
            <option key={m} value={m}>
              {lib.muscles[m as keyof typeof lib.muscles] ?? m}
            </option>
          ))}
        </Select>
        <Select value={equipment} onChange={(e) => setEquipment(e.target.value)}>
          <option value="all">{lib.allEquipment}</option>
          {equipmentOptions.map((eq) => (
            <option key={eq} value={eq}>
              {lib.equipment[eq as keyof typeof lib.equipment] ?? eq}
            </option>
          ))}
        </Select>
        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="all">{lib.allDifficulty}</option>
          {(["beginner", "intermediate", "advanced"] as const).map((d) => (
            <option key={d} value={d}>
              {lib.difficulty[d]}
            </option>
          ))}
        </Select>
        <button
          onClick={clearFilters}
          className="rounded-md border border-white/10 px-4 py-2 text-sm text-silver hover:border-gold/60 hover:text-white"
        >
          {lib.clearFilters}
        </button>
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-silver">{lib.noResults}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/${locale}/exercicios/${exercise.slug}`}
              className="block rounded-xl border border-white/10 bg-graphite p-5 transition-colors hover:border-gold/40"
            >
              <div className="flex items-center justify-between">
                <p className="font-heading text-sm font-bold">{exercise.name}</p>
                <Badge variant="gold">{lib.difficulty[exercise.difficulty]}</Badge>
              </div>
              <p className="mt-2 text-xs text-silver">{lib.categories[exercise.category]}</p>
              <p className="mt-3 text-sm text-silver line-clamp-2">{exercise.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
