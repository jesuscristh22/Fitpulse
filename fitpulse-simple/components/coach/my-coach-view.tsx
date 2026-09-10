"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyCoachRelationship, updateRelationshipPermissions, endRelationship } from "@/lib/coach-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { CoachRelationship } from "@/lib/types";

const PERMISSION_KEYS: (keyof CoachRelationship["permissions"])[] = [
  "workouts", "progress", "measurements", "progressPhotos", "healthIntegrations", "checkins",
];

export function MyCoachView({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const r = dict.coach.relationship;
  const { relationship, loading } = useMyCoachRelationship();

  async function togglePermission(key: keyof CoachRelationship["permissions"]) {
    if (!relationship) return;
    const next = { ...relationship.permissions, [key]: !relationship.permissions[key] };
    await updateRelationshipPermissions(relationship.id, next);
  }

  if (loading) return null;

  if (!relationship) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <p className="text-silver">{r.noCoach}</p>
        <Link href={`/${locale}/coaches`}>
          <Button variant="primary" size="lg" className="mt-6 w-full">
            {r.findCoach}
          </Button>
        </Link>
      </Card>
    );
  }

  const isPending = relationship.status === "pending";

  return (
    <Card className="mx-auto max-w-lg">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">{isPending ? r.pendingTitle : r.activeTitle}</h2>
        <Badge variant={isPending ? "warning" : "success"}>{relationship.status}</Badge>
      </div>
      {isPending && <p className="mt-2 text-sm text-silver">{r.pendingSubtitle}</p>}

      {!isPending && (
        <>
          <p className="mt-6 text-xs font-semibold uppercase text-silver">{r.permissionsTitle}</p>
          <div className="mt-3 space-y-2">
            {PERMISSION_KEYS.map((key) => (
              <label key={key} className="flex items-center gap-3 text-sm text-silver">
                <input
                  type="checkbox"
                  checked={relationship.permissions[key]}
                  onChange={() => togglePermission(key)}
                />
                {r.permissions[key]}
              </label>
            ))}
          </div>
        </>
      )}

      <Button variant="secondary" size="sm" onClick={() => endRelationship(relationship.id)} className="mt-6 w-full">
        {r.removeCoach}
      </Button>
    </Card>
  );
}
