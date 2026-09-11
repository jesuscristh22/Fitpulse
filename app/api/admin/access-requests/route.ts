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

    const snapshot = await adminDb().collection("admin_access_requests").where("status", "==", "pending").get();
    const requests = snapshot.docs.map((d) => d.data());
    return NextResponse.json({ requests });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/access-requests]", error);
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 });
  }
}
