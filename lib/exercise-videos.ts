import type { LocaleSlug } from "./locales-config";

// Maps exercise slug -> per-locale YouTube video ID. Sourced from reputable
// channels/institutions per language (NASM, Yoga With Adriene, Well+Good,
// Thiago Pugliesi, Smart Fit, Sesc, CuídatePlus, Sport Life, Fisioterapia
// Online, etc). [CONFIGURATION REQUIRED] — only 7 exercises (one per
// category) are filled in; the rest have no video yet rather than an
// unverified guess. Add more deliberately (Super Admin content tools arrive
// in Phase 19) rather than filling every slot at once.
export const EXERCISE_VIDEOS: Record<string, Partial<Record<LocaleSlug, string>>> = {
  "back-squat": { en: "T_t85kQEDWk", "pt-br": "nrM8zB5-gtE", es: "HjjLHrW2Www" },
  "push-up": { en: "uXC_3Gs9Yr0", "pt-br": "H23VZ7IZwG4", es: "QVvY6liKWVg" },
  burpee: { en: "qLBImHhCXSw", "pt-br": "ChNWqTWunj4", es: "KAFFFjaFryc" },
  "cat-cow": { en: "y39PrKY_4JM", "pt-br": "ohfiTnNHcHw", es: "JjQYGqCXbkA" },
  "jumping-jacks": { en: "uLVt6u15L98", "pt-br": "S2uqQ9zHZMc", es: "CcSADh4EbXc" },
  "childs-pose": { en: "ESy8ujdrZrk", "pt-br": "kcW8ZQPrdW0", es: "CLlAUN_r75k" },
  "jump-rope": { en: "nMHfZ-yrFjA", "pt-br": "bB2BMeZTygg", es: "FHwdRfX7Wv0" },
};

// Falls back to English if the requested locale doesn't have a video yet,
// rather than showing nothing when at least some demonstration exists.
export function getExerciseVideoId(slug: string, locale: LocaleSlug): string | undefined {
  const entry = EXERCISE_VIDEOS[slug];
  if (!entry) return undefined;
  return entry[locale] ?? entry.en;
}
