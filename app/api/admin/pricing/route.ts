import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getPricingConfig, savePricingConfig, type PricingConfig } from "@/lib/stripe-pricing";
import type { UserRole } from "@/lib/types";

async function requireSuperAdmin(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const userDoc = await adminDb().collection("users").doc(decoded.uid).get();
  const roles = (userDoc.data()?.roles as UserRole[]) ?? [];
  if (!roles.includes("super_admin")) {
    throw new Error("forbidden");
  }
}

export async function POST(request: Request) {
  try {
    const { idToken, action, config } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    await requireSuperAdmin(idToken);

    if (action === "save") {
      await savePricingConfig(config as PricingConfig);
      return NextResponse.json({ ok: true });
    }

    const current = await getPricingConfig();
    return NextResponse.json({ config: current });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/pricing]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
