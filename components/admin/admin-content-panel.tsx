"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseAuth } from "@/lib/firebase-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { Exercise, ExerciseCategory } from "@/lib/workouts";

const CATEGORIES: ExerciseCategory[] = ["strength", "cardio", "calisthenics", "military", "mobility", "warm-up", "recovery"];
const DIFFICULTIES: Exercise["difficulty"][] = ["beginner", "intermediate", "advanced"];
const LOCALES: LocaleSlug[] = ["pt-br", "en", "es"];

async function idToken() {
  return getFirebaseAuth().currentUser?.getIdToken();
}

function blankExercise(): Exercise {
  return {
    id: "", slug: "", name: "", description: "", instructions: [],
    muscles: [], equipment: ["no_equipment"], difficulty: "beginner", category: "strength",
  };
}

export function AdminContentPanel({ dict }: { dict: Dictionary }) {
  const c = dict.admin.content;
  const [locale, setLocale] = useState<LocaleSlug>("pt-br");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [instructionsText, setInstructionsText] = useState("");
  const [musclesText, setMusclesText] = useState("");
  const [saved, setSaved] = useState(false);

  async function loadExercises(loc: LocaleSlug) {
    setLoading(true);
    const token = await idToken();
    const res = await fetch("/api/admin/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token, locale: loc }),
    });
    const data = await res.json();
    setExercises(data.exercises ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadExercises(locale);
  }, [locale]);

  function startEdit(exercise: Exercise) {
    setEditing(exercise);
    setInstructionsText(exercise.instructions.join("\n"));
    setMusclesText(exercise.muscles.join(", "));
    setSaved(false);
  }

  function startNew() {
    startEdit(blankExercise());
  }

  async function handleSave() {
    if (!editing) return;
    const exercise: Exercise = {
      ...editing,
      slug: editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      id: editing.id || editing.slug,
      instructions: instructionsText.split("\n").map((s) => s.trim()).filter(Boolean),
      muscles: musclesText.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const token = await idToken();
    await fetch("/api/admin/exercises/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token, locale, exercise }),
    });
    setSaved(true);
    loadExercises(locale);
  }

  if (editing) {
    return (
      <Card className="mt-6">
        <button onClick={() => setEditing(null)} className="text-xs text-silver hover:text-white">
          ← {c.back}
        </button>

        <div className="mt-4">
          <label className="text-xs text-silver">{c.name}</label>
          <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1" />
        </div>
        <div className="mt-4">
          <label className="text-xs text-silver">{c.description}</label>
          <textarea
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-md border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none focus:border-gold"
          />
        </div>
        <div className="mt-4">
          <label className="text-xs text-silver">{c.instructions}</label>
          <textarea
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none focus:border-gold"
          />
        </div>
        <div className="mt-4">
          <label className="text-xs text-silver">{c.muscles}</label>
          <Input value={musclesText} onChange={(e) => setMusclesText(e.target.value)} className="mt-1" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-silver">{c.category}</label>
            <select
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value as ExerciseCategory })}
              className="mt-1 h-12 w-full rounded-md border border-white/10 bg-carbon px-3 text-sm text-white outline-none focus:border-gold"
            >
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-silver">{c.difficulty}</label>
            <select
              value={editing.difficulty}
              onChange={(e) => setEditing({ ...editing, difficulty: e.target.value as Exercise["difficulty"] })}
              className="mt-1 h-12 w-full rounded-md border border-white/10 bg-carbon px-3 text-sm text-white outline-none focus:border-gold"
            >
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-silver">{c.videoId}</label>
          <Input
            value={editing.videoId ?? ""}
            onChange={(e) => setEditing({ ...editing, videoId: e.target.value || undefined })}
            className="mt-1"
          />
        </div>

        {saved && <p className="mt-4 text-sm text-emerald-400">{c.saved}</p>}
        <Button variant="primary" size="lg" onClick={handleSave} className="mt-6 w-full">
          {c.save}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-silver">{c.subtitle}</p>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as LocaleSlug)}
          className="h-10 rounded-md border border-white/10 bg-carbon px-3 text-sm text-white outline-none focus:border-gold"
        >
          {LOCALES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <Button variant="secondary" size="sm" onClick={startNew} className="mt-4">
        {c.addNew}
      </Button>

      {!loading && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {exercises.map((ex) => (
            <button
              key={ex.slug}
              onClick={() => startEdit(ex)}
              className="flex items-center justify-between rounded-lg border border-white/10 p-3 text-left hover:border-gold/40"
            >
              <span className="text-sm text-white">{ex.name}</span>
              <span className="text-xs text-silver">{ex.category}</span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
