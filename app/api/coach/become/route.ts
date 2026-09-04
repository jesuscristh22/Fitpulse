import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { setUserRoleClaims } from "@/lib/firebase-claims";
import type { UserRole } from "@/lib/types";

// No manual approval yet — anyone can become a coach for now (Diego's
// explicit call). Verification/approval can be layered in later without
// changing this route's shape (just gate on verificationStatus elsewhere).
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userRef = adminDb().collection("users").doc(uid);
    const userDoc = await userRef.get();
    const currentRoles = (userDoc.data()?.roles as UserRole[]) ?? ["member"];
    const nextRoles = currentRoles.includes("coach") ? currentRoles : [...currentRoles, "coach"];

    await userRef.set({ roles: nextRoles }, { merge: true });
    await setUserRoleClaims(uid, nextRoles);

    const profileRef = adminDb().collection("coach_profiles").doc(uid);
    const profileDoc = await profileRef.get();
    if (!profileDoc.exists) {
      await profileRef.set({
        userId: uid,
        displayName: userDoc.data()?.displayName ?? "",
        bio: "",
        specialties: [],
        languages: [],
        online: true,
        inPerson: false,
        verificationStatus: "unverified",
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/coach/become]", error);
    return NextResponse.json({ error: "Failed to become a coach" }, { status: 500 });
  }
}
