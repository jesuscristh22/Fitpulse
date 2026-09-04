import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { setUserRoleClaims } from "@/lib/firebase-claims";
import type { UserRole } from "@/lib/types";

async function requireSuperAdmin(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const userDoc = await adminDb().collection("users").doc(decoded.uid).get();
  const roles = (userDoc.data()?.roles as UserRole[]) ?? [];
  if (!roles.includes("super_admin")) {
    throw new Error("forbidden");
  }
  return decoded.uid;
}

export async function POST(request: Request) {
  try {
    const { idToken, targetUserId, roles } = await request.json();
    if (!idToken || !targetUserId || !Array.isArray(roles)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const actingUid = await requireSuperAdmin(idToken);

    // Guardrail: a super_admin can't accidentally strip their OWN super_admin
    // role through this panel (avoids locking everyone out by mistake).
    if (targetUserId === actingUid && !roles.includes("super_admin")) {
      return NextResponse.json({ error: "cannot_remove_own_super_admin" }, { status: 400 });
    }

    await adminDb().collection("users").doc(targetUserId).set({ roles }, { merge: true });
    await setUserRoleClaims(targetUserId, roles as UserRole[]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/users/set-roles]", error);
    return NextResponse.json({ error: "Failed to update roles" }, { status: 500 });
  }
}
