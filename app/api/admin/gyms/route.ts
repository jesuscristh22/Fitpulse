import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import type { UserRole } from "@/lib/types";

async function requireSuperAdmin(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const userDoc = await adminDb().collection("users").doc(decoded.uid).get();
  const roles = (userDoc.data()?.roles as UserRole[]) ?? [];
  if (!roles.includes("super_admin")) throw new Error("forbidden");
}

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    await requireSuperAdmin(idToken);

    const db = adminDb();
    const gymsSnap = await db.collection("gym_profiles").get();

    const gyms = await Promise.all(
      gymsSnap.docs.map(async (doc) => {
        const gym = doc.data();
        const [membersSnap, staffSnap] = await Promise.all([
          db.collection("gym_memberships").where("gymId", "==", gym.id).count().get(),
          db.collection("gym_staff").where("gymId", "==", gym.id).count().get(),
        ]);
        return {
          ...gym,
          memberCount: membersSnap.data().count,
          staffCount: staffSnap.data().count,
        };
      }),
    );

    return NextResponse.json({ gyms });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/gyms]", error);
    return NextResponse.json({ error: "Failed to load gyms" }, { status: 500 });
  }
}
