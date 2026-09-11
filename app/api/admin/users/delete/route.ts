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

// Destructive and irreversible: removes the Firebase Auth account plus the
// core Firestore documents tied to it. Doesn't attempt to sweep every
// subcollection across the whole app (workouts, sessions, etc.) — those
// become orphaned but harmless, since every read of them is already scoped
// to a signed-in uid that no longer exists.
export async function POST(request: Request) {
  try {
    const { idToken, targetUserId } = await request.json();
    if (!idToken || !targetUserId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const actingUid = await requireSuperAdmin(idToken);

    if (targetUserId === actingUid) {
      return NextResponse.json({ error: "cannot_delete_self" }, { status: 400 });
    }

    await adminAuth().deleteUser(targetUserId).catch((err) => {
      // Already gone from Auth (e.g. deleted twice) shouldn't block cleaning
      // up Firestore — anything else should surface.
      if (err?.code !== "auth/user-not-found") throw err;
    });

    const db = adminDb();
    await Promise.all([
      db.collection("users").doc(targetUserId).delete(),
      db.collection("user_profiles").doc(targetUserId).delete(),
      db.collection("fitness_profiles").doc(targetUserId).delete(),
    ]);

    await db.collection("admin_audit_log").add({
      actorUid: actingUid, action: "delete_user", targetUserId, timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/users/delete]", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
