import type { ExerciseCategory } from "./workouts";

// Structural fields only — category, difficulty, muscles, equipment, and
// alternatives are locale-independent. All human-readable text (name,
// description, instructions, safety notes) lives in exercise-translations.ts
// keyed by slug + locale, and gets merged in by lib/exercise-server.ts.
export interface ExerciseBase {
  id: string;
  slug: string;
  category: ExerciseCategory;
  difficulty: "beginner" | "intermediate" | "advanced";
  muscles: string[];
  equipment: string[];
  alternatives?: string[];
}

export const SEED_EXERCISES_BASE: ExerciseBase[] = [
  // ---- Strength ----
  { id: "back-squat", slug: "back-squat", category: "strength", difficulty: "intermediate", muscles: ["quads", "glutes", "hamstrings", "core"], equipment: ["barbell", "full_gym"], alternatives: [] },
  { id: "bench-press", slug: "bench-press", category: "strength", difficulty: "intermediate", muscles: ["chest", "shoulders", "triceps"], equipment: ["barbell", "full_gym"], alternatives: ["dumbbell-bench-press", "push-up"] },
  { id: "deadlift", slug: "deadlift", category: "strength", difficulty: "advanced", muscles: ["back", "glutes", "hamstrings", "core"], equipment: ["barbell", "full_gym"], alternatives: [] },
  { id: "dumbbell-bench-press", slug: "dumbbell-bench-press", category: "strength", difficulty: "beginner", muscles: ["chest", "shoulders", "triceps"], equipment: ["dumbbells"], alternatives: ["bench-press", "push-up"] },

  // ---- Cardio ----
  { id: "running", slug: "running", category: "cardio", difficulty: "beginner", muscles: ["quads", "hamstrings", "calves", "core"], equipment: ["no_equipment"], alternatives: ["cycling", "jump-rope"] },
  { id: "jump-rope", slug: "jump-rope", category: "cardio", difficulty: "beginner", muscles: ["calves", "core"], equipment: ["other"], alternatives: ["running"] },
  { id: "rowing-machine", slug: "rowing-machine", category: "cardio", difficulty: "beginner", muscles: ["back", "quads", "core"], equipment: ["full_gym"], alternatives: ["running", "cycling"] },
  { id: "cycling", slug: "cycling", category: "cardio", difficulty: "beginner", muscles: ["quads", "hamstrings", "calves"], equipment: ["full_gym"], alternatives: ["running", "rowing-machine"] },

  // ---- Calisthenics ----
  { id: "push-up", slug: "push-up", category: "calisthenics", difficulty: "beginner", muscles: ["chest", "shoulders", "triceps", "core"], equipment: ["no_equipment"], alternatives: ["bench-press", "dumbbell-bench-press"] },
  { id: "pull-up", slug: "pull-up", category: "calisthenics", difficulty: "intermediate", muscles: ["back", "biceps", "core"], equipment: ["pull_up_bar"], alternatives: [] },
  { id: "bodyweight-squat", slug: "bodyweight-squat", category: "calisthenics", difficulty: "beginner", muscles: ["quads", "glutes", "hamstrings"], equipment: ["no_equipment"], alternatives: ["back-squat"] },
  { id: "plank", slug: "plank", category: "calisthenics", difficulty: "beginner", muscles: ["core"], equipment: ["no_equipment"], alternatives: [] },

  // ---- Military ----
  { id: "burpee", slug: "burpee", category: "military", difficulty: "intermediate", muscles: ["full_body"], equipment: ["no_equipment"], alternatives: ["mountain-climbers", "jump-rope"] },
  { id: "mountain-climbers", slug: "mountain-climbers", category: "military", difficulty: "beginner", muscles: ["core", "quads"], equipment: ["no_equipment"], alternatives: ["burpee", "plank"] },
  { id: "bear-crawl", slug: "bear-crawl", category: "military", difficulty: "intermediate", muscles: ["full_body", "core", "shoulders"], equipment: ["no_equipment"], alternatives: ["plank", "mountain-climbers"] },
  { id: "sprints", slug: "sprints", category: "military", difficulty: "advanced", muscles: ["quads", "hamstrings", "glutes", "calves"], equipment: ["no_equipment"], alternatives: ["running", "burpee"] },
  { id: "sit-up", slug: "sit-up", category: "military", difficulty: "beginner", muscles: ["core"], equipment: ["no_equipment"], alternatives: ["plank", "flutter-kicks"] },
  { id: "flutter-kicks", slug: "flutter-kicks", category: "military", difficulty: "beginner", muscles: ["core"], equipment: ["no_equipment"], alternatives: ["sit-up", "plank"] },
  { id: "squat-thrust", slug: "squat-thrust", category: "military", difficulty: "intermediate", muscles: ["full_body", "quads", "core"], equipment: ["no_equipment"], alternatives: ["burpee", "squat-jump"] },
  { id: "squat-jump", slug: "squat-jump", category: "military", difficulty: "intermediate", muscles: ["quads", "glutes", "calves"], equipment: ["no_equipment"], alternatives: ["squat-thrust", "bodyweight-squat"] },

  // ---- Mobility ----
  { id: "hip-flexor-stretch", slug: "hip-flexor-stretch", category: "mobility", difficulty: "beginner", muscles: ["core"], equipment: ["no_equipment"], alternatives: ["cat-cow"] },
  { id: "cat-cow", slug: "cat-cow", category: "mobility", difficulty: "beginner", muscles: ["core", "back"], equipment: ["no_equipment"], alternatives: ["hip-flexor-stretch"] },
  { id: "shoulder-dislocates", slug: "shoulder-dislocates", category: "mobility", difficulty: "beginner", muscles: ["shoulders"], equipment: ["resistance_bands"], alternatives: ["cat-cow"] },
  { id: "worlds-greatest-stretch", slug: "worlds-greatest-stretch", category: "mobility", difficulty: "intermediate", muscles: ["hamstrings", "core", "back"], equipment: ["no_equipment"], alternatives: ["hip-flexor-stretch"] },

  // ---- Warm-up ----
  { id: "jumping-jacks", slug: "jumping-jacks", category: "warm-up", difficulty: "beginner", muscles: ["full_body"], equipment: ["no_equipment"], alternatives: ["high-knees"] },
  { id: "high-knees", slug: "high-knees", category: "warm-up", difficulty: "beginner", muscles: ["quads", "core"], equipment: ["no_equipment"], alternatives: ["jumping-jacks"] },
  { id: "arm-circles", slug: "arm-circles", category: "warm-up", difficulty: "beginner", muscles: ["shoulders"], equipment: ["no_equipment"], alternatives: ["shoulder-dislocates"] },
  { id: "walking-lunges", slug: "walking-lunges-warmup", category: "warm-up", difficulty: "beginner", muscles: ["quads", "glutes"], equipment: ["no_equipment"], alternatives: ["bodyweight-squat"] },

  // ---- Recovery ----
  { id: "foam-rolling-quads", slug: "foam-rolling-quads", category: "recovery", difficulty: "beginner", muscles: ["quads"], equipment: ["other"], alternatives: ["hip-flexor-stretch"] },
  { id: "child-pose", slug: "childs-pose", category: "recovery", difficulty: "beginner", muscles: ["back", "core"], equipment: ["no_equipment"], alternatives: ["cat-cow"] },
  { id: "walking-cooldown", slug: "walking-cooldown", category: "recovery", difficulty: "beginner", muscles: ["full_body"], equipment: ["no_equipment"], alternatives: ["childs-pose"] },
  { id: "box-breathing", slug: "box-breathing", category: "recovery", difficulty: "beginner", muscles: [], equipment: ["no_equipment"], alternatives: ["childs-pose"] },
];
