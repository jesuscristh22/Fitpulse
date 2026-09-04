"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyGym, useGymStaff, useGymMembers, respondToStaffApplication } from "@/lib/gym-client";
import type { Dictionary } from "@/lib/i18n";

export function GymTeamView({ dict }: { dict: Dictionary }) {
  const { gym, loading: gymLoading } = useMyGym();
  const { staff, loading: staffLoading } = useGymStaff(gym?.id);
  const { members, loading: membersLoading } = useGymMembers(gym?.id);

  if (gymLoading) return null;
  if (!gym) return <p className="text-center text-silver">—</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="font-heading text-lg font-bold">{dict.gym.staff.title}</h2>
        {!staffLoading && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {staff.length === 0 ? (
              <p className="text-sm text-silver">{dict.gym.staff.noStaff}</p>
            ) : (
              staff.map((s, i) => (
                <Card key={i}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{s.staffId.slice(0, 8)}…</p>
                    <Badge variant={s.status === "pending" ? "warning" : "success"}>
                      {s.status === "pending" ? dict.gym.staff.pending : dict.gym.staff.active}
                    </Badge>
                  </div>
                  {s.status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => respondToStaffApplication((s as { id: string }).id, true)}>
                        {dict.gym.staff.accept}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => respondToStaffApplication((s as { id: string }).id, false)}>
                        {dict.gym.staff.decline}
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold">{dict.gym.members.title}</h2>
        {!membersLoading && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {members.length === 0 ? (
              <p className="text-sm text-silver">{dict.gym.members.noMembers}</p>
            ) : (
              members.map((m, i) => (
                <Card key={i}>
                  <p className="text-sm font-semibold text-white">{m.memberId.slice(0, 8)}…</p>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
