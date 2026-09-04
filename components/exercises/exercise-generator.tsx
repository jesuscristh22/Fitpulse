"use client";

import { useState } from "react";
import Link from "next/link";
import { Shuffle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { Exercise, ExerciseCategory } from "@/lib/workouts";

const CATEGORIES: ExerciseCategory[] = [
  "strength",
  "cardio",
  "calisthenics",
  "military",
  "mobility",
  "warm-up",
  "recovery",
];

// Deliberately NOT the full browsable library: picks one random exercise
// from the chosen category and shows only its name, description, and first
// instruction step — enough to be genuinely useful without letting a free
// visitor hand-assemble a whole program from the full catalog.
export function ExerciseGenerator({
  locale,
  dict,
  exercises,
}: {
  locale: LocaleSlug;
  dict: Dictionary;
  exercises: Exercise[];
}) {
  const lib = dict.library;
  const base = `/${locale}`;
  const [category, setCategory] = useState<ExerciseCategory>("calisthenics");
  const [result, setResult] = useState<Exercise | null>(null);

  function generate() {
    const pool = exercises.filter((e) => e.category === category);
    if (pool.length === 0) return;
    setResult(pool[Math.floor(Math.random() * pool.length)]);
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setResult(null);
            }}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              category === c ? "border-gold bg-gold text-carbon" : "border-white/15 text-white hover:border-gold/60"
            }`}
          >
            {lib.categories[c]}
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="primary" size="lg" onClick={generate} className="gap-2">
          <Shuffle size={16} /> {result ? lib.tryAgain : lib.generateButton}
        </Button>
      </div>

      {result && (
        <Card className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">{result.name}</h2>
            <Badge variant="gold">{lib.difficulty[result.difficulty]}</Badge>
          </div>
          <p className="mt-2 text-sm text-silver">{result.description}</p>
          {result.instructions[0] && (
            <p className="mt-4 text-sm text-silver">
              <span className="font-heading font-bold text-gold">1. </span>
              {result.instructions[0]}
            </p>
          )}
        </Card>
      )}

      <Card className="mt-8 text-center">
        <p className="text-sm text-silver">{lib.upsellNote}</p>
        <Link href={`${base}/planos`}>
          <Button variant="secondary" size="md" className="mt-4">
            {lib.subscribeCta}
          </Button>
        </Link>
      </Card>
    </div>
  );
}
