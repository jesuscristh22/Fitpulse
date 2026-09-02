import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getStripe } from "@/lib/stripe-server";

// Stripe webhooks require the RAW request body for signature verification —
// never JSON.parse() before calling constructEvent, or the signature check
// will always fail.
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "[CONFIGURATION REQUIRED] STRIPE_WEBHOOK_SECRET is not set." }, { status: 501 });
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe webhook] signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency guard (§31, §71): Stripe can and does deliver the same event
  // more than once. This doc's existence is the single source of truth for
  // "have we already granted this credit" — checked and written before any
  // credit is granted, so retries and duplicate deliveries are always safe.
  const eventRef = adminDb().collection("stripe_webhook_events").doc(event.id);
  const alreadyProcessed = await eventRef.get();
  if (alreadyProcessed.exists) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  await eventRef.set({ type: event.type, processedAt: new Date().toISOString() });

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as { client_reference_id?: string | null; metadata?: Record<string, string> | null };
      const uid = session.client_reference_id ?? session.metadata?.uid;

      if (uid) {
        await adminDb()
          .collection("users")
          .doc(uid)
          .set({ militaryAiCredits: FieldValue.increment(1) }, { merge: true });

        await adminDb().collection("military_purchases").add({
          uid,
          stripeEventId: event.id,
          purchasedAt: new Date().toISOString(),
        });
      } else {
        console.error("[stripe webhook] checkout.session.completed with no uid", event.id);
      }
    }
    // Other event types (subscriptions, invoices) will be handled starting
    // Phase 13 (Member Pro) — intentionally not handled yet.
  } catch (error) {
    console.error("[stripe webhook] processing failed:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
