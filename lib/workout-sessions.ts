export interface CompletedSet {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps?: number;
  weightKg?: number;
  durationSeconds?: number;
}

export interface WorkoutSession {
  id?: string;
  userId: string;
  workoutId: string;
  workoutName: string;
  startedAt: string; // ISO
  completedAt?: string; // ISO — set when the session is finished/saved
  completedSets: CompletedSet[];
}
