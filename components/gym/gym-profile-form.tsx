"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyGym, createGym, saveGymProfile } from "@/lib/gym-client";
import type { Dictionary } from "@/lib/i18n";

export function GymProfileForm({ dict }: { dict: Dictionary }) {
  const g = dict.gym;
  const { gym, loading } = useMyGym();

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [amenities, setAmenities] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (gym) {
      setDescription(gym.description ?? "");
      setCity(gym.city ?? "");
      setAddress(gym.address ?? "");
      setAmenities((gym.amenities ?? []).join(", "));
    }
  }, [gym]);

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await createGym(name);
    } finally {
      setCreating(false);
    }
  }

  async function handleSave() {
    if (!gym) return;
    await saveGymProfile(gym.id, {
      description,
      city,
      address,
      amenities: amenities.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSaved(true);
  }

  if (loading) return null;

  if (!gym) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h2 className="font-heading text-xl font-bold">{g.create.title}</h2>
        <p className="mt-3 text-sm text-silver">{g.create.subtitle}</p>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={g.create.namePlaceholder} className="mt-6" />
        <Button variant="primary" size="lg" onClick={handleCreate} disabled={creating || !name.trim()} className="mt-4 w-full">
          {g.create.cta}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <h2 className="font-heading text-lg font-bold">{gym.name}</h2>
      <div className="mt-4">
        <label className="text-xs text-silver">{g.profile.description}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={g.profile.descriptionPlaceholder}
          rows={4}
          className="mt-1 w-full rounded-md border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none placeholder:text-silver/60 focus:border-gold"
        />
      </div>
      <div className="mt-4">
        <label className="text-xs text-silver">{g.profile.city}</label>
        <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
      </div>
      <div className="mt-4">
        <label className="text-xs text-silver">{g.profile.address}</label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
      </div>
      <div className="mt-4">
        <label className="text-xs text-silver">{g.profile.amenities}</label>
        <Input value={amenities} onChange={(e) => setAmenities(e.target.value)} className="mt-1" />
      </div>

      {saved && <p className="mt-4 text-sm text-emerald-400">{g.profile.saved}</p>}
      <Button variant="primary" size="lg" onClick={handleSave} className="mt-6 w-full">
        {g.profile.save}
      </Button>
    </Card>
  );
}
