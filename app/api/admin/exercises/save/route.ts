import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { isLocaleSlug } from "@/lib/locales-config";
import type { UserRole } from "@/lib/types";
import type { Exercise } from "@/lib/workouts";

async function requireSuperAdmin(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const userDoc = await adminDb().collection("users").doc(decoded.uid).get();
  const roles = (userDoc.data()?.roles as UserRole[]) ?? [];
  if (!roles.includes("super_admin")) {
    throw new Error("forbidden");
  }
}

// Saves an exercise (new or edited) as a Firestore override/addition for the
// given locale. Works the same whether the slug originally came from the
// hand-written seed library or was AI-discovered — this is what makes an
// edited exercise "stick" going forward (see getExercises' override logic).
export async function POST(request: Request) {
  try {
    const { idToken, locale, exercise } = await request.json();
    if (!idToken || !isLocaleSlug(locale) || !exercise?.slug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await requireSuperAdmin(idToken);

    const docId = `${locale}-${exercise.slug}`;
    await adminDb()
      .collection("exercises")
      .doc(docId)
      .set({ ...(exercise as Exercise), locale, source: "admin_edited", updatedAt: new Date().toISOString() }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/exercises/save]", error);
    return NextResponse.json({ error: "Failed to save exercise" }, { status: 500 });
  }
}
