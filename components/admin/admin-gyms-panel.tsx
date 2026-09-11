"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getFirebaseAuth } from "@/lib/firebase-client";
import type { Dictionary } from "@/lib/i18n";

interface AdminGym {
  id: string;
  name: string;
  ownerId: string;
  city?: string;
  memberCount: number;
  staffCount: number;
}

async function idToken() {
  return getFirebaseAuth().currentUser?.getIdToken();
}

export function AdminGymsPanel({ dict }: { dict: Dictionary }) {
  const a = dict.admin;
  const [gyms, setGyms] = useState<AdminGym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await idToken();
      const res = await fetch("/api/admin/gyms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      const data = await res.json();
      setGyms(data.gyms ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  if (gyms.length === 0) {
    return <p className="mt-6 text-center text-silver">{a.noGyms}</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {gyms.map((gym) => (
        <Card key={gym.id}>
          <p className="text-sm font-semibold text-white">{gym.name}</p>
          {gym.city && <p className="text-xs text-silver">{gym.city}</p>}
          <p className="mt-2 text-xs text-silver">
            {gym.memberCount} membros · {gym.staffCount} funcionários
          </p>
          <p className="mt-1 text-xs text-silver/60">Dono: {gym.ownerId.slice(0, 10)}…</p>
        </Card>
      ))}
    </div>
  );
}
