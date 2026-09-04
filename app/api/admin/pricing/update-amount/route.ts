import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getStripe } from "@/lib/stripe-server";
import { resolvePriceId, getPricingConfig, savePricingConfig } from "@/lib/stripe-pricing";
import type { UserRole, SupportedCountry } from "@/lib/types";

async function requireSuperAdmin(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const userDoc = await adminDb().collection("users").doc(decoded.uid).get();
  const roles = (userDoc.data()?.roles as UserRole[]) ?? [];
  if (!roles.includes("super_admin")) {
    throw new Error("forbidden");
  }
}

// Creates a REAL new Stripe Price under the same Product as whatever price is
// currently active for this product+country, archives the old price (Stripe
// prices are immutable — you can never edit an existing price's amount, only
// replace it), and saves the new price id into our Firestore pricing config.
// This is what actually changes what a customer pays; the plain "paste a
// price_id" field in the admin panel only re-points to a price that already
// exists, it doesn't create or edit anything in Stripe itself.
export async function POST(request: Request) {
  try {
    const { idToken, product, country, amount } = await request.json();
    if (!idToken || !product || !country || typeof amount !== "number") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await requireSuperAdmin(idToken);

    const stripe = getStripe();
    const currentPriceId = await resolvePriceId(product, country as SupportedCountry);
    const currentPrice = await stripe.prices.retrieve(currentPriceId);

    if (!currentPrice.product || typeof currentPrice.product !== "string") {
      throw new Error("Could not resolve the Stripe Product for this price");
    }

    const newPrice = await stripe.prices.create({
      product: currentPrice.product,
      currency: currentPrice.currency,
      unit_amount: Math.round(amount * 100), // amount arrives as a major-unit number (e.g. 39.90)
      recurring: currentPrice.recurring ? { interval: currentPrice.recurring.interval } : undefined,
    });

    // Archive (not delete — Stripe doesn't allow deleting prices that have
    // ever been used) the old price so it stops showing up as selectable.
    await stripe.prices.update(currentPriceId, { active: false });

    const config = await getPricingConfig();
    config[product as "military" | "memberPro"] = {
      ...config[product as "military" | "memberPro"],
      [country]: newPrice.id,
    };
    await savePricingConfig(config);

    return NextResponse.json({ ok: true, newPriceId: newPrice.id, currency: newPrice.currency, unitAmount: newPrice.unit_amount });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("[/api/admin/pricing/update-amount]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed: ${message}` }, { status: 500 });
  }
}
