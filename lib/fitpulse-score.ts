export interface ScoreBreakdown {
  score: number;
  consistencyPoints: number;
  recordsPoints: number;
  trackingPoints: number;
}

// Simple and transparent on purpose (§77) — not a black-box or medical
// score. 70% consistency (workouts completed vs. weekly goal), 15% for
// having logged a personal record recently, 15% for tracking weight
// recently. Every point is explainable to the person looking at it.
export function calculateFitPulseScore(params: {
  weeklyCompleted: number;
  weeklyGoal: number;
  hasRecentPR: boolean;
  hasRecentWeightLog: boolean;
}): ScoreBreakdown {
  const { weeklyCompleted, weeklyGoal, hasRecentPR, hasRecentWeightLog } = params;
  const consistencyRatio = weeklyGoal > 0 ? Math.min(1, weeklyCompleted / weeklyGoal) : 0;
  const consistencyPoints = Math.round(consistencyRatio * 70);
  const recordsPoints = hasRecentPR ? 15 : 0;
  const trackingPoints = hasRecentWeightLog ? 15 : 0;
  return {
    score: Math.min(100, consistencyPoints + recordsPoints + trackingPoints),
    consistencyPoints,
    recordsPoints,
    trackingPoints,
  };
}

export function isWithinDays(isoDate: string, days: number): boolean {
  const date = new Date(isoDate);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}
