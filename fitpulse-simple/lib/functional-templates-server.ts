import "server-only";
import { getExercises } from "./exercise-server";
import { FUNCTIONAL_TEMPLATES_BASE } from "./functional-templates";
import { getFunctionalTemplateText } from "./functional-content";
import type { LocaleSlug } from "./locales-config";

export interface FunctionalTemplateExerciseResolved {
  exerciseId: string;
  exerciseSlug: string;
  exerciseName: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds?: number;
}

export interface FunctionalTemplate {
  slug: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  exercises: FunctionalTemplateExerciseResolved[];
  videoId?: string;
}

// Merges structural template data with localized exercise names/slugs (from
// the exercise library) and localized template chrome text, all resolved
// for the requested locale.
export async function getFunctionalTemplates(locale: LocaleSlug): Promise<FunctionalTemplate[]> {
  const exercises = await getExercises(locale);
  const byId = new Map(exercises.map((e) => [e.id, e]));

  return FUNCTIONAL_TEMPLATES_BASE.map((base) => {
    const text = getFunctionalTemplateText(locale, base.slug);
    return {
      slug: base.slug,
      name: text?.name ?? base.slug,
      description: text?.description ?? "",
      estimatedMinutes: base.estimatedMinutes,
      difficulty: base.difficulty,
      videoId: base.videoId,
      exercises: base.exercises.map((e) => {
        const ex = byId.get(e.exerciseId);
        return {
          exerciseId: e.exerciseId,
          exerciseSlug: ex?.slug ?? e.exerciseId,
          exerciseName: ex?.name ?? e.exerciseId,
          sets: e.sets,
          reps: e.reps,
          durationSeconds: e.durationSeconds,
          restSeconds: e.restSeconds,
        };
      }),
    };
  });
}
