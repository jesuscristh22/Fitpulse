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
  // Updated to Nick Koumalatsos (USMC PREP) — former Marine Raider — for
  // credibility on a "military calisthenics" program. PT/ES equivalents from
  // an equally credible military source weren't found yet; keeping the
  // existing general-fitness videos for those languages until a better match
  // turns up in a future phase (English falls back automatically otherwise).
  "push-up": { en: "leKvyRCrdlY", "pt-br": "H23VZ7IZwG4", es: "QVvY6liKWVg" },
  "pull-up": { en: "Me_uNG19x8M" },
  "bodyweight-squat": { en: "kSWFejzUsJE" },
  plank: { en: "MVB7PgsAIs8" },
  deadlift: { en: "Qo-a4IzpooU" }, // USMC PREP: HOW TO DEADLIFT
  "bench-press": { en: "Y-ecGlPq7gk" }, // USMC PREP: HOW TO BENCH
  "bear-crawl": { en: "Wgt1vdZ_YYk" }, // Final Round Training — Exercise: Bear Crawl
  burpee: { en: "qLBImHhCXSw", "pt-br": "ChNWqTWunj4", es: "KAFFFjaFryc" },
  "cat-cow": { en: "y39PrKY_4JM", "pt-br": "ohfiTnNHcHw", es: "JjQYGqCXbkA" },
  "jumping-jacks": { en: "uLVt6u15L98", "pt-br": "S2uqQ9zHZMc", es: "CcSADh4EbXc" },
  "childs-pose": { en: "ESy8ujdrZrk", "pt-br": "kcW8ZQPrdW0", es: "CLlAUN_r75k" },
  "jump-rope": { en: "nMHfZ-yrFjA", "pt-br": "bB2BMeZTygg", es: "FHwdRfX7Wv0" },
  // New military calisthenics exercises (added for the Tactical program
  // generator) — all sourced from Nick Koumalatsos (USMC PREP) or an
  // official Army training video. English only for now.
  "sit-up": { en: "sLFV4DdEFNM" },
  "flutter-kicks": { en: "F2UAWc_ubjg" },
  "squat-thrust": { en: "v8C654fpSYo" },
  "squat-jump": { en: "yjq2x_j-Nrc" },
};

// Falls back to English if the requested locale doesn't have a video yet,
// rather than showing nothing when at least some demonstration exists.
export function getExerciseVideoId(slug: string, locale: LocaleSlug): string | undefined {
  const entry = EXERCISE_VIDEOS[slug];
  if (!entry) return undefined;
  return entry[locale] ?? entry.en;
}
