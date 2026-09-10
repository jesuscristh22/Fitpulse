import type { LocaleSlug } from "./locales-config";

// Builds a YouTube search URL (not an embedded video) for a given exercise
// name. This is deliberately a search, not a curated/verified link: it lets
// AI-generated programs use real, current, professionally-taught exercises
// without being limited to (or needing manual verification against) our own
// exercise library, while still pointing the person at real demonstration
// videos in their own language.
const QUALIFIER: Record<LocaleSlug, string> = {
  "pt-br": "como fazer execução correta exercício",
  en: "how to do proper form exercise tutorial",
  es: "cómo hacer forma correcta ejercicio tutorial",
};

export function buildExerciseVideoSearchUrl(exerciseName: string, locale: LocaleSlug, context?: string): string {
  const query = [exerciseName, context, QUALIFIER[locale]].filter(Boolean).join(" ");
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
