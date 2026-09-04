import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateMilitaryProgram } from "@/lib/military-ai-server";
import { getExercises } from "@/lib/exercise-server";
import { matchExerciseByName } from "@/lib/exercise-name-match";
import { discoverAndSaveExercise } from "@/lib/exercise-discovery-server";
import { checkRateLimit } from "@/lib/rate-limit-server";
import { militaryIntakeSchema } from "@/lib/validation";
import { isLocaleSlug } from "@/lib/locales-config";

// NOTE: the 24h regeneration cooldown below is temporarily disabled for
// testing. Restore it (uncomment the block further down) before real users
// hit this endpoint.

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

    // Abuse/cost guardrail — generous on purpose (10/day) so it doesn't get
    // in the way of testing, unlike the old hard single-generation-per-24h
    // lock that used to live here.
    const rateLimit = await checkRateLimit(uid, "military_generate", 10, 24 * 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

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
          const saved = await discoverAndSaveExercise(ex, locale, "military", ["no_equipment"]);
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
