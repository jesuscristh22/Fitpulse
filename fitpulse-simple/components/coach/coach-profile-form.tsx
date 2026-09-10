"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useMyCoachProfile, becomeCoach, saveCoachProfile } from "@/lib/coach-client";
import type { Dictionary } from "@/lib/i18n";

export function CoachProfileForm({ dict }: { dict: Dictionary }) {
  const cp = dict.coach.profile;
  const { user } = useAuth();
  const { profile, loading } = useMyCoachProfile();

  const [becoming, setBecoming] = useState(false);
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [languages, setLanguages] = useState("");
  const [city, setCity] = useState("");
  const [online, setOnline] = useState(true);
  const [inPerson, setInPerson] = useState(false);
  const [pricingNote, setPricingNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "");
      setSpecialties((profile.specialties ?? []).join(", "));
      setLanguages((profile.languages ?? []).join(", "));
      setCity(profile.city ?? "");
      setOnline(profile.online ?? true);
      setInPerson(profile.inPerson ?? false);
      setPricingNote(profile.pricingNote ?? "");
    }
  }, [profile]);

  async function handleBecome() {
    setBecoming(true);
    try {
      await becomeCoach();
      // The user doc's custom claims changed server-side; refresh the ID
      // token so the client picks up the new role on next read.
      await user?.getIdToken(true);
    } finally {
      setBecoming(false);
    }
  }

  async function handleSave() {
    if (!user) return;
    await saveCoachProfile(user.uid, {
      bio,
      specialties: specialties.split(",").map((s) => s.trim()).filter(Boolean),
      languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
      city,
      online,
      inPerson,
      pricingNote,
    });
    setSaved(true);
  }

  if (loading) return null;

  if (!profile) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h2 className="font-heading text-xl font-bold">{cp.becomeTitle}</h2>
        <p className="mt-3 text-sm text-silver">{cp.becomeSubtitle}</p>
        <Button variant="primary" size="lg" onClick={handleBecome} disabled={becoming} className="mt-6 w-full">
          {cp.becomeCta}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <div>
        <label className="text-xs text-silver">{cp.bio}</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={cp.bioPlaceholder}
          rows={4}
          className="mt-1 w-full rounded-md border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none placeholder:text-silver/60 focus:border-gold"
        />
      </div>
      <div className="mt-4">
        <label className="text-xs text-silver">{cp.specialties}</label>
        <Input value={specialties} onChange={(e) => setSpecialties(e.target.value)} className="mt-1" />
      </div>
      <div className="mt-4">
        <label className="text-xs text-silver">{cp.languages}</label>
        <Input value={languages} onChange={(e) => setLanguages(e.target.value)} className="mt-1" />
      </div>
      <div className="mt-4">
        <label className="text-xs text-silver">{cp.city}</label>
        <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
      </div>
      <div className="mt-4 flex gap-4">
        <label className="flex items-center gap-2 text-sm text-silver">
          <input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} /> {cp.online}
        </label>
        <label className="flex items-center gap-2 text-sm text-silver">
          <input type="checkbox" checked={inPerson} onChange={(e) => setInPerson(e.target.checked)} /> {cp.inPerson}
        </label>
      </div>
      <div className="mt-4">
        <label className="text-xs text-silver">{cp.pricingNote}</label>
        <Input value={pricingNote} onChange={(e) => setPricingNote(e.target.value)} className="mt-1" />
      </div>

      {saved && <p className="mt-4 text-sm text-emerald-400">{cp.saved}</p>}
      <Button variant="primary" size="lg" onClick={handleSave} className="mt-6 w-full">
        {cp.save}
      </Button>
    </Card>
  );
}
