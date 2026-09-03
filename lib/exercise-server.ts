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

// Our 32 hand-written seed exercises are ALWAYS included — Firestore's
// "exercises" collection is treated as an ADDITIVE extension (exercises the
// Military AI generator discovers and auto-saves, or that Super Admin adds
// later in Phase 19), never a replacement. A previous version of this
// function returned ONLY Firestore's exercises whenever that collection was
// non-empty, which would have silently erased the whole curated library the
// moment a single AI-discovered exercise was saved — fixed here.
export async function getExercises(locale: LocaleSlug): Promise<Exercise[]> {
  const seedExercises = SEED_EXERCISES_BASE.map((base) => mergeWithTranslation(base, locale));

  try {
    const snapshot = await adminDb().collection("exercises").get();
    const seedSlugs = new Set(seedExercises.map((e) => e.slug));

    const discovered = snapshot.docs
      .map((doc) => doc.data() as Exercise & { locale?: LocaleSlug })
      .filter((e) => (!e.locale || e.locale === locale) && !seedSlugs.has(e.slug));

    return [...seedExercises, ...discovered];
  } catch (error) {
    console.error("[getExercises] Firestore unavailable, using seed library only:", error);
    return seedExercises;
  }
}

export async function getExercise(locale: LocaleSlug, slug: string): Promise<Exercise | null> {
  const exercises = await getExercises(locale);
  return exercises.find((e) => e.slug === slug) ?? null;
}
