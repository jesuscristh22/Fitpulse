"use client";

import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb } from "./firebase-client";
import { useAuth } from "./auth-context";
import type { WorkoutSession } from "./workout-sessions";

export async function saveWorkoutSession(userId: string, session: Omit<WorkoutSession, "id" | "userId">) {
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, "workout_sessions"), {
    ...session,
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// How many workout sessions the signed-in user completed since the start of
// the current week (Monday) — powers the dashboard's weekly consistency card
// (Phase 5) with real data instead of a hardcoded 0.
// Filtering happens client-side (not a Firestore range query) specifically to
// avoid needing another composite index — session counts per user are small.
export function useWeeklyCompletedCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCount(0);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "workout_sessions"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const now = new Date();
        const dayIndex = (now.getDay() + 6) % 7; // Monday = 0
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - dayIndex);

        let weekCount = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.completedAt && new Date(data.completedAt) >= startOfWeek) weekCount++;
        });
        setCount(weekCount);
        setLoading(false);
      },
      (err) => {
        console.error("[useWeeklyCompletedCount] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { count, loading };
}
