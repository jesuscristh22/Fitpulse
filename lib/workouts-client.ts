"use client";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb } from "./firebase-client";
import { useAuth } from "./auth-context";
import type { Workout } from "./workouts";

export async function saveWorkout(ownerId: string, workout: Omit<Workout, "id" | "ownerId" | "createdAt">) {
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, "workouts"), {
    ...workout,
    ownerId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteWorkout(workoutId: string) {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "workouts", workoutId));
}

// Live list of the signed-in user's own workouts ("My Workouts", §24).
// Scoped by Firestore Security Rules (ownerId == auth.uid) — this query
// mirrors that with a `where` clause so it only ever asks for what's allowed.
export function useMyWorkouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "workouts"), where("ownerId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setWorkouts(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Workout, "id">) })));
        setLoading(false);
      },
      (error) => {
        console.error("[useMyWorkouts] listener failed:", error);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { workouts, loading };
}
