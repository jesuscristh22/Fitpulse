import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateMilitaryProgram } from "@/lib/military-ai-server";
import { getExercises } from "@/lib/exercise-server";
import { militaryIntakeSchema } from "@/lib/validation";
import { isLocaleSlug } from "@/lib/locales-config";

const REGENERATE_COOLDOWN_MS = 24 * 60 * 60 * 1000;

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

    // [TEMPORARILY DISABLED FOR TESTING — restore before real users hit this]
    // Rate limit (§40): serve the cached program instead of calling OpenAI
    // again if one was generated in the last 24h.
    const programRef = adminDb().collection("military_programs").doc(uid);
    const existing = await programRef.get();
    // if (existing.exists) {
    //   const generatedAt = existing.data()?.generatedAt as string | undefined;
    //   if (generatedAt && Date.now() - new Date(generatedAt).getTime() < REGENERATE_COOLDOWN_MS) {
    //     return NextResponse.json({ program: existing.data(), cached: true });
    //   }
    // }

    const program = await generateMilitaryProgram(intake, locale);

    // Denormalize each exercise's localized name (and confirm its slug is
    // real) so the program page never needs a second lookup to display it.
    const exercises = await getExercises(locale);
    const bySlug = new Map(exercises.map((e) => [e.slug, e]));
    const resolvedSessions = program.sessions.map((session) => ({
      ...session,
      exercises: session.exercises.map((ex) => ({
        ...ex,
        name: bySlug.get(ex.slug)?.name ?? ex.slug,
      })),
    }));

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
