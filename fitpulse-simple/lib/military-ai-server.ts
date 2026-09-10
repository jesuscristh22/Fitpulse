import "server-only";
import { militaryProgramSchema } from "./validation";
import type { z } from "zod";
import type { MilitaryIntake } from "./military-intake-client";
import type { LocaleSlug } from "./locales-config";

type MilitaryProgram = z.infer<typeof militaryProgramSchema>;

const FOCUS_DESCRIPTIONS: Record<MilitaryIntake["focus"], string> = {
  selection_prep: "preparing for a military-style selection process (needs high work capacity and mental toughness)",
  endurance: "building muscular and cardiovascular endurance",
  strength: "building functional bodyweight strength",
  general_conditioning: "general military-inspired conditioning",
};

const LANGUAGE_NAME: Record<LocaleSlug, string> = {
  "pt-br": "Brazilian Portuguese",
  en: "English",
  es: "Spanish (Spain)",
};

// Calls OpenAI to generate a structured Military Calisthenics program from
// the person's questionnaire answers. Exercise names are free text — NOT
// constrained to FitPulse's own exercise library — specifically so the
// program reflects real, current calisthenics exercises used by military
// instructors, personal trainers, and PE teachers, rather than being capped
// at whatever we happen to have catalogued internally. Each exercise is
// paired with a YouTube search link (not an embedded video) so the person
// can find a real, current demonstration regardless of which exercise the
// AI picked.
export async function generateMilitaryProgram(
  intake: MilitaryIntake,
  locale: LocaleSlug,
): Promise<MilitaryProgram> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("[CONFIGURATION REQUIRED] OPENAI_API_KEY is not set.");
  }

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
            "You design FitPulse Tactical programs — general fitness inspired by military-style " +
            "conditioning, drawing on real bodyweight calisthenics exercises commonly taught by " +
            "military instructors, personal trainers, and PE teachers. This is NOT an official " +
            "military program and must never be presented as one. Never diagnose injuries or " +
            "prescribe medical treatment. If the person's stated limitations suggest something " +
            "serious, keep the program conservative and add a note in the `goal` field recommending " +
            "they consult a doctor before starting.\n\n" +
            `Write every text field (programName, goal, and every exercise's name, description, and ` +
            `instructions) in ${LANGUAGE_NAME[locale]}. This is mandatory.\n\n` +
            "Use real, well-known, currently-taught bodyweight/calisthenics exercises — the kind you'd " +
            "see in an actual military PT session or a professional trainer's bootcamp class (e.g. " +
            "push-ups, pull-ups, sit-ups, flutter kicks, squat thrusts, bear crawls, mountain climbers, " +
            "burpees, plank variations, lunges, sprints — and their many real variations). You are not " +
            "limited to any fixed list — use your knowledge of current, credible calisthenics training.\n\n" +
            "Build each session to take approximately 30 minutes total including rest, using rest " +
            "periods of at most 30 seconds between sets. To fill that time appropriately, include 5 to 8 " +
            "exercises per session (more for higher experience levels) with realistic set/rep ranges. " +
            "Vary the exercises across days within the week so the program doesn't repeat the same 2-3 " +
            "movements every session.\n\n" +
            "Respond ONLY with a JSON object matching exactly this shape: " +
            '{ "programName": string, "durationWeeks": number, "daysPerWeek": number, ' +
            '"estimatedDuration": number (minutes, 20-35), "difficulty": "beginner"|"intermediate"|"advanced", ' +
            '"goal": string, "sessions": [{ "day": number, "exercises": [{ "name": string, ' +
            '"description": string (one sentence explaining what the exercise trains), ' +
            '"instructions": string[] (2-4 short numbered steps on how to perform it correctly), ' +
            '"muscles": string[] (main muscles worked, lowercase single words like "core", "quads", "chest"), ' +
            '"sets": number, "reps": string, "restSeconds": number (0-30) }] }] }. Create exactly ' +
            "`daysPerWeek` sessions representing one training week (the person repeats this week for " +
            "the program's duration).",
        },
        {
          role: "user",
          content:
            `Experience level: ${intake.experience}. ` +
            `Focus: ${FOCUS_DESCRIPTIONS[intake.focus]}. ` +
            `Days per week: ${intake.daysPerWeek}. ` +
            `Program duration: ${intake.durationWeeks} weeks. ` +
            `Limitations/injuries reported: ${intake.limitations?.trim() || "none reported"}.`,
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

  const parsed = JSON.parse(content);
  return militaryProgramSchema.parse(parsed); // throws if the shape doesn't match — never trust free text blindly
}
