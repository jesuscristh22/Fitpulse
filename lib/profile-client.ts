"use client";

import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "./firebase-client";
import { stripUndefined } from "./firestore-utils";
import type { UserProfile, FitnessProfile } from "./types";

interface ProfileUpdate {
  displayName?: string;
  country?: string;
  locale?: string;
  profile: Partial<Omit<UserProfile, "userId">>;
  fitness: Partial<Omit<FitnessProfile, "userId">>;
}

// Direct client writes (governed by Firestore Security Rules: isSelf), same
// as the rest of the app's own-data collections. No admin round-trip needed
// here since nothing security-sensitive (roles, claims) is being touched.
export async function saveProfile(uid: string, update: ProfileUpdate) {
  const db = getFirebaseDb();

  const accountUpdate = stripUndefined({ displayName: update.displayName, country: update.country, locale: update.locale });
  if (Object.keys(accountUpdate).length > 0) {
    await setDoc(doc(db, "users", uid), accountUpdate, { merge: true });
  }
  await setDoc(doc(db, "user_profiles", uid), stripUndefined({ userId: uid, ...update.profile }), { merge: true });
  await setDoc(doc(db, "fitness_profiles", uid), stripUndefined({ userId: uid, ...update.fitness }), { merge: true });
}
