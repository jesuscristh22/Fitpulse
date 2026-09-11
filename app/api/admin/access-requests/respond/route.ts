import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { setUserRoleClaims } from "@/lib/firebase-claims";
import type { UserRole } from "@/lib/types";

async function requireSuperAdmin(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const userDoc = await adminDb().collection("users").doc(decoded.uid).get();
  const roles = (userDoc.data()?.roles as UserRole[]) ?? [];
  if (!roles.includes("super_admin")) throw new Error("forbidden");
}

export async function POST(request: Request) {
  try {
    const { idToken, targetUserId, approve } = await request.json();
    if (!idToken || !targetUserId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    await requireSuperAdmin(idToken);

    await adminDb().collection("admin_access_requests").doc(targetUserId).set(
      { status: approve ? "approved" : "denied", respondedAt: new Date().toISOString() },
      { merge: true },
    );

    if (approve) {
      const userRef = adminDb().collection("users").doc(targetUserId);
      const userDoc = await userRef.get();
      const currentRoles = (userDoc.data()?.roles as UserRole[]) ?? ["member"];
      const nextRoles: UserRole[] = currentRoles.includes("super_admin") ? currentRoles : [...currentRoles, "super_admin"];
      await userRef.set({ roles: nextRoles }, { merge: true });
      await setUserRoleClaims(targetUserId, nextRoles);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/access-requests/respond]", error);
    return NextResponse.json({ error: "Failed to respond" }, { status: 500 });
  }
}
