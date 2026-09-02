import "server-only";
import type { SupportedCountry } from "./types";

// [CONFIGURATION REQUIRED] — each of these must be a real Stripe Price ID
// (starts with "price_"), created in the Stripe Dashboard for the "Military
// AI Workout" one-time-purchase Product. Portugal and Spain share one EUR
// price per §73 (localized pricing table, not real-time currency conversion).
const PRICE_ENV_BY_COUNTRY: Record<SupportedCountry, string | undefined> = {
  BR: process.env.STRIPE_PRICE_MILITARY_BR,
  PT: process.env.STRIPE_PRICE_MILITARY_EU,
  ES: process.env.STRIPE_PRICE_MILITARY_EU,
  US: process.env.STRIPE_PRICE_MILITARY_US,
};

export function getMilitaryPriceId(country: SupportedCountry): string {
  const priceId = PRICE_ENV_BY_COUNTRY[country];
  if (!priceId) {
    throw new Error(`[CONFIGURATION REQUIRED] No Stripe price configured for country "${country}".`);
  }
  return priceId;
}
