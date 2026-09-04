import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
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
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    await requireSuperAdmin(idToken);

    const db = adminDb();
    const [usersSnap, coachesSnap, gymsSnap, activeMilitarySnap, activeMemberProSnap] = await Promise.all([
      db.collection("users").count().get(),
      db.collection("coach_profiles").count().get(),
      db.collection("gym_profiles").count().get(),
      db.collection("users").where("militaryAiSubscriptionStatus", "==", "active").count().get(),
      db.collection("users").where("memberProSubscriptionStatus", "==", "active").count().get(),
    ]);

    return NextResponse.json({
      totalUsers: usersSnap.data().count,
      totalCoaches: coachesSnap.data().count,
      totalGyms: gymsSnap.data().count,
      activeMilitarySubs: activeMilitarySnap.data().count,
      activeMemberProSubs: activeMemberProSnap.data().count,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/stats]", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
