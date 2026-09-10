"use client";

import { useEffect, useState } from "react";
import { collection, doc, setDoc, updateDoc, onSnapshot, query, where, arrayUnion } from "firebase/firestore";
import { getFirebaseDb } from "./firebase-client";
import { useAuth } from "./auth-context";
import type { ChallengeParticipant } from "./challenges";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// One participant doc per user+challenge, id = `${challengeSlug}_${uid}` so
// joining twice is naturally idempotent (no duplicate participation docs).
export async function joinChallenge(userId: string, challengeSlug: string) {
  const db = getFirebaseDb();
  const ref = doc(db, "challenge_participants", `${challengeSlug}_${userId}`);
  await setDoc(ref, { challengeId: challengeSlug, userId, joinedAt: new Date().toISOString(), checkinDates: [] }, { merge: true });
}

export async function checkIn(userId: string, challengeSlug: string) {
  const db = getFirebaseDb();
  const ref = doc(db, "challenge_participants", `${challengeSlug}_${userId}`);
  await updateDoc(ref, { checkinDates: arrayUnion(todayISO()) });
}

export function useMyChallengeParticipations() {
  const { user } = useAuth();
  const [participations, setParticipations] = useState<Record<string, ChallengeParticipant>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setParticipations({});
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "challenge_participants"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const map: Record<string, ChallengeParticipant> = {};
        snapshot.forEach((d) => {
          const data = d.data() as ChallengeParticipant;
          map[data.challengeId] = data;
        });
        setParticipations(map);
        setLoading(false);
      },
      (err) => {
        console.error("[useMyChallengeParticipations] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { participations, loading };
}

export { todayISO };
