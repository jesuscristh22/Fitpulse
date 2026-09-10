"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "./firebase-client";
import { useAuth } from "./auth-context";

export interface MilitaryProgramExercise {
  name: string;
  slug?: string; // present when the name matched something in our own library
  sets: number;
  reps: string;
  restSeconds: number;
}
export interface MilitaryProgramSession {
  day: number;
  exercises: MilitaryProgramExercise[];
}
export interface MilitaryProgram {
  programName: string;
  durationWeeks: number;
  daysPerWeek: number;
  estimatedDuration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  goal: string;
  sessions: MilitaryProgramSession[];
  generatedAt?: string;
}

export function useMilitaryProgram() {
  const { user } = useAuth();
  const [program, setProgram] = useState<MilitaryProgram | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgram(null);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const unsubProgram = onSnapshot(
      doc(db, "military_programs", user.uid),
      (snap) => setProgram(snap.exists() ? (snap.data() as MilitaryProgram) : null),
      (err) => console.error("[useMilitaryProgram] program listener failed:", err),
    );
    const unsubUser = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        setSubscriptionStatus((snap.data()?.militaryAiSubscriptionStatus as string) ?? null);
        setLoading(false);
      },
      (err) => console.error("[useMilitaryProgram] user listener failed:", err),
    );
    return () => {
      unsubProgram();
      unsubUser();
    };
  }, [user]);

  return { program, subscriptionStatus, loading };
}
