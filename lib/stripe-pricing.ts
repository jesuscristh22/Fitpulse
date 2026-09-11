import "server-only";
import { adminDb } from "./firebase-admin";
import type { SupportedCountry } from "./types";

// Portugal and Spain share one EUR price per §73 (localized pricing table,
// not real-time currency conversion).
const ENV_FALLBACK: Record<"military" | "memberPro", Record<SupportedCountry, string | undefined>> = {
  military: {
    BR: process.env.STRIPE_PRICE_MILITARY_BR,
    PT: process.env.STRIPE_PRICE_MILITARY_EU,
    ES: process.env.STRIPE_PRICE_MILITARY_EU,
    US: process.env.STRIPE_PRICE_MILITARY_US,
  },
  memberPro: {
    BR: process.env.STRIPE_PRICE_MEMBERPRO_BR,
    PT: process.env.STRIPE_PRICE_MEMBERPRO_EU,
    ES: process.env.STRIPE_PRICE_MEMBERPRO_EU,
    US: process.env.STRIPE_PRICE_MEMBERPRO_US,
  },
};

export interface PricingConfig {
  military: Partial<Record<SupportedCountry, string>>;
  memberPro: Partial<Record<SupportedCountry, string>>;
}

// Super Admin can override any of these at runtime from the admin panel
// (Phase 17) — stored in Firestore so a price change never requires a new
// deploy. Falls back to environment variables (the original Phase 10/13
// setup) whenever a given product+country isn't in the Firestore config yet,
// so nothing breaks for anyone who hasn't touched the admin panel.
export async function getPricingConfig(): Promise<PricingConfig> {
  try {
    const doc = await adminDb().collection("platform_config").doc("pricing").get();
    return (doc.data() as PricingConfig) ?? { military: {}, memberPro: {} };
  } catch (error) {
    console.error("[getPricingConfig] Firestore unavailable, using env fallback only:", error);
    return { military: {}, memberPro: {} };
  }
}

export async function savePricingConfig(config: PricingConfig) {
  await adminDb().collection("platform_config").doc("pricing").set(config, { merge: true });
}

const COUNTRY_FALLBACK_ORDER: SupportedCountry[] = ["US", "BR", "PT", "ES"];

export async function resolvePriceId(product: "military" | "memberPro", country: SupportedCountry): Promise<string> {
  const config = await getPricingConfig();

  const direct = config[product]?.[country] ?? ENV_FALLBACK[product][country];
  if (direct) return direct;

  // Nobody configured a price for this specific country (e.g. a friend
  // testing from a country you haven't set up pricing for yet, or someone
  // who skipped onboarding so their country defaulted to "US"). Rather than
  // hard-failing checkout for them, fall back to whichever price you HAVE
  // configured — they'll be charged in that currency instead of their own,
  // which is a much better outcome than checkout not working at all.
  for (const fallbackCountry of COUNTRY_FALLBACK_ORDER) {
    const fallback = config[product]?.[fallbackCountry] ?? ENV_FALLBACK[product][fallbackCountry];
    if (fallback) {
      console.warn(
        `[resolvePriceId] No ${product} price for "${country}" — falling back to "${fallbackCountry}"'s price.`,
      );
      return fallback;
    }
  }

  throw new Error(`[CONFIGURATION REQUIRED] No Stripe price configured for ${product} in any country yet.`);
}

export async function getMilitaryPriceId(country: SupportedCountry): Promise<string> {
  return resolvePriceId("military", country);
}

export async function getMemberProPriceId(country: SupportedCountry): Promise<string> {
  return resolvePriceId("memberPro", country);
}
