import "server-only";
import { adminDb } from "./firebase-admin";
import { searchYouTubeVideoId } from "./youtube-api";
import type { Exercise, ExerciseCategory } from "./workouts";
import type { LocaleSlug } from "./locales-config";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Auto-adds an exercise an AI generator (Military, Copilot, ...) named but
// that isn't in our library yet — using the description/instructions/muscles
// the SAME generation call already produced (no second OpenAI call needed),
// plus a best-effort real video found via the YouTube Data API. Idempotent:
// if this slug+locale was already discovered before, reuses it instead of
// overwriting/re-searching. Shared across every AI feature that names
// exercises, so the library grows from one place.
export async function discoverAndSaveExercise(
  aiExercise: { name: string; description: string; instructions: string[]; muscles: string[] },
  locale: LocaleSlug,
  category: ExerciseCategory = "strength",
  equipment: string[] = ["no_equipment"],
): Promise<Exercise> {
  const slug = slugify(aiExercise.name);
  const ref = adminDb().collection("exercises").doc(`${locale}-${slug}`);
  const existing = await ref.get();
  if (existing.exists) return existing.data() as Exercise;

  const videoId = await searchYouTubeVideoId(`${aiExercise.name} how to do proper form tutorial`);

  const exercise: Exercise = {
    id: `${locale}-${slug}`,
    slug,
    name: aiExercise.name,
    description: aiExercise.description,
    instructions: aiExercise.instructions,
    muscles: aiExercise.muscles,
    equipment,
    difficulty: "intermediate",
    category,
    ...(videoId ? { videoId } : {}),
  };

  await ref.set({ ...exercise, locale, source: "ai_discovered", discoveredAt: new Date().toISOString() });
  return exercise;
}
