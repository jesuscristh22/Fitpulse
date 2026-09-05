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

// AI Copilot (Phase 14, §35-40) — adapts a workout to what the person says
// right now ("I only have 20 minutes", "I only have dumbbells", "I'm
// traveling"). Same principle as the Military schema: exercises are named
// freely, then matched/auto-discovered against our library server-side.
export const copilotResponseSchema = z.object({
  message: z.string(), // short, encouraging explanation of what was adapted and why
  workoutName: z.string(),
  exercises: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      instructions: z.array(z.string()).min(2).max(5),
      muscles: z.array(z.string()).default([]),
      sets: z.number().int().positive(), // how many sets of this exercise
      reps: z.number().int().positive().optional(),
      weightKg: z.number().positive().optional(),
      durationSeconds: z.number().int().positive().optional(),
      restSeconds: z.number().int().min(0).max(120).optional(),
    }),
  ).min(3),
});

export const militaryProgramSchema = z.object({
  programName: z.string(),
  durationWeeks: z.number().int().positive(),
  daysPerWeek: z.number().int().min(1).max(7),
  estimatedDuration: z.number().int().min(15).max(35),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  goal: z.string(),
  sessions: z.array(
    z.object({
      day: z.number().int(),
      exercises: z.array(
        z.object({
          name: z.string(), // free text — not required to match our library
          description: z.string(), // used to auto-add this exercise to our library if it's new
          instructions: z.array(z.string()).min(2).max(5),
          muscles: z.array(z.string()).default([]),
          sets: z.number().int().positive(),
          reps: z.string(),
          restSeconds: z.number().int().min(0).max(30),
        }),
      ).min(5),
    }),
  ),
});
