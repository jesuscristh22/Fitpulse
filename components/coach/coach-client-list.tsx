"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyClients, respondToInvite } from "@/lib/coach-client";
import type { Dictionary } from "@/lib/i18n";

export function CoachClientList({ dict }: { dict: Dictionary }) {
  const c = dict.coach.clients;
  const { clients, loading } = useMyClients();

  if (loading) return null;

  if (clients.length === 0) {
    return <p className="text-center text-silver">{c.noClients}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => {
        const isPending = client.status === "pending";
        const sharedPermissions = Object.entries(client.permissions)
          .filter(([, v]) => v)
          .map(([k]) => dict.coach.relationship.permissions[k as keyof typeof dict.coach.relationship.permissions]);

        return (
          <Card key={client.id}>
            <div className="flex items-center justify-between">
              <p className="font-heading text-sm font-bold">{client.memberId.slice(0, 8)}…</p>
              <Badge variant={isPending ? "warning" : "success"}>{isPending ? c.pending : c.active}</Badge>
            </div>

            {!isPending && sharedPermissions.length > 0 && (
              <p className="mt-3 text-xs text-silver">
                {c.viewSharedInfo}: {sharedPermissions.join(", ")}
              </p>
            )}

            {isPending && (
              <div className="mt-4 flex gap-2">
                <Button variant="primary" size="sm" onClick={() => respondToInvite(client.id, true)}>
                  {c.accept}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => respondToInvite(client.id, false)}>
                  {c.decline}
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
