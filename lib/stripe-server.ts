import "server-only";
import Stripe from "stripe";

let stripeInstance: Stripe | undefined;

// Lazy singleton — same reasoning as lib/firebase-client.ts: never construct
// this at module load time, only when a route handler actually calls it.
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("[CONFIGURATION REQUIRED] STRIPE_SECRET_KEY is not set.");
    }
    stripeInstance = new Stripe(key, { apiVersion: "2024-06-20" });
  }
  return stripeInstance;
}
