import type {
  FitnessGoal,
  TrainingEnvironment,
  ExperienceLevel,
  SupportedCountry,
  SupportedLocale,
} from "./types";

// Canonical option lists for the onboarding wizard (§18). Labels are
// translated per-locale in lib/i18n/*.json under "onboarding.steps.*.options";
// these arrays only fix the stored enum values and their order on screen.
export const GENDER_OPTIONS = ["male", "female", "other", "prefer_not_to_say"] as const;

export const COUNTRY_OPTIONS: SupportedCountry[] = ["BR", "PT", "ES", "US"];

export const LANGUAGE_OPTIONS: SupportedLocale[] = ["pt-BR", "pt-PT", "es-ES", "en-US"];

export const GOAL_OPTIONS: FitnessGoal[] = [
  "lose_weight",
  "build_muscle",
  "increase_strength",
  "improve_conditioning",
  "military_fitness",
  "calisthenics",
  "improve_mobility",
  "improve_endurance",
  "stay_active",
  "general_fitness",
];

export const ENVIRONMENT_OPTIONS: TrainingEnvironment[] = [
  "gym",
  "home",
  "outdoor",
  "military_calisthenics",
  "hybrid",
  "with_coach",
];

export const EXPERIENCE_OPTIONS: ExperienceLevel[] = ["beginner", "intermediate", "advanced"];

export const DAYS_OPTIONS = [2, 3, 4, 5, 6, 7] as const;

export const MINUTES_OPTIONS = [10, 15, 20, 30, 45, 60, 90] as const;

export const EQUIPMENT_OPTIONS = [
  "no_equipment",
  "dumbbells",
  "barbell",
  "resistance_bands",
  "pull_up_bar",
  "full_gym",
  "other",
] as const;

export const ACTIVITY_LEVEL_OPTIONS = ["sedentary", "light", "moderate", "active", "very_active"] as const;
