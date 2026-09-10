import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { setUserRoleClaims } from "@/lib/firebase-claims";
import type { UserRole } from "@/lib/types";

// One-time bootstrap: if NO super_admin exists yet anywhere on the platform,
// the first person to call this becomes one. Once at least one super_admin
// exists, this always refuses — from then on, granting the role requires an
// existing super_admin using the admin panel's user management page.
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const existingAdmins = await adminDb().collection("users").where("roles", "array-contains", "super_admin").limit(1).get();
    if (!existingAdmins.empty) {
      return NextResponse.json({ error: "already_bootstrapped" }, { status: 403 });
    }

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
