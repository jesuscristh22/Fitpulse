import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// Anyone signed in can request admin access — no role required to ask, only
// to approve. One pending request per person at a time (re-requesting just
// updates the existing doc rather than piling up duplicates).
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const userDoc = await adminDb().collection("users").doc(uid).get();

    await adminDb().collection("admin_access_requests").doc(uid).set(
      {
        uid,
        email: decoded.email ?? userDoc.data()?.email ?? "",
        displayName: userDoc.data()?.displayName ?? "",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/admin/request-access]", error);
    return NextResponse.json({ error: "Failed to request access" }, { status: 500 });
  }
}
