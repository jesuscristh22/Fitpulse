import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getStripe } from "@/lib/stripe-server";
import { getMilitaryPriceId } from "@/lib/stripe-pricing";
import type { SupportedCountry } from "@/lib/types";

// Creates a Stripe Checkout Session for the one-time "Military AI Workout"
// purchase (§29-30). The webhook (/api/webhooks/stripe) — not this route,
// and never the client's redirect back — is what actually grants the AI
// generation credit, since redirects can be spoofed but signed webhooks can't.
export async function POST(request: Request) {
  try {
    const { idToken, locale } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userDoc = await adminDb().collection("users").doc(uid).get();
    const country = (userDoc.data()?.country as SupportedCountry | undefined) ?? "US";
    const priceId = getMilitaryPriceId(country);

    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: uid,
      metadata: { uid, product: "military_ai_workout" },
      success_url: `${origin}/${locale}/militar/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/militar/questionario`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[/api/checkout/military]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to create checkout session: ${message}` }, { status: 500 });
  }
}
