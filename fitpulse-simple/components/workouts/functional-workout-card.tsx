"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoEmbed } from "@/components/ui/video-embed";
import { getExerciseVideoId } from "@/lib/exercise-videos";
import { buildExerciseVideoSearchUrl } from "@/lib/youtube-search-link";
import { useAuth } from "@/lib/auth-context";
import { saveWorkout } from "@/lib/workouts-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { FunctionalTemplate } from "@/lib/functional-templates-server";
import type { WorkoutSet } from "@/lib/workouts";

export function FunctionalWorkoutCard({
  locale,
  dict,
  template,
}: {
  locale: LocaleSlug;
  dict: Dictionary;
  template: FunctionalTemplate;
}) {
  const fw = dict.functionalWorkouts;
  const { user } = useAuth();
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  async function handleStart() {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    setStarting(true);
    try {
      // Expand each template exercise into its configured number of set rows.
      const expandedSets: WorkoutSet[] = template.exercises.flatMap((e) =>
        Array.from({ length: e.sets }, (_, i) => ({
          exerciseId: e.exerciseId,
          exerciseName: e.exerciseName,
          exerciseSlug: e.exerciseSlug,
          setNumber: i + 1,
          reps: e.reps,
          durationSeconds: e.durationSeconds,
          restSeconds: e.restSeconds,
        })),
      );
      const workoutId = await saveWorkout(user.uid, {
        name: template.name,
        createdBy: "member",
        sets: expandedSets,
      });
      router.push(`/${locale}/treinos/${workoutId}/executar`);
    } catch (err) {
      console.error("[FunctionalWorkoutCard] failed to start:", err);
      setStarting(false);
    }
  }

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between">
        <h3 className="font-heading text-base font-bold">{template.name}</h3>
        <Badge variant="success">{fw.freeBadge}</Badge>
      </div>
      <p className="mt-2 text-sm text-silver">{template.description}</p>

      {template.videoId && (
        <div className="mt-4">
          <VideoEmbed videoId={template.videoId} title={template.name} />
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-silver">
        <span className="flex items-center gap-1">
          <Clock size={12} /> {template.estimatedMinutes} {fw.minutesLabel}
        </span>
        <span>{fw.exercisesCount.replace("{count}", String(template.exercises.length))}</span>
        <Badge variant="gold">{dict.library.difficulty[template.difficulty]}</Badge>
      </div>

      <div className="mt-4 flex-1 space-y-4">
        {template.exercises.map((e) => {
          const videoId = getExerciseVideoId(e.exerciseSlug, locale);
          return (
            <div key={e.exerciseId}>
              <p className="text-xs font-semibold text-white">
                {e.exerciseName} — {e.sets}x{e.reps ?? `${e.durationSeconds}s`}
              </p>
              {videoId ? (
                <div className="mt-2">
                  <VideoEmbed videoId={videoId} title={e.exerciseName} />
                </div>
              ) : (
                <a
                  href={buildExerciseVideoSearchUrl(e.exerciseName, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-silver hover:text-gold hover:underline"
                >
                  {fw.searchVideoLabel}
                </a>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="primary" size="md" onClick={handleStart} disabled={starting} className="mt-5 w-full gap-2">
        <Zap size={14} className="fill-carbon" /> {fw.startButton}
      </Button>
    </Card>
  );
}
