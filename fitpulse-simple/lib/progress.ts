export interface WeightLog {
  id?: string;
  userId: string;
  weightKg: number;
  loggedAt: string; // ISO date
}

export type PRExerciseKey =
  | "bench_press" | "squat" | "deadlift" | "pull_ups" | "push_ups" | "plank" | "running_5k" | "custom";

export interface PersonalRecord {
  id?: string;
  userId: string;
  exerciseKey: PRExerciseKey;
  customLabel?: string; // used when exerciseKey === "custom"
  value: number;
  unit: "kg" | "reps" | "seconds" | "minutes";
  achievedAt: string; // ISO date
}
