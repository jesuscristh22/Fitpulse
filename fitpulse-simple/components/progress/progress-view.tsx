"use client";

import { useState } from "react";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useUserData } from "@/lib/use-user-data";
import { useWeeklyCompletedCount } from "@/lib/workout-sessions-client";
import {
  useWeightLogs,
  logWeight,
  deleteWeightLog,
  usePersonalRecords,
  savePersonalRecord,
  deletePersonalRecord,
} from "@/lib/progress-client";
import { calculateFitPulseScore, isWithinDays } from "@/lib/fitpulse-score";
import type { Dictionary } from "@/lib/i18n";
import type { PRExerciseKey } from "@/lib/progress";

const PR_EXERCISE_KEYS: PRExerciseKey[] = [
  "bench_press", "squat", "deadlift", "pull_ups", "push_ups", "plank", "running_5k", "custom",
];
const UNIT_OPTIONS = ["kg", "reps", "seconds", "minutes"] as const;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function WeightSparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 30 - ((v - min) / range) * 28 - 1;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="mt-3 h-12 w-full">
      <polyline fill="none" stroke="#E8A942" strokeWidth="2" points={points} />
    </svg>
  );
}

export function ProgressView({ dict }: { dict: Dictionary }) {
  const p = dict.progress;
  const { user } = useAuth();
  const { fitness } = useUserData();
  const { count: weeklyCompleted } = useWeeklyCompletedCount();
  const { logs, loading: logsLoading } = useWeightLogs();
  const { records, loading: recordsLoading } = usePersonalRecords();

  const [newWeight, setNewWeight] = useState("");
  const [newWeightDate, setNewWeightDate] = useState(todayISO());
  const [prExercise, setPrExercise] = useState<PRExerciseKey>("bench_press");
  const [prCustomLabel, setPrCustomLabel] = useState("");
  const [prValue, setPrValue] = useState("");
  const [prUnit, setPrUnit] = useState<(typeof UNIT_OPTIONS)[number]>("kg");
  const [prDate, setPrDate] = useState(todayISO());

  const hasRecentPR = records.some((r) => isWithinDays(r.achievedAt, 30));
  const hasRecentWeightLog = logs.some((l) => isWithinDays(l.loggedAt, 30));
  const scoreBreakdown = calculateFitPulseScore({
    weeklyCompleted,
    weeklyGoal: fitness?.daysAvailable ?? 0,
    hasRecentPR,
    hasRecentWeightLog,
  });

  async function handleAddWeight() {
    if (!user || !newWeight) return;
    await logWeight(user.uid, Number(newWeight), newWeightDate);
    setNewWeight("");
  }

  async function handleAddPR() {
    if (!user || !prValue) return;
    await savePersonalRecord({
      userId: user.uid,
      exerciseKey: prExercise,
      customLabel: prExercise === "custom" ? prCustomLabel : undefined,
      value: Number(prValue),
      unit: prUnit,
      achievedAt: prDate,
    });
    setPrValue("");
    setPrCustomLabel("");
  }

  const weightValues = [...logs].reverse().map((l) => l.weightKg);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <h1 className="font-heading text-2xl font-bold">{p.title}</h1>
      <p className="mt-1 text-sm text-silver">{p.subtitle}</p>

      {/* FitPulse Score */}
      <Card className="mt-8">
        <p className="text-xs uppercase text-silver">{p.scoreTitle}</p>
        <p className="mt-2 font-heading text-5xl font-extrabold text-gold">{scoreBreakdown.score}</p>
        <p className="mt-2 text-xs text-silver">
          {p.scoreBreakdown
            .replace("{c}", String(scoreBreakdown.consistencyPoints))
            .replace("{r}", String(scoreBreakdown.recordsPoints))
            .replace("{t}", String(scoreBreakdown.trackingPoints))}
        </p>
        <p className="mt-2 text-xs text-silver/60">{p.scoreDisclaimer}</p>
      </Card>

      {/* Weight history */}
      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-silver">{p.weightTitle}</p>
          <TrendingUp size={16} className="text-gold" />
        </div>

        <WeightSparkline values={weightValues} />

        <div className="mt-4 flex flex-wrap items-end gap-2">
          <Input type="date" value={newWeightDate} onChange={(e) => setNewWeightDate(e.target.value)} className="w-40" />
          <Input
            type="number"
            placeholder={p.weightValuePlaceholder}
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="w-32"
          />
          <Button variant="primary" size="sm" onClick={handleAddWeight} className="gap-1.5">
            <Plus size={14} /> {p.addWeight}
          </Button>
        </div>

        {!logsLoading && (
          <div className="mt-4 space-y-1">
            {logs.length === 0 ? (
              <p className="text-sm text-silver">{p.noWeightLogs}</p>
            ) : (
              logs.slice(0, 8).map((log) => (
                <div key={log.id} className="flex items-center justify-between border-t border-white/5 pt-1 text-sm text-silver">
                  <span>{new Date(log.loggedAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-white">{log.weightKg} kg</span>
                  <button onClick={() => log.id && deleteWeightLog(log.id)} className="text-silver hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </Card>

      {/* Personal records */}
      <Card className="mt-6">
        <p className="text-xs uppercase text-silver">{p.prTitle}</p>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={prExercise}
            onChange={(e) => setPrExercise(e.target.value as PRExerciseKey)}
            className="h-12 rounded-md border border-white/10 bg-carbon px-3 text-sm text-white outline-none focus:border-gold"
          >
            {PR_EXERCISE_KEYS.map((k) => (
              <option key={k} value={k}>{p.exercises[k]}</option>
            ))}
          </select>
          {prExercise === "custom" && (
            <Input placeholder={p.customLabel} value={prCustomLabel} onChange={(e) => setPrCustomLabel(e.target.value)} />
          )}
          <Input type="number" placeholder={p.valueLabel} value={prValue} onChange={(e) => setPrValue(e.target.value)} />
          <select
            value={prUnit}
            onChange={(e) => setPrUnit(e.target.value as (typeof UNIT_OPTIONS)[number])}
            className="h-12 rounded-md border border-white/10 bg-carbon px-3 text-sm text-white outline-none focus:border-gold"
          >
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>{p.units[u]}</option>
            ))}
          </select>
          <Input type="date" value={prDate} onChange={(e) => setPrDate(e.target.value)} />
          <Button variant="primary" size="sm" onClick={handleAddPR} className="gap-1.5">
            <Plus size={14} /> {p.addPR}
          </Button>
        </div>

        {!recordsLoading && (
          <div className="mt-5 space-y-1">
            {records.length === 0 ? (
              <p className="text-sm text-silver">{p.noPRs}</p>
            ) : (
              records.map((r) => (
                <div key={r.id} className="flex items-center justify-between border-t border-white/5 pt-1 text-sm text-silver">
                  <span>{r.exerciseKey === "custom" ? r.customLabel : p.exercises[r.exerciseKey]}</span>
                  <span className="font-semibold text-white">
                    {r.value} {p.units[r.unit]}
                  </span>
                  <span className="text-xs">{new Date(r.achievedAt).toLocaleDateString()}</span>
                  <button onClick={() => r.id && deletePersonalRecord(r.id)} className="text-silver hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
