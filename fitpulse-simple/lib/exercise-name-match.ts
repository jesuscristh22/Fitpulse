import type { Exercise } from "./workouts";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// Matches an AI-generated exercise name against our own library by exact
// normalized name (case/accent/punctuation-insensitive). Used so a Military
// program — which is free to name any real, current exercise, not limited to
// our catalog — still links to our detailed how-to page whenever the name
// happens to match something we already have written up.
export function matchExerciseByName(name: string, exercises: Exercise[]): Exercise | undefined {
  const target = normalize(name);
  return exercises.find((e) => normalize(e.name) === target);
}
