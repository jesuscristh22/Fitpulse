"use client";

import Link from "next/link";
import { CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useUserData } from "@/lib/use-user-data";
import { getChallenges } from "@/lib/challenges";
import { useMyChallengeParticipations, joinChallenge, checkIn, todayISO } from "@/lib/challenges-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

export function ChallengesView({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const c = dict.challenges;
  const { user } = useAuth();
  const { account } = useUserData();
  const { participations, loading } = useMyChallengeParticipations();
  const challenges = getChallenges(locale);

  const isActive = (s?: string) => s === "active" || s === "trialing";
  const hasPaidAccess = isActive(account?.militaryAiSubscriptionStatus) || isActive(account?.memberProSubscriptionStatus);

  if (loading) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => {
        const participant = participations[challenge.slug];
        const locked = challenge.isPremium && !hasPaidAccess;
        const done = participant?.checkinDates.length ?? 0;
        const checkedInToday = participant?.checkinDates.includes(todayISO()) ?? false;
        const daysElapsed = participant
          ? Math.floor((Date.now() - new Date(participant.joinedAt).getTime()) / 86400000)
          : 0;
        const daysLeft = Math.max(0, challenge.durationDays - daysElapsed);
        const completed = done >= challenge.goalCheckins;

        return (
          <Card key={challenge.slug} className="flex flex-col">
            <div className="flex items-start justify-between">
              <h3 className="font-heading text-base font-bold">{challenge.name}</h3>
              <Badge variant={challenge.isPremium ? "gold" : "success"}>
                {challenge.isPremium ? c.premiumBadge : c.freeBadge}
              </Badge>
            </div>
            <p className="mt-2 flex-1 text-sm text-silver">{challenge.description}</p>

            {locked ? (
              <div className="mt-5 text-center">
                <Lock size={20} className="mx-auto text-gold" />
                <p className="mt-2 text-xs text-silver">{c.premiumLocked}</p>
                <Link href={`/${locale}/planos`}>
                  <Button variant="primary" size="sm" className="mt-3 w-full">
                    {c.subscribeCta}
                  </Button>
                </Link>
              </div>
            ) : !participant ? (
              <Button
                variant="primary"
                size="sm"
                className="mt-5 w-full"
                onClick={() => user && joinChallenge(user.uid, challenge.slug)}
              >
                {c.join}
              </Button>
            ) : (
              <div className="mt-5">
                <p className="text-xs text-silver">
                  {c.progress.replace("{done}", String(done)).replace("{goal}", String(challenge.goalCheckins))}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${Math.min(100, (done / challenge.goalCheckins) * 100)}%` }}
                  />
                </div>
                {completed ? (
                  <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                    <CheckCircle2 size={16} /> {c.completed}
                  </p>
                ) : (
                  <>
                    <p className="mt-2 text-xs text-silver/70">{c.daysLeft.replace("{days}", String(daysLeft))}</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3 w-full"
                      disabled={checkedInToday}
                      onClick={() => user && checkIn(user.uid, challenge.slug)}
                    >
                      {checkedInToday ? c.checkedInToday : c.checkIn}
                    </Button>
                  </>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
