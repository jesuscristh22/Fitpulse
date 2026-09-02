import "server-only";
import { adminDb } from "./firebase-admin";
import { SEED_EXERCISES } from "./exercise-data";
import type { Exercise } from "./workouts";

// Same graceful-fallback pattern as blog-server.ts: try Firestore's public
// "exercises" collection first (populated by Super Admin content tools,
// Phase 19+), fall back to the seed library otherwise so the page is never
// empty and never crashes if Firebase isn't configured yet.
export async function getExercises(): Promise<Exercise[]> {
  try {
    const snapshot = await adminDb().collection("exercises").get();
    if (snapshot.empty) return SEED_EXERCISES;
    return snapshot.docs.map((doc) => doc.data() as Exercise);
  } catch (error) {
    console.error("[getExercises] Firestore unavailable, falling back to seed data:", error);
    return SEED_EXERCISES;
  }
}

export async function getExercise(slug: string): Promise<Exercise | null> {
  const exercises = await getExercises();
  return exercises.find((e) => e.slug === slug) ?? null;
}
