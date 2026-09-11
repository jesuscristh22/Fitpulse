import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import type { UserRole } from "@/lib/types";

async function requireSuperAdmin(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const userDoc = await adminDb().collection("users").doc(decoded.uid).get();
  const roles = (userDoc.data()?.roles as UserRole[]) ?? [];
  if (!roles.includes("super_admin")) throw new Error("forbidden");
}

interface PaymentRecord {
  id: string;
  uid: string;
  product: "military_ai_workout" | "member_pro";
  amountTotal: number | null;
  currency: string | null;
  renewal?: boolean;
  purchasedAt: string;
}

// Merges both purchase collections into one chronological feed, plus a
// simple revenue summary. Amounts are in the smallest currency unit (cents)
// as Stripe reports them — divided by 100 for display.
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    await requireSuperAdmin(idToken);

    const db = adminDb();
    const [militarySnap, memberProSnap] = await Promise.all([
      db.collection("military_purchases").orderBy("purchasedAt", "desc").limit(200).get(),
      db.collection("member_pro_purchases").orderBy("purchasedAt", "desc").limit(200).get(),
    ]);

    const payments: PaymentRecord[] = [
      ...militarySnap.docs.map((d) => ({ id: d.id, product: "military_ai_workout" as const, ...(d.data() as Omit<PaymentRecord, "id" | "product">) })),
      ...memberProSnap.docs.map((d) => ({ id: d.id, product: "member_pro" as const, ...(d.data() as Omit<PaymentRecord, "id" | "product">) })),
    ].sort((a, b) => (a.purchasedAt < b.purchasedAt ? 1 : -1));

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Revenue is summed per currency — never add EUR to USD to BRL as if
    // they were the same unit.
    const revenueByCurrency: Record<string, { allTime: number; thisMonth: number }> = {};
    for (const p of payments) {
      if (!p.amountTotal || !p.currency) continue;
      const key = p.currency.toUpperCase();
      if (!revenueByCurrency[key]) revenueByCurrency[key] = { allTime: 0, thisMonth: 0 };
      revenueByCurrency[key].allTime += p.amountTotal;
      if (p.purchasedAt >= startOfMonth) revenueByCurrency[key].thisMonth += p.amountTotal;
    }

    return NextResponse.json({ payments: payments.slice(0, 100), revenueByCurrency });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/payments]", error);
    return NextResponse.json({ error: "Failed to load payments" }, { status: 500 });
  }
}
