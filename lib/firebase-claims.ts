import "server-only";
import type { UserRole } from "./types";
import { adminAuth } from "./firebase-admin";

// Sets Firebase Custom Claims so Firestore Security Rules and server checks
// can trust roles without reading Firestore on every request.
export async function setUserRoleClaims(uid: string, roles: UserRole[]): Promise<void> {
  const claims = Object.fromEntries(roles.map((role) => [role, true]));
  await adminAuth().setCustomUserClaims(uid, claims);
}
