import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { setUserRoleClaims } from "@/lib/firebase-claims";
import type { UserRole } from "@/lib/types";

// No manual approval yet, same call as Coach (Phase 15) — anyone can create
// a gym profile and become its owner for now.
export async function POST(request: Request) {
  try {
    const { idToken, name } = await request.json();
    if (!idToken || !name?.trim()) {
      return NextResponse.json({ error: "Missing idToken or name" }, { status: 400 });
    }

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userRef = adminDb().collection("users").doc(uid);
    const userDoc = await userRef.get();
    const currentRoles = (userDoc.data()?.roles as UserRole[]) ?? ["member"];
    const nextRoles: UserRole[] = currentRoles.includes("gym_owner") ? currentRoles : [...currentRoles, "gym_owner"];

    await userRef.set({ roles: nextRoles }, { merge: true });
    await setUserRoleClaims(uid, nextRoles);

    const gymRef = adminDb().collection("gym_profiles").doc();
    await gymRef.set({
      id: gymRef.id,
      ownerId: uid,
      name: name.trim(),
      description: "",
      amenities: [],
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, gymId: gymRef.id });
  } catch (error) {
    console.error("[/api/gym/create]", error);
    return NextResponse.json({ error: "Failed to create gym" }, { status: 500 });
  }
}
