"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./firebase-client";
import { useAuth } from "./auth-context";
import { stripUndefined } from "./firestore-utils";
import type { WeightLog, PersonalRecord } from "./progress";

// ---------------- Weight history ----------------

export async function logWeight(userId: string, weightKg: number, loggedAt: string) {
  const db = getFirebaseDb();
  await addDoc(collection(db, "weight_logs"), stripUndefined({ userId, weightKg, loggedAt, createdAt: serverTimestamp() }));
}

export async function deleteWeightLog(id: string) {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "weight_logs", id));
}

export function useWeightLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLogs([]);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "weight_logs"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WeightLog, "id">) }));
        list.sort((a, b) => (a.loggedAt < b.loggedAt ? 1 : -1));
        setLogs(list);
        setLoading(false);
      },
      (err) => {
        console.error("[useWeightLogs] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { logs, loading };
}

// ---------------- Personal records ----------------

export async function savePersonalRecord(record: Omit<PersonalRecord, "id">) {
  const db = getFirebaseDb();
  await addDoc(collection(db, "personal_records"), stripUndefined({ ...record, createdAt: serverTimestamp() }));
}

export async function deletePersonalRecord(id: string) {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "personal_records", id));
}

export function usePersonalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }
    const db = getFirebaseDb();
    const q = query(collection(db, "personal_records"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PersonalRecord, "id">) }));
        list.sort((a, b) => (a.achievedAt < b.achievedAt ? 1 : -1));
        setRecords(list);
        setLoading(false);
      },
      (err) => {
        console.error("[usePersonalRecords] listener failed:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { records, loading };
}
