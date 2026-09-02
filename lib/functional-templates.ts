export interface FunctionalTemplateExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds?: number;
}

export interface FunctionalTemplateBase {
  slug: string;
  estimatedMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  exercises: FunctionalTemplateExercise[];
}

// Structural data only — names/descriptions are translated in
// lib/functional-content.ts. Uses exercise ids already in exercise-data.ts.
export const FUNCTIONAL_TEMPLATES_BASE: FunctionalTemplateBase[] = [
  {
    slug: "iniciante-funcional",
    estimatedMinutes: 15,
    difficulty: "beginner",
    exercises: [
      { exerciseId: "bodyweight-squat", sets: 3, reps: 12, restSeconds: 45 },
      { exerciseId: "push-up", sets: 3, reps: 8, restSeconds: 45 },
      { exerciseId: "plank", sets: 3, durationSeconds: 30, restSeconds: 30 },
    ],
  },
  {
    slug: "hiit-funcional",
    estimatedMinutes: 20,
    difficulty: "intermediate",
    exercises: [
      { exerciseId: "burpee", sets: 4, reps: 10, restSeconds: 30 },
      { exerciseId: "mountain-climbers", sets: 4, durationSeconds: 20, restSeconds: 20 },
      { exerciseId: "jumping-jacks", sets: 4, durationSeconds: 30, restSeconds: 20 },
      { exerciseId: "high-knees", sets: 4, durationSeconds: 30, restSeconds: 20 },
    ],
  },
  {
    slug: "full-body-funcional",
    estimatedMinutes: 25,
    difficulty: "intermediate",
    exercises: [
      { exerciseId: "bear-crawl", sets: 3, durationSeconds: 20, restSeconds: 30 },
      { exerciseId: "bodyweight-squat", sets: 3, reps: 15, restSeconds: 30 },
      { exerciseId: "push-up", sets: 3, reps: 10, restSeconds: 30 },
      { exerciseId: "mountain-climbers", sets: 3, durationSeconds: 20, restSeconds: 30 },
      { exerciseId: "plank", sets: 3, durationSeconds: 40, restSeconds: 30 },
    ],
  },
];
