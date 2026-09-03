import "server-only";
import { militaryProgramSchema } from "./validation";
import type { z } from "zod";
import type { MilitaryIntake } from "./military-intake-client";

type MilitaryProgram = z.infer<typeof militaryProgramSchema>;

const FOCUS_DESCRIPTIONS: Record<MilitaryIntake["focus"], string> = {
  selection_prep: "preparing for a military-style selection process (needs high work capacity and mental toughness)",
  endurance: "building muscular and cardiovascular endurance",
  strength: "building functional bodyweight strength",
  general_conditioning: "general military-inspired conditioning",
};

// Calls OpenAI to generate a structured Military Calisthenics program from
// the person's questionnaire answers. Bodyweight/calisthenics only — this
// module never requires equipment. Output is validated against
// militaryProgramSchema before it's trusted anywhere else in the app.
export async function generateMilitaryProgram(intake: MilitaryIntake): Promise<MilitaryProgram> {
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
            "conditioning. This is NOT an official military program and must never be presented as one. " +
            "Use bodyweight/calisthenics exercises only (no equipment). Never diagnose injuries or " +
            "prescribe medical treatment. If the person's stated limitations suggest something serious, " +
            "keep the program conservative and add a note in the `goal` field recommending they consult " +
            "a doctor before starting. Respond ONLY with a JSON object matching exactly this shape: " +
            '{ "programName": string, "durationWeeks": number, "daysPerWeek": number, ' +
            '"estimatedDuration": number (minutes per session), "difficulty": "beginner"|"intermediate"|"advanced", ' +
            '"goal": string, "sessions": [{ "day": number, "exercises": [{ "name": string, "sets": number, ' +
            '"reps": string, "restSeconds": number }] }] }. Create exactly `daysPerWeek` sessions ' +
            "representing one training week (the person repeats this week for the program's duration).",
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
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content");

  const parsed = JSON.parse(content);
  return militaryProgramSchema.parse(parsed); // throws if the shape doesn't match — never trust free text
}
