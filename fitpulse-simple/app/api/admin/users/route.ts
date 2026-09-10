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

// Simple listing (latest 50, no search yet) — enough for early-stage
// moderation without building a full search index.
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    await requireSuperAdmin(idToken);

    const snapshot = await adminDb().collection("users").limit(50).get();
    const users = snapshot.docs.map((d) => ({
      id: d.id,
      email: d.data().email ?? "",
      displayName: d.data().displayName ?? "",
      roles: (d.data().roles as UserRole[]) ?? ["member"],
      militaryAiSubscriptionStatus: d.data().militaryAiSubscriptionStatus ?? null,
      memberProSubscriptionStatus: d.data().memberProSubscriptionStatus ?? null,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/users]", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
