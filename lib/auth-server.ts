import "server-only";
import type { UserRole } from "./types";
import { adminAuth, adminDb } from "./firebase-admin";
import { setUserRoleClaims } from "./firebase-claims";

// Called once, right after a client-side Firebase sign-up (email/password OR
// Google) succeeds. Verifies the ID token server-side (never trust a client-
// supplied uid directly), then creates the Firestore user doc and default
// Custom Claims ONLY if this is genuinely the first time we've seen this uid —
// so logging in again later never resets someone's roles.
export async function provisionUserFromIdToken(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const { uid, email, name, picture } = decoded;

  const userRef = adminDb().collection("users").doc(uid);
  const existing = await userRef.get();

  if (!existing.exists) {
    const defaultRoles: UserRole[] = ["member"];
    await userRef.set({
      id: uid,
      email: email ?? "",
      displayName: name ?? "",
      photoURL: picture ?? "",
      roles: defaultRoles,
      createdAt: new Date().toISOString(),
    });
    await setUserRoleClaims(uid, defaultRoles);
  }

  return { uid, isNewUser: !existing.exists };
}
