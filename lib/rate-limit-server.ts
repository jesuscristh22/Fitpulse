import "server-only";
import { adminDb } from "./firebase-admin";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

// Simple sliding-window rate limiter backed by Firestore (no Redis needed at
// this scale). Used to bound worst-case OpenAI cost from a single account,
// not to police normal usage — limits are set generously on purpose.
export async function checkRateLimit(
  uid: string,
  feature: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const ref = adminDb().collection("rate_limits").doc(`${uid}_${feature}`);
  const now = Date.now();

  return adminDb().runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const data = doc.data() as { windowStart: number; count: number } | undefined;

    if (!data || now - data.windowStart > windowMs) {
      tx.set(ref, { windowStart: now, count: 1 });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (data.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    tx.update(ref, { count: data.count + 1 });
    return { allowed: true, remaining: maxRequests - data.count - 1 };
  });
}
