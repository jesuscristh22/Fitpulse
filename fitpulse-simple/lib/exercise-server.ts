import "server-only";
import { adminDb } from "./firebase-admin";
import { SEED_EXERCISES_BASE, type ExerciseBase } from "./exercise-data";
import { EXERCISE_TRANSLATIONS } from "./exercise-translations";
import type { LocaleSlug } from "./locales-config";
import type { Exercise } from "./workouts";

function mergeWithTranslation(base: ExerciseBase, locale: LocaleSlug): Exercise {
  const text = EXERCISE_TRANSLATIONS[base.slug]?.[locale] ?? EXERCISE_TRANSLATIONS[base.slug]?.en;
  return {
    id: base.id,
    slug: base.slug,
    category: base.category,
    difficulty: base.difficulty,
    muscles: base.muscles,
    equipment: base.equipment,
    alternatives: base.alternatives,
    name: text?.name ?? base.slug,
    description: text?.description ?? "",
    instructions: text?.instructions ?? [],
    safetyNotes: text?.safetyNotes,
  };
}

// Our 32 hand-written seed exercises are the baseline. Firestore's
// "exercises" collection can EXTEND the library (new exercises the Military
// AI generator or Copilot discover) AND OVERRIDE any exercise by slug+locale
// (edits Super Admin makes in the content panel, Phase 19) — a Firestore doc
// always wins over the seed version with the same slug, since it represents
// the most recently edited/curated content.
export async function getExercises(locale: LocaleSlug): Promise<Exercise[]> {
  const seedExercises = SEED_EXERCISES_BASE.map((base) => mergeWithTranslation(base, locale));
  const bySlug = new Map(seedExercises.map((e) => [e.slug, e]));

  try {
    const snapshot = await adminDb().collection("exercises").get();
    snapshot.docs
      .map((doc) => doc.data() as Exercise & { locale?: LocaleSlug })
      .filter((e) => !e.locale || e.locale === locale)
      .forEach((e) => bySlug.set(e.slug, e));
  } catch (error) {
    console.error("[getExercises] Firestore unavailable, using seed library only:", error);
  }

  return Array.from(bySlug.values());
}

export async function getExercise(locale: LocaleSlug, slug: string): Promise<Exercise | null> {
  const exercises = await getExercises(locale);
  return exercises.find((e) => e.slug === slug) ?? null;
}
