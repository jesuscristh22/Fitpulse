export type ExerciseCategory =
  | "strength" | "cardio" | "calisthenics" | "military" | "mobility" | "warm-up" | "recovery";

export interface Exercise {
  id: string; name: string; slug: string; description: string; instructions: string[];
  muscles: string[]; equipment: string[]; difficulty: "beginner" | "intermediate" | "advanced";
  category: ExerciseCategory; mediaUrl?: string; safetyNotes?: string[]; alternatives?: string[];
}

export interface WorkoutSet {
  exerciseId: string; setNumber: number; reps?: number; weightKg?: number;
  durationSeconds?: number; restSeconds?: number; notes?: string;
}

export interface Workout {
  id: string; ownerId: string; name: string; createdBy: "member" | "coach" | "ai"; sets: WorkoutSet[];
}
