export type ExerciseCategory =
  | "strength" | "cardio" | "calisthenics" | "military" | "mobility" | "warm-up" | "recovery";

export interface Exercise {
  id: string; name: string; slug: string; description: string; instructions: string[];
  muscles: string[]; equipment: string[]; difficulty: "beginner" | "intermediate" | "advanced";
  category: ExerciseCategory; mediaUrl?: string; safetyNotes?: string[]; alternatives?: string[];
}

export interface WorkoutSet {
  exerciseId: string;
  exerciseName?: string; // denormalized for display without re-joining the exercise library
  setNumber: number; reps?: number; weightKg?: number;
  durationSeconds?: number; restSeconds?: number; notes?: string;
}

export interface Workout {
  id?: string; // Firestore doc id, attached when reading — never stored inside the doc itself
  ownerId: string; name: string; createdBy: "member" | "coach" | "ai"; sets: WorkoutSet[];
  createdAt?: string;
}
