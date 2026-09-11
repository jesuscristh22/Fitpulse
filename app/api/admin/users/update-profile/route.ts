import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import type { UserRole } from "@/lib/types";

async function requireSuperAdmin(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const userDoc = await adminDb().collection("users").doc(decoded.uid).get();
  const roles = (userDoc.data()?.roles as UserRole[]) ?? [];
  if (!roles.includes("super_admin")) throw new Error("forbidden");
  return decoded.uid;
}

export async function POST(request: Request) {
  try {
    const { idToken, targetUserId, displayName } = await request.json();
    if (!idToken || !targetUserId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const actingUid = await requireSuperAdmin(idToken);

    await adminDb().collection("users").doc(targetUserId).set({ displayName }, { merge: true });
    await adminDb().collection("admin_audit_log").add({
      actorUid: actingUid, action: "edit_user_profile", targetUserId, displayName, timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/users/update-profile]", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
