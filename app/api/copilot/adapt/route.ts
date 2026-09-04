import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateCopilotAdaptation } from "@/lib/copilot-ai-server";
import { getExercises } from "@/lib/exercise-server";
import { matchExerciseByName } from "@/lib/exercise-name-match";
import { discoverAndSaveExercise } from "@/lib/exercise-discovery-server";
import { isLocaleSlug } from "@/lib/locales-config";
import type { FitnessProfile } from "@/lib/types";
import type { Workout } from "@/lib/workouts";

// Member Pro / Military Tactical perk (§34) — gated the same way as the
// exercise library (either active subscription counts).
export async function POST(request: Request) {
  try {
    const { idToken, locale, message } = await request.json();
    if (!idToken || !message?.trim()) {
      return NextResponse.json({ error: "Missing idToken or message" }, { status: 400 });
    }
    if (!isLocaleSlug(locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userDoc = await adminDb().collection("users").doc(uid).get();
    const isActive = (s?: string) => s === "active" || s === "trialing";
    const hasPaidAccess =
      isActive(userDoc.data()?.militaryAiSubscriptionStatus) || isActive(userDoc.data()?.memberProSubscriptionStatus);
    if (!hasPaidAccess) {
      return NextResponse.json({ error: "no_active_subscription" }, { status: 403 });
    }

    const fitnessDoc = await adminDb().collection("fitness_profiles").doc(uid).get();
    const fitness = fitnessDoc.exists ? (fitnessDoc.data() as FitnessProfile) : null;

    // Most recently created workout, if any, for light context (§35 "recent workouts").
    const recentSnap = await adminDb()
      .collection("workouts")
      .where("ownerId", "==", uid)
      .limit(10)
      .get();
    const recentWorkouts = recentSnap.docs.map((d) => d.data() as Workout);
    recentWorkouts.sort((a, b) => ((a.createdAt ?? "") < (b.createdAt ?? "") ? 1 : -1));
    const recentWorkout = recentWorkouts[0] ?? null;

    const adaptation = await generateCopilotAdaptation({ message, locale, fitness, recentWorkout });

    // Same library-first, auto-discover-otherwise resolution as the Military
    // generator, so every exercise ends up linking to a real how-to page.
    const libraryExercises = await getExercises(locale);
    const resolvedSets = [];
    for (const ex of adaptation.sets) {
      const match = matchExerciseByName(ex.name, libraryExercises);
      const slug = match ? match.slug : (await discoverAndSaveExercise(ex, locale, "strength", ["no_equipment"])).slug;
      resolvedSets.push({
        exerciseId: slug,
        exerciseName: ex.name,
        exerciseSlug: slug,
        setNumber: ex.setNumber,
        reps: ex.reps,
        weightKg: ex.weightKg,
        durationSeconds: ex.durationSeconds,
        restSeconds: ex.restSeconds,
      });
    }

    await adminDb().collection("ai_usage").add({
      userId: uid,
      feature: "member_copilot",
      model: "gpt-4o-mini",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      message: adaptation.message,
      workoutName: adaptation.workoutName,
      sets: resolvedSets,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid_data", issues: error.issues }, { status: 400 });
    }
    console.error("[/api/copilot/adapt]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `generation_failed: ${message}` }, { status: 500 });
  }
}
