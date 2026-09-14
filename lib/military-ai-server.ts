import "server-only";
import { militaryProgramSchema } from "./validation";
import type { z } from "zod";
import type { MilitaryIntake } from "./military-intake-client";
import type { LocaleSlug } from "./locales-config";

type MilitaryProgram = z.infer<typeof militaryProgramSchema>;

const FOCUS_DESCRIPTIONS: Record<MilitaryIntake["focus"], string> = {
  selection_prep: "preparing for a military-style selection process (needs high work capacity and mental toughness)",
  endurance: "building muscular and cardiovascular endurance",
  strength: "building functional strength and muscle",
  general_conditioning: "general military-inspired conditioning",
};

// Diego, Sept 2026: FitPulse Tactical now builds a real gym-style split
// routine (Treino A/B/C...) organized by muscle group per day — not a
// bodyweight-only circuit — unless the person has no gym/dumbbell access at
// all, in which case it falls back to a bodyweight split so the program
// still makes sense for them.
const EQUIPMENT_DESCRIPTIONS: Record<MilitaryIntake["equipment"], string> = {
  full_gym: "full commercial gym access (barbells, dumbbells, cable machines, resistance machines, benches, pull-up bars)",
  home_dumbbells: "a home setup with dumbbells and maybe a bench/pull-up bar, no barbell or machines",
  bodyweight_only: "no equipment at all — bodyweight/calisthenics only",
};

const LANGUAGE_NAME: Record<LocaleSlug, string> = {
  "pt-br": "Brazilian Portuguese",
  en: "English",
  es: "Spanish (Spain)",
};

// Calls OpenAI to generate a structured, gym-style split training program
// from the person's questionnaire answers. Exercise names are free text —
// NOT constrained to FitPulse's own exercise library — specifically so the
// program reflects real, current exercises used by personal trainers and
// strength coaches, rather than being capped at whatever we happen to have
// catalogued internally. Each exercise is matched to our library or
// auto-discovered server-side after this call returns.
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
            "You design FitPulse Tactical programs — serious strength & conditioning training with a " +
            "military-inspired mindset (discipline, structure, mental toughness), built like a real gym " +
            "program a personal trainer would write. This is NOT an official military program and must " +
            "never be presented as one. Never diagnose injuries or prescribe medical treatment. If the " +
            "person's stated limitations suggest something serious, keep the program conservative and add " +
            "a note in the `goal` field recommending they consult a doctor before starting.\n\n" +
            `Write every text field (programName, goal, splitLabel, and every exercise's name, description, ` +
            `and instructions) in ${LANGUAGE_NAME[locale]}. This is mandatory.\n\n` +
            "STRUCTURE — this is the most important part: build a real gym-style SPLIT ROUTINE, organizing " +
            "each training day around specific muscle groups, the way an actual gym-goer trains — NOT a " +
            "generic full-body bodyweight circuit repeated every day. Choose the split that best fits " +
            "`daysPerWeek`:\n" +
            "- 2-3 days/week: Upper/Lower split, or a Push/Pull/Legs split for 3 days.\n" +
            "- 4 days/week: Upper/Lower repeated twice, or Push/Pull/Legs/Upper.\n" +
            "- 5 days/week: a classic bro-split — e.g. Day A Chest+Triceps, Day B Back+Biceps, Day C Legs, " +
            "Day D Shoulders+Traps, Day E Arms+Core.\n" +
            "- 6 days/week: Push/Pull/Legs repeated twice.\n" +
            'Give each session a clear `splitLabel` like "Treino A — Peito, Ombro e Tríceps" (adapt the ' +
            "exact wording/language to the target language) so the person immediately knows what that " +
            "day trains. Never repeat the exact same muscle groups on two different days in the same week.\n\n" +
            `EQUIPMENT: the person has ${EQUIPMENT_DESCRIPTIONS[intake.equipment]}. Choose exercises that ` +
            "match this — real barbell/dumbbell/machine exercises for gym access (bench press, barbell " +
            "squat, lat pulldown, leg press, cable rows, dumbbell shoulder press, etc.), dumbbell-and-bodyweight " +
            "combinations for home setups, or bodyweight/calisthenics-only movements otherwise. Use your " +
            "knowledge of current, credible strength training — you are not limited to a fixed list.\n\n" +
            "Build each session to take approximately 45-60 minutes including rest, with realistic rest " +
            "periods for the exercise type (60-90s for compound barbell/machine lifts, 30-45s for " +
            "bodyweight/accessory work). Include 5 to 7 exercises per session with realistic set/rep ranges " +
            "for hypertrophy and strength (e.g. 3-4 sets of 8-12 reps for most exercises, lower reps for " +
            "heavy compound lifts).\n\n" +
            "Respond ONLY with a JSON object matching exactly this shape: " +
            '{ "programName": string, "durationWeeks": number, "daysPerWeek": number, ' +
            '"estimatedDuration": number (minutes, 30-60), "difficulty": "beginner"|"intermediate"|"advanced", ' +
            '"goal": string, "sessions": [{ "day": number, "splitLabel": string, "exercises": [{ "name": string, ' +
            '"description": string (one sentence explaining what the exercise trains), ' +
            '"instructions": string[] (2-4 short numbered steps on how to perform it correctly), ' +
            '"muscles": string[] (main muscles worked, lowercase single words like "chest", "triceps", "quads"), ' +
            '"sets": number, "reps": string, "restSeconds": number (0-120) }] }] }. Create exactly ' +
            "`daysPerWeek` sessions representing one training week (the person repeats this week for " +
            "the program's duration).",
        },
        {
          role: "user",
          content:
            `Experience level: ${intake.experience}. ` +
            `Focus: ${FOCUS_DESCRIPTIONS[intake.focus]}. ` +
            `Equipment access: ${EQUIPMENT_DESCRIPTIONS[intake.equipment]}. ` +
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
