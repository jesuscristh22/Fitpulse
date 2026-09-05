"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { respondToStaffApplication } from "@/lib/gym-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { GymProfile, GymStaffRelationship, GymMembership } from "@/lib/types";

interface StaffRow extends GymStaffRelationship { id: string; staffName: string }
interface MemberRow extends GymMembership { id: string; memberName: string }

export function GymTeamView({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const [gym, setGym] = useState<GymProfile | null>(null);
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const idToken = await getFirebaseAuth().currentUser?.getIdToken();
    const res = await fetch("/api/gym/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const data = await res.json();
    setGym(data.gym ?? null);
    setStaff(data.staff ?? []);
    setMembers(data.members ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRespond(id: string, accept: boolean) {
    await respondToStaffApplication(id, accept);
    load();
  }

  if (loading) return null;

  if (!gym) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <p className="text-silver">{dict.gym.create.subtitle}</p>
        <Link href={`/${locale}/gym/perfil`}>
          <Button variant="primary" size="lg" className="mt-6 w-full">
            {dict.gym.myGymLabel}
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="font-heading text-lg font-bold">{dict.gym.staff.title}</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {staff.length === 0 ? (
            <p className="text-sm text-silver">{dict.gym.staff.noStaff}</p>
          ) : (
            staff.map((s) => (
              <Card key={s.id}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{s.staffName}</p>
                  <Badge variant={s.status === "pending" ? "warning" : "success"}>
                    {s.status === "pending" ? dict.gym.staff.pending : dict.gym.staff.active}
                  </Badge>
                </div>
                {s.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => handleRespond(s.id, true)}>
                      {dict.gym.staff.accept}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleRespond(s.id, false)}>
                      {dict.gym.staff.decline}
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold">{dict.gym.members.title}</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {members.length === 0 ? (
            <p className="text-sm text-silver">{dict.gym.members.noMembers}</p>
          ) : (
            members.map((m) => (
              <Card key={m.id}>
                <p className="text-sm font-semibold text-white">{m.memberName}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
