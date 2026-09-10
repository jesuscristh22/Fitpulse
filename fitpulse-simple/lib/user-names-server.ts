import "server-only";
import { adminDb } from "./firebase-admin";

// Resolves display names for a batch of uids via Admin SDK — needed
// wherever one person (a coach, a gym owner) needs to see another person's
// name, since Firestore rules correctly block reading someone else's
// `users/{uid}` doc directly from the client.
export async function resolveDisplayNames(uids: string[]): Promise<Record<string, string>> {
  const uniqueIds = Array.from(new Set(uids));
  const results: Record<string, string> = {};

  await Promise.all(
    uniqueIds.map(async (uid) => {
      try {
        const doc = await adminDb().collection("users").doc(uid).get();
        results[uid] = doc.data()?.displayName || doc.data()?.email || uid.slice(0, 8);
      } catch (error) {
        console.error(`[resolveDisplayNames] failed for ${uid}:`, error);
        results[uid] = uid.slice(0, 8);
      }
    }),
  );

  return results;
}
