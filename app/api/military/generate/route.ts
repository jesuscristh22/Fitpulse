import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateMilitaryProgram } from "@/lib/military-ai-server";
import { getExercises } from "@/lib/exercise-server";
import { matchExerciseByName } from "@/lib/exercise-name-match";
import { searchYouTubeVideoId } from "@/lib/youtube-api";
import { militaryIntakeSchema } from "@/lib/validation";
import { isLocaleSlug } from "@/lib/locales-config";
import type { Exercise } from "@/lib/workouts";
import type { LocaleSlug } from "@/lib/locales-config";

// NOTE: the 24h regeneration cooldown below is temporarily disabled for
// testing. Restore it (uncomment the block further down) before real users
// hit this endpoint.

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Auto-adds an exercise the AI named but that isn't in our library yet —
// using the description/instructions/muscles the SAME generation call
// already produced (no second OpenAI call needed), plus a best-effort real
// video found via the YouTube Data API. Idempotent: if this slug+locale was
// already discovered before (e.g. by an earlier generation), reuses it
// instead of overwriting/re-searching.
async function discoverAndSaveExercise(
  aiExercise: { name: string; description: string; instructions: string[]; muscles: string[] },
  locale: LocaleSlug,
): Promise<Exercise> {
  const slug = slugify(aiExercise.name);
  const ref = adminDb().collection("exercises").doc(`${locale}-${slug}`);
  const existing = await ref.get();
  if (existing.exists) return existing.data() as Exercise;

  const videoId = await searchYouTubeVideoId(`${aiExercise.name} how to do proper form tutorial`);

  const exercise: Exercise = {
    id: `${locale}-${slug}`,
    slug,
    name: aiExercise.name,
    description: aiExercise.description,
    instructions: aiExercise.instructions,
    muscles: aiExercise.muscles,
    equipment: ["no_equipment"],
    difficulty: "intermediate",
    category: "military",
    ...(videoId ? { videoId } : {}),
  };

  await ref.set({ ...exercise, locale, source: "ai_discovered", discoveredAt: new Date().toISOString() });
  return exercise;
}

export async function POST(request: Request) {
  try {
    const { idToken, locale } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }
    if (!isLocaleSlug(locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // Gate on subscription status — set by the Stripe webhook (Phase 10),
    // never trusted from anything the client sends directly.
    const userDoc = await adminDb().collection("users").doc(uid).get();
    const status = userDoc.data()?.militaryAiSubscriptionStatus;
    if (status !== "active" && status !== "trialing") {
      return NextResponse.json({ error: "no_active_subscription" }, { status: 403 });
    }

    const intakeDoc = await adminDb().collection("military_intake").doc(uid).get();
    if (!intakeDoc.exists) {
      return NextResponse.json({ error: "no_questionnaire" }, { status: 400 });
    }
    const intake = militaryIntakeSchema.parse(intakeDoc.data());

    const programRef = adminDb().collection("military_programs").doc(uid);
    // const existing = await programRef.get();
    // if (existing.exists) {
    //   const generatedAt = existing.data()?.generatedAt as string | undefined;
    //   if (generatedAt && Date.now() - new Date(generatedAt).getTime() < 24 * 60 * 60 * 1000) {
    //     return NextResponse.json({ program: existing.data(), cached: true });
    //   }
    // }

    const program = await generateMilitaryProgram(intake, locale);

    // Every exercise ends up linking to a real internal page: match against
    // our library first; anything unmatched gets auto-discovered and saved
    // (using the AI's own description/instructions) so it has one too.
    const libraryExercises = await getExercises(locale);
    const resolvedSessions = [];
    for (const session of program.sessions) {
      const resolvedExercises = [];
      for (const ex of session.exercises) {
        const match = matchExerciseByName(ex.name, libraryExercises);
        if (match) {
          resolvedExercises.push({ ...ex, slug: match.slug });
        } else {
          const saved = await discoverAndSaveExercise(ex, locale);
          resolvedExercises.push({ ...ex, slug: saved.slug });
        }
      }
      resolvedSessions.push({ ...session, exercises: resolvedExercises });
    }

    const generatedAt = new Date().toISOString();
    const resolvedProgram = { ...program, sessions: resolvedSessions, generatedAt, locale };
    await programRef.set(resolvedProgram);

    // AI usage tracking (§39) — never store sensitive content, just enough
    // to understand usage and cost over time.
    await adminDb().collection("ai_usage").add({
      userId: uid,
      feature: "military_generator",
      model: "gpt-4o-mini",
      timestamp: generatedAt,
    });

    return NextResponse.json({ program: resolvedProgram });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid_data", issues: error.issues }, { status: 400 });
    }
    console.error("[/api/military/generate]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `generation_failed: ${message}` }, { status: 500 });
  }
}
