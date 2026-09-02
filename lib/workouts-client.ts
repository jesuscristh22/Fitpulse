"use client";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb } from "./firebase-client";
import { useAuth } from "./auth-context";
import { stripUndefined } from "./firestore-utils";
import type { Workout } from "./workouts";

export async function saveWorkout(ownerId: string, workout: Omit<Workout, "id" | "ownerId" | "createdAt">) {
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, "workouts"), {
    ...stripUndefined(workout),
    ownerId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteWorkout(workoutId: string) {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "workouts", workoutId));
}

// Assigns/updates which weekdays a saved workout shows up on in the training
// calendar. Pass an empty array to unschedule it entirely.
export async function updateWorkoutSchedule(workoutId: string, scheduledDays: string[]) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "workouts", workoutId), { scheduledDays });
}

// Live list of the signed-in user's own workouts ("My Workouts", §24).
// Scoped by Firestore Security Rules (ownerId == auth.uid) — this query
// mirrors that with a `where` clause so it only ever asks for what's allowed.
// Sorting happens client-side (not via Firestore `orderBy`) specifically to
// avoid requiring a composite index in Firestore for this query.
export function useMyWorkouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "workouts"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Workout, "id">) }));
        list.sort((a, b) => (a.createdAt && b.createdAt ? (a.createdAt < b.createdAt ? 1 : -1) : 0));
        setWorkouts(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[useMyWorkouts] listener failed:", err);
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { workouts, loading, error };
}
