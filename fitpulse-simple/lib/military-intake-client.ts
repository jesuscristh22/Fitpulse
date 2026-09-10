"use client";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./firebase-client";
import { stripUndefined } from "./firestore-utils";
import type { militaryIntakeSchema } from "./validation";
import type { z } from "zod";

export type MilitaryIntake = z.infer<typeof militaryIntakeSchema>;

// One doc per user (overwritten if they redo the questionnaire before
// checkout exists). Payment + AI generation are Phase 10/11 — this just
// captures the answers so that work has something to build on.
export async function saveMilitaryIntake(uid: string, intake: MilitaryIntake) {
  const db = getFirebaseDb();
  await setDoc(doc(db, "military_intake", uid), {
    ...stripUndefined(intake),
    updatedAt: serverTimestamp(),
  });
}
