"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth } from "@/lib/firebase-client";
import type { Dictionary } from "@/lib/i18n";

interface AccessRequest {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
}

async function idToken() {
  return getFirebaseAuth().currentUser?.getIdToken();
}

export function AdminAccessRequestsPanel({ dict }: { dict: Dictionary }) {
  const a = dict.admin;
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const token = await idToken();
    const res = await fetch("/api/admin/access-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });
    const data = await res.json();
    setRequests(data.requests ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function respond(targetUserId: string, approve: boolean) {
    const token = await idToken();
    await fetch("/api/admin/access-requests/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token, targetUserId, approve }),
    });
    setRequests((prev) => prev.filter((r) => r.uid !== targetUserId));
  }

  if (loading) return null;

  if (requests.length === 0) {
    return <p className="mt-6 text-center text-silver">{a.noRequests}</p>;
  }

  return (
    <div className="mt-6 space-y-3">
      {requests.map((r) => (
        <Card key={r.uid}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{r.displayName || r.email}</p>
              <p className="text-xs text-silver">{r.email}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={() => respond(r.uid, true)}>
                {a.approve}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => respond(r.uid, false)}>
                {a.deny}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
