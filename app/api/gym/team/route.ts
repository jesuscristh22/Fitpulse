import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { resolveDisplayNames } from "@/lib/user-names-server";
import type { GymStaffRelationship, GymMembership } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const gymSnap = await adminDb().collection("gym_profiles").where("ownerId", "==", uid).limit(1).get();
    if (gymSnap.empty) {
      return NextResponse.json({ gym: null, staff: [], members: [] });
    }
    const gym = gymSnap.docs[0].data();
    const gymId = gym.id;

    const [staffSnap, membersSnap] = await Promise.all([
      adminDb().collection("gym_staff").where("gymId", "==", gymId).get(),
      adminDb().collection("gym_memberships").where("gymId", "==", gymId).get(),
    ]);

    const staffList = staffSnap.docs
      .map((d) => ({ id: d.id, ...(d.data() as GymStaffRelationship) }))
      .filter((s) => s.status !== "ended");
    const memberList = membersSnap.docs
      .map((d) => ({ id: d.id, ...(d.data() as GymMembership) }))
      .filter((m) => m.status !== "ended");

    const names = await resolveDisplayNames([
      ...staffList.map((s) => s.staffId),
      ...memberList.map((m) => m.memberId),
    ]);

    return NextResponse.json({
      gym,
      staff: staffList.map((s) => ({ ...s, staffName: names[s.staffId] })),
      members: memberList.map((m) => ({ ...m, memberName: names[m.memberId] })),
    });
  } catch (error) {
    console.error("[/api/gym/team]", error);
    return NextResponse.json({ error: "Failed to load team" }, { status: 500 });
  }
}
