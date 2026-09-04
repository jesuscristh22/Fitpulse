import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getStripe } from "@/lib/stripe-server";
import { getMemberProPriceId } from "@/lib/stripe-pricing";
import { isLocaleSlug } from "@/lib/locales-config";
import type { SupportedCountry } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { idToken, locale } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }
    if (!isLocaleSlug(locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const decoded = await adminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userDoc = await adminDb().collection("users").doc(uid).get();
    const country = (userDoc.data()?.country as SupportedCountry | undefined) ?? "US";
    const priceId = getMemberProPriceId(country);

    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: uid,
      metadata: { uid, product: "member_pro" },
      subscription_data: { metadata: { uid, product: "member_pro" } },
      success_url: `${origin}/${locale}/planos/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/planos`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[/api/checkout/member-pro]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to create checkout session: ${message}` }, { status: 500 });
  }
}
