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
import { getFirebaseDb, getFirebaseAuth } from "./firebase-client";
import { useAuth } from "./auth-context";
import { stripUndefined } from "./firestore-utils";
import type { GymProfile, GymStaffRelationship, GymMembership } from "./types";

export async function createGym(name: string): Promise<{ ok?: boolean; error?: string; gymId?: string }> {
  const idToken = await getFirebaseAuth().currentUser?.getIdToken();
  const res = await fetch("/api/gym/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, name }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed with status ${res.status}`);
  }
  return data;
}

export async function saveGymProfile(gymId: string, update: Partial<Omit<GymProfile, "id" | "ownerId" | "createdAt">>) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "gym_profiles", gymId), stripUndefined(update));
}

// The gym(s) owned by the signed-in user (usually just one).
export function useMyGym() {
  const { user } = useAuth();
  const [gym, setGym] = useState<GymProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGym(null);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "gym_profiles"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setGym(snapshot.empty ? null : (snapshot.docs[0].data() as GymProfile));
        setLoading(false);
      },
      (err) => {
        console.error("[useMyGym] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { gym, loading };
}

export async function fetchGymDirectory(): Promise<GymProfile[]> {
  const db = getFirebaseDb();
  const snapshot = await getDocs(collection(db, "gym_profiles"));
  return snapshot.docs.map((d) => d.data() as GymProfile);
}

// ---------------- Staff ----------------

export async function applyAsStaff(gymId: string, staffId: string) {
  const db = getFirebaseDb();
  const staffDoc = await getDoc(doc(db, "users", staffId));
  await addDoc(collection(db, "gym_staff"), {
    gymId, staffId, staffDisplayName: staffDoc.data()?.displayName ?? "",
    role: "gym_staff", status: "pending", createdAt: serverTimestamp(),
  });
}

export async function respondToStaffApplication(relId: string, accept: boolean) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "gym_staff", relId), { status: accept ? "active" : "ended" });
}

export function useGymStaff(gymId: string | undefined) {
  const [staff, setStaff] = useState<(GymStaffRelationship & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gymId) {
      setStaff([]);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "gym_staff"), where("gymId", "==", gymId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((d) => ({ ...(d.data() as GymStaffRelationship), id: d.id }))
          .filter((r) => r.status !== "ended");
        setStaff(list);
        setLoading(false);
      },
      (err) => {
        console.error("[useGymStaff] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [gymId]);

  return { staff, loading };
}

// ---------------- Members ----------------

export async function joinGym(gymId: string, memberId: string) {
  const db = getFirebaseDb();
  const memberDoc = await getDoc(doc(db, "users", memberId));
  await addDoc(collection(db, "gym_memberships"), {
    gymId, memberId, memberDisplayName: memberDoc.data()?.displayName ?? "",
    status: "active", createdAt: serverTimestamp(),
  });
}

export async function leaveGym(membershipId: string) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "gym_memberships", membershipId), { status: "ended" });
}

export function useMyGymMembership() {
  const { user } = useAuth();
  const [membership, setMembership] = useState<(GymMembership & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMembership(null);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "gym_memberships"), where("memberId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((d) => ({ ...(d.data() as GymMembership), id: d.id }))
          .filter((m) => m.status !== "ended");
        setMembership(list[0] ?? null);
        setLoading(false);
      },
      (err) => {
        console.error("[useMyGymMembership] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { membership, loading };
}

export function useGymMembers(gymId: string | undefined) {
  const [members, setMembers] = useState<(GymMembership & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gymId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "gym_memberships"), where("gymId", "==", gymId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((d) => ({ ...(d.data() as GymMembership), id: d.id }))
          .filter((m) => m.status !== "ended");
        setMembers(list);
        setLoading(false);
      },
      (err) => {
        console.error("[useGymMembers] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [gymId]);

  return { members, loading };
}
