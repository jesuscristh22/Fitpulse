import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getExercises } from "@/lib/exercise-server";
import { isLocaleSlug } from "@/lib/locales-config";
import type { UserRole } from "@/lib/types";

async function requireSuperAdmin(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const userDoc = await adminDb().collection("users").doc(decoded.uid).get();
  const roles = (userDoc.data()?.roles as UserRole[]) ?? [];
  if (!roles.includes("super_admin")) {
    throw new Error("forbidden");
  }
}

// Lists the merged library (seed + Firestore overrides/additions) for the
// requested locale — the same view the public site would show.
export async function POST(request: Request) {
  try {
    const { idToken, locale } = await request.json();
    if (!idToken || !isLocaleSlug(locale)) {
      return NextResponse.json({ error: "Missing idToken or invalid locale" }, { status: 400 });
    }
    await requireSuperAdmin(idToken);

    const exercises = await getExercises(locale);
    return NextResponse.json({ exercises });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/exercises]", error);
    return NextResponse.json({ error: "Failed to load exercises" }, { status: 500 });
  }
}
