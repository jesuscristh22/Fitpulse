import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { setUserRoleClaims } from "@/lib/firebase-claims";
import type { UserRole } from "@/lib/types";

// [CONFIGURATION REQUIRED] The one fixed platform owner — only this exact
// account can self-grant super_admin. Everyone else must go through the
// request/approve flow (see /api/admin/request-access).
const OWNER_EMAIL = "jesuscristh22@gmail.com";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth().verifyIdToken(idToken);
    if (decoded.email?.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "not_owner" }, { status: 403 });
    }

    const uid = decoded.uid;
    const userRef = adminDb().collection("users").doc(uid);
    const userDoc = await userRef.get();
    const currentRoles = (userDoc.data()?.roles as UserRole[]) ?? ["member"];
    const nextRoles: UserRole[] = currentRoles.includes("super_admin") ? currentRoles : [...currentRoles, "super_admin"];

    await userRef.set({ roles: nextRoles }, { merge: true });
    await setUserRoleClaims(uid, nextRoles);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/admin/bootstrap]", error);
    return NextResponse.json({ error: "Failed to bootstrap" }, { status: 500 });
  }
}
