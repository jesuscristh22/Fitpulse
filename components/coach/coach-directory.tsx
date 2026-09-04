"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { fetchCoachDirectory, inviteCoach, useMyCoachRelationship } from "@/lib/coach-client";
import type { Dictionary } from "@/lib/i18n";
import type { CoachProfile } from "@/lib/types";

export function CoachDirectory({ dict }: { dict: Dictionary }) {
  const d = dict.coach.directory;
  const { user } = useAuth();
  const { relationship } = useMyCoachRelationship();
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCoachDirectory()
      .then(setCoaches)
      .finally(() => setLoading(false));
  }, []);

  async function handleInvite(coachId: string) {
    if (!user) return;
    await inviteCoach(user.uid, coachId);
    setInvitedIds((prev) => new Set(prev).add(coachId));
  }

  if (loading) return null;

  if (coaches.length === 0) {
    return <p className="text-center text-silver">{d.noCoaches}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {coaches.map((coach) => {
        const alreadyInvited = invitedIds.has(coach.userId);
        const hasActiveCoach = !!relationship;

        return (
          <Card key={coach.userId} className="flex flex-col">
            <h3 className="font-heading text-base font-bold">{coach.displayName || "Coach"}</h3>
            <p className="mt-2 flex-1 text-sm text-silver">{coach.bio || "—"}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {coach.specialties.slice(0, 3).map((s) => (
                <Badge key={s} variant="gold">{s}</Badge>
              ))}
            </div>

            <div className="mt-3 flex gap-3 text-xs text-silver">
              {coach.city && <span>{coach.city}</span>}
              {coach.online && <span>Online</span>}
              {coach.inPerson && <span>In-person</span>}
            </div>

            {coach.pricingNote && <p className="mt-2 text-xs text-gold">{coach.pricingNote}</p>}

            <Button
              variant="primary"
              size="sm"
              className="mt-5 w-full"
              disabled={alreadyInvited || hasActiveCoach}
              onClick={() => handleInvite(coach.userId)}
            >
              {hasActiveCoach ? d.alreadyConnected : alreadyInvited ? d.invited : d.invite}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
