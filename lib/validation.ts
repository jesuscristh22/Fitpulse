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
