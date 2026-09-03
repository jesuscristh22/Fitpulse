import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getStripe } from "@/lib/stripe-server";
import type Stripe from "stripe";

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

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe webhook] signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency guard (§31, §71): Stripe can and does deliver the same event
  // more than once. This doc's existence is the single source of truth for
  // "have we already processed this event" — checked and written before any
  // Firestore update happens, so retries and duplicate deliveries are safe.
  const eventRef = adminDb().collection("stripe_webhook_events").doc(event.id);
  const alreadyProcessed = await eventRef.get();
  if (alreadyProcessed.exists) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  await eventRef.set({ type: event.type, processedAt: new Date().toISOString() });

  try {
    // Military AI Workout is a recurring monthly subscription. Access is
    // gated on subscription status, not a one-time credit: activated here,
    // then kept in sync by the subscription lifecycle events below.
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.client_reference_id ?? session.metadata?.uid;

      if (uid) {
        await adminDb().collection("users").doc(uid).set(
          {
            militaryAiSubscriptionId: session.subscription ?? null,
            militaryAiSubscriptionStatus: "active",
          },
          { merge: true },
        );
        await adminDb().collection("military_purchases").add({
          uid,
          stripeEventId: event.id,
          subscriptionId: session.subscription ?? null,
          purchasedAt: new Date().toISOString(),
        });
      } else {
        console.error("[stripe webhook] checkout.session.completed with no uid", event.id);
      }
    }

    // Renewed, past due, canceled, etc. — keeps access in sync with the
    // subscription's real status for the rest of its lifecycle.
    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const uid = subscription.metadata?.uid;

      if (uid) {
        await adminDb().collection("users").doc(uid).set(
          {
            militaryAiSubscriptionId: subscription.id,
            militaryAiSubscriptionStatus: event.type === "customer.subscription.deleted" ? "canceled" : subscription.status,
          },
          { merge: true },
        );
      } else {
        console.error(`[stripe webhook] ${event.type} with no uid in metadata`, event.id);
      }
    }
    // Member Pro subscriptions (Phase 13) will be handled here too, once built.
  } catch (error) {
    console.error("[stripe webhook] processing failed:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
