"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "./firebase-client";
import { useAuth } from "./auth-context";
import type { FitnessProfile, UserProfile } from "./types";

interface UserData {
  account?: {
    displayName?: string;
    email?: string;
    country?: string;
    locale?: string;
    militaryAiSubscriptionStatus?: string;
    memberProSubscriptionStatus?: string;
  };
  profile?: UserProfile;
  fitness?: FitnessProfile;
}

// Reads the 3 docs the onboarding wizard writes (users, user_profiles,
// fitness_profiles) live via onSnapshot, scoped to the signed-in user by
// Firestore Security Rules (isSelf). Every listener has an error handler so a
// permission hiccup degrades to "no data yet" instead of crashing the page.
export function useUserData() {
  const { user } = useAuth();
  const [data, setData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData({});
      setLoading(false);
      return;
    }

    const db = getFirebaseDb();
    const onError = (label: string) => (error: unknown) => {
      console.error(`[useUserData] ${label} listener failed:`, error);
    };

    const unsubscribers = [
      onSnapshot(doc(db, "users", user.uid), (snap) => {
        setData((d) => ({ ...d, account: snap.data() as UserData["account"] }));
      }, onError("users")),
      onSnapshot(doc(db, "user_profiles", user.uid), (snap) => {
        setData((d) => ({ ...d, profile: snap.data() as UserProfile }));
      }, onError("user_profiles")),
      onSnapshot(doc(db, "fitness_profiles", user.uid), (snap) => {
        setData((d) => ({ ...d, fitness: snap.data() as FitnessProfile }));
      }, onError("fitness_profiles")),
    ];

    setLoading(false);
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [user]);

  return { ...data, loading };
}

export function calculateBmi(heightCm?: number, weightKg?: number): number | null {
  if (!heightCm || !weightKg) return null;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function bmiCategory(bmi: number): "underweight" | "normal" | "overweight" | "obese" {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}
