"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { fetchGymDirectory, joinGym, applyAsStaff, useMyGymMembership } from "@/lib/gym-client";
import type { Dictionary } from "@/lib/i18n";
import type { GymProfile } from "@/lib/types";

export function GymDirectory({ dict }: { dict: Dictionary }) {
  const d = dict.gym.directory;
  const { user } = useAuth();
  const { membership } = useMyGymMembership();
  const [gyms, setGyms] = useState<GymProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchGymDirectory().then(setGyms).finally(() => setLoading(false));
  }, []);

  async function handleJoin(gymId: string) {
    if (!user) return;
    await joinGym(gymId, user.uid);
    setJoinedIds((prev) => new Set(prev).add(gymId));
  }

  async function handleApplyStaff(gymId: string) {
    if (!user) return;
    await applyAsStaff(gymId, user.uid);
    setAppliedIds((prev) => new Set(prev).add(gymId));
  }

  if (loading) return null;
  if (gyms.length === 0) return <p className="text-center text-silver">{d.noGyms}</p>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {gyms.map((gym) => {
        const alreadyMember = !!membership;
        const joined = joinedIds.has(gym.id);
        const applied = appliedIds.has(gym.id);

        return (
          <Card key={gym.id} className="flex flex-col">
            <h3 className="font-heading text-base font-bold">{gym.name}</h3>
            <p className="mt-2 flex-1 text-sm text-silver">{gym.description || "—"}</p>
            {gym.city && <p className="mt-2 text-xs text-silver">{gym.city}</p>}
            {gym.amenities.length > 0 && (
              <p className="mt-2 text-xs text-gold">{gym.amenities.join(" · ")}</p>
            )}

            <div className="mt-5 flex flex-col gap-2">
              <Button variant="primary" size="sm" disabled={alreadyMember || joined} onClick={() => handleJoin(gym.id)}>
                {alreadyMember ? d.alreadyMember : joined ? d.joined : d.join}
              </Button>
              <Button variant="secondary" size="sm" disabled={applied} onClick={() => handleApplyStaff(gym.id)}>
                {applied ? d.applied : d.applyStaff}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
