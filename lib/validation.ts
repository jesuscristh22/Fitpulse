import { z } from "zod";

export const onboardingSchema = z.object({
  displayName: z.string().min(1).max(80),
  birthDate: z.string().date(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  country: z.enum(["BR", "PT", "ES", "US"]),
  locale: z.enum(["pt-BR", "pt-PT", "es-ES", "en-US"]),
  heightCm: z.number().min(80).max(260),
  weightKg: z.number().min(25).max(400),
  goals: z.array(z.string()).min(1),
  environment: z.array(z.string()).min(1),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  daysAvailable: z.number().min(1).max(7),
  minutesAvailable: z.number().min(10),
  equipment: z.array(z.string()),
});

// User-submitted intake for the Military Calisthenics questionnaire (§30,
// "Complete Specific Questionnaire" step — comes before Stripe checkout,
// which is Phase 10). Distinct from militaryProgramSchema below, which
// validates the AI-generated program output (Phase 11).
export const militaryIntakeSchema = z.object({
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  focus: z.enum(["selection_prep", "endurance", "strength", "general_conditioning"]),
  daysPerWeek: z.number().min(2).max(7),
  durationWeeks: z.number().min(4).max(8),
  limitations: z.string().max(500).optional(),
});

export const militaryProgramSchema = z.object({
  programName: z.string(),
  durationWeeks: z.number().int().positive(),
  daysPerWeek: z.number().int().min(1).max(7),
  estimatedDuration: z.number().int().positive(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  goal: z.string(),
  sessions: z.array(
    z.object({
      day: z.number().int(),
      exercises: z.array(
        z.object({
          name: z.string(), sets: z.number().int().positive(),
          reps: z.string(), restSeconds: z.number().int().nonnegative(),
        }),
      ),
    }),
  ),
});
