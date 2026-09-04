import "server-only";
import { copilotResponseSchema } from "./validation";
import type { z } from "zod";
import type { FitnessProfile } from "./types";
import type { Workout } from "./workouts";
import type { LocaleSlug } from "./locales-config";

type CopilotResponse = z.infer<typeof copilotResponseSchema>;

const LANGUAGE_NAME: Record<LocaleSlug, string> = {
  "pt-br": "Brazilian Portuguese",
  en: "English",
  es: "Spanish (Spain)",
};

// Calls OpenAI to adapt a workout to what the person says right now — "I
// only have 20 minutes", "I only have dumbbells", "I'm traveling" (§35).
// Exercise names are free text, same reasoning as the Military generator:
// matched against our library (or auto-discovered) server-side afterward,
// so results are never limited to a fixed list but still end up linked to a
// real how-to page with instructions and, where available, video.
export async function generateCopilotAdaptation(params: {
  message: string;
  locale: LocaleSlug;
  fitness?: FitnessProfile | null;
  recentWorkout?: Pick<Workout, "name" | "sets"> | null;
}): Promise<CopilotResponse> {
  const { message, locale, fitness, recentWorkout } = params;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("[CONFIGURATION REQUIRED] OPENAI_API_KEY is not set.");
  }

  const profileContext = fitness
    ? `Their fitness profile: goal(s) ${fitness.goals?.join(", ") || "unspecified"}, experience ${fitness.experience || "unspecified"}, usual environment ${fitness.environment?.join(", ") || "unspecified"}, usual equipment ${fitness.equipment?.join(", ") || "unspecified"}.`
    : "No fitness profile on file yet.";

  const recentWorkoutContext = recentWorkout
    ? `Their most recent saved workout, "${recentWorkout.name}", includes: ${recentWorkout.sets
        .slice(0, 8)
        .map((s) => s.exerciseName ?? s.exerciseId)
        .join(", ")}.`
    : "No recent saved workout to reference.";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are FitPulse's AI Copilot — a warm, encouraging fitness assistant that adapts a " +
            "person's workout to their real situation right now (limited time, different equipment, " +
            "traveling, etc). Never diagnose injuries or prescribe medical treatment; if they mention " +
            "pain or injury, keep the workout conservative and suggest they see a professional if it " +
            "persists.\n\n" +
            `Write every text field in ${LANGUAGE_NAME[locale]}. This is mandatory.\n\n` +
            "Use real, well-known, currently-taught exercises appropriate to what the person described " +
            "and their fitness profile — you are not limited to any fixed list.\n\n" +
            "Respond ONLY with a JSON object matching exactly this shape: " +
            '{ "message": string (2-3 encouraging sentences explaining the adaptation), ' +
            '"workoutName": string, "sets": [{ "name": string, ' +
            '"description": string (one sentence explaining what it trains), ' +
            '"instructions": string[] (2-4 short steps), ' +
            '"muscles": string[] (lowercase single words), "setNumber": number, ' +
            '"reps": number (optional), "weightKg": number (optional), ' +
            '"durationSeconds": number (optional), "restSeconds": number (optional, 0-120) }] }. ' +
            "Include at least 3 exercises, each with a sensible setNumber sequence per exercise " +
            "(e.g. 3 sets of the same exercise = setNumber 1, 2, 3).",
        },
        {
          role: "user",
          content: `${profileContext} ${recentWorkoutContext}\n\nWhat they need right now: "${message}"`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content");

  return copilotResponseSchema.parse(JSON.parse(content));
}
