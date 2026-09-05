import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { resolveDisplayNames } from "@/lib/user-names-server";
import type { CoachRelationship } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const snapshot = await adminDb().collection("coach_relationships").where("coachId", "==", uid).get();
    const relationships = snapshot.docs
      .map((d) => ({ id: d.id, ...(d.data() as CoachRelationship) }))
      .filter((r) => r.status !== "ended");

    const names = await resolveDisplayNames(relationships.map((r) => r.memberId));
    const clients = relationships.map((r) => ({ ...r, memberName: names[r.memberId] }));

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("[/api/coach/clients]", error);
    return NextResponse.json({ error: "Failed to load clients" }, { status: 500 });
  }
}
