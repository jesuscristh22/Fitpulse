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

// Same graceful-fallback pattern as blog-server.ts: try Firestore's public
// "exercises" collection first (populated by Super Admin content tools,
// Phase 19+ — those docs are expected to already store locale-resolved text).
// Falls back to the seed library, localized on the fly for the requested
// locale, so the page is never empty and never crashes if Firebase isn't
// configured yet.
export async function getExercises(locale: LocaleSlug): Promise<Exercise[]> {
  try {
    const snapshot = await adminDb().collection("exercises").get();
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => doc.data() as Exercise);
    }
  } catch (error) {
    console.error("[getExercises] Firestore unavailable, falling back to seed data:", error);
  }
  return SEED_EXERCISES_BASE.map((base) => mergeWithTranslation(base, locale));
}

export async function getExercise(locale: LocaleSlug, slug: string): Promise<Exercise | null> {
  const exercises = await getExercises(locale);
  return exercises.find((e) => e.slug === slug) ?? null;
}
