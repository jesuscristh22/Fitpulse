"use client";

import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb } from "./firebase-client";
import { useAuth } from "./auth-context";
import { stripUndefined } from "./firestore-utils";
import type { WorkoutSession } from "./workout-sessions";

export async function saveWorkoutSession(userId: string, session: Omit<WorkoutSession, "id" | "userId">) {
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, "workout_sessions"), {
    ...stripUndefined(session),
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

const WEEKDAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

// This week's completed sessions, keyed by weekday ("mon".."sun") — powers
// the training calendar's "done" markers. Same client-side filtering
// approach as useWeeklyCompletedCount, for the same index-avoidance reason.
export function useWeeklySessionsByDay() {
  const { user } = useAuth();
  const [byDay, setByDay] = useState<Record<string, WorkoutSession[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setByDay({});
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "workout_sessions"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const now = new Date();
        const dayIndex = (now.getDay() + 6) % 7;
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - dayIndex);

        const grouped: Record<string, WorkoutSession[]> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Omit<WorkoutSession, "id">;
          if (!data.completedAt) return;
          const completed = new Date(data.completedAt);
          if (completed < startOfWeek) return;
          const key = WEEKDAY_KEYS[(completed.getDay() + 6) % 7];
          grouped[key] = [...(grouped[key] ?? []), { id: docSnap.id, ...data }];
        });
        setByDay(grouped);
        setLoading(false);
      },
      (err) => {
        console.error("[useWeeklySessionsByDay] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { byDay, loading };
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
