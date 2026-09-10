"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase-client";
import { getFirebaseAuth } from "./firebase-client";
import { useAuth } from "./auth-context";
import { stripUndefined } from "./firestore-utils";
import type { CoachProfile, CoachRelationship } from "./types";

const DEFAULT_PERMISSIONS: CoachRelationship["permissions"] = {
  workouts: true,
  progress: false,
  measurements: false,
  progressPhotos: false,
  healthIntegrations: false,
  checkins: true,
};

async function callBecomeCoach() {
  const idToken = await getFirebaseAuth().currentUser?.getIdToken();
  await fetch("/api/coach/become", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}

export async function becomeCoach() {
  await callBecomeCoach();
}

export async function saveCoachProfile(uid: string, profile: Partial<Omit<CoachProfile, "userId" | "createdAt">>) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "coach_profiles", uid), stripUndefined(profile));
}

export function useMyCoachProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const unsubscribe = onSnapshot(
      doc(db, "coach_profiles", user.uid),
      (snap) => {
        setProfile(snap.exists() ? (snap.data() as CoachProfile) : null);
        setLoading(false);
      },
      (err) => {
        console.error("[useMyCoachProfile] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { profile, loading };
}

// One-off fetch for the public directory (doesn't need to be realtime).
export async function fetchCoachDirectory(): Promise<CoachProfile[]> {
  const db = getFirebaseDb();
  const snapshot = await getDocs(collection(db, "coach_profiles"));
  return snapshot.docs.map((d) => d.data() as CoachProfile);
}

export async function inviteCoach(memberId: string, coachId: string) {
  const db = getFirebaseDb();
  const memberDoc = await getDoc(doc(db, "users", memberId));
  await addDoc(collection(db, "coach_relationships"), {
    memberId,
    memberDisplayName: memberDoc.data()?.displayName ?? "",
    coachId,
    status: "pending",
    permissions: DEFAULT_PERMISSIONS,
    createdAt: serverTimestamp(),
  });
}

export async function respondToInvite(relationshipId: string, accept: boolean) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "coach_relationships", relationshipId), {
    status: accept ? "active" : "ended",
    ...(accept ? { startDate: new Date().toISOString() } : { endDate: new Date().toISOString() }),
  });
}

export async function endRelationship(relationshipId: string) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "coach_relationships", relationshipId), {
    status: "ended",
    endDate: new Date().toISOString(),
  });
}

export async function updateRelationshipPermissions(
  relationshipId: string,
  permissions: CoachRelationship["permissions"],
) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "coach_relationships", relationshipId), { permissions });
}

// The signed-in member's own coach relationship (most recent non-ended one, if any).
export function useMyCoachRelationship() {
  const { user } = useAuth();
  const [relationship, setRelationship] = useState<(CoachRelationship & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRelationship(null);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "coach_relationships"), where("memberId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((d) => ({ ...(d.data() as CoachRelationship), id: d.id }))
          .filter((r) => r.status !== "ended");
        setRelationship(list[0] ?? null);
        setLoading(false);
      },
      (err) => {
        console.error("[useMyCoachRelationship] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { relationship, loading };
}

// The signed-in coach's client list (all relationships where they're the coach).
export function useMyClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<(CoachRelationship & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "coach_relationships"), where("coachId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((d) => ({ ...(d.data() as CoachRelationship), id: d.id }))
          .filter((r) => r.status !== "ended");
        setClients(list);
        setLoading(false);
      },
      (err) => {
        console.error("[useMyClients] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { clients, loading };
}
