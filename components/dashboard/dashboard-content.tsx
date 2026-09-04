"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserData, calculateBmi, bmiCategory } from "@/lib/use-user-data";
import { useWeeklyCompletedCount } from "@/lib/workout-sessions-client";
import { useMyWorkouts } from "@/lib/workouts-client";
import { useMilitaryProgram } from "@/lib/military-program-client";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";
import type { BlogPost } from "@/lib/blog-content";

const BMI_MIN = 15;

function isActive(status?: string): boolean {
  return status === "active" || status === "trialing";
}
const BMI_MAX = 35;
const BMI_ZONE_WIDTHS = { underweight: 17.5, normal: 32.5, overweight: 25, obese: 25 };

function BmiGauge({ bmi }: { bmi: number }) {
  const clamped = Math.min(BMI_MAX, Math.max(BMI_MIN, bmi));
  const markerPct = ((clamped - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100;

  return (
    <div className="relative mt-4">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        <div style={{ width: `${BMI_ZONE_WIDTHS.underweight}%` }} className="bg-sky-500" />
        <div style={{ width: `${BMI_ZONE_WIDTHS.normal}%` }} className="bg-emerald-500" />
        <div style={{ width: `${BMI_ZONE_WIDTHS.overweight}%` }} className="bg-amber-500" />
        <div style={{ width: `${BMI_ZONE_WIDTHS.obese}%` }} className="bg-red-500" />
      </div>
      <div
        className="absolute -top-1 h-[18px] w-1 -translate-x-1/2 rounded-full bg-white shadow"
        style={{ left: `${markerPct}%` }}
      />
    </div>
  );
}

export function DashboardContent({
  locale,
  dict,
  blogPosts,
}: {
  locale: LocaleSlug;
  dict: Dictionary;
  blogPosts: BlogPost[];
}) {
  const { account, profile, fitness, loading } = useUserData();
  const { count: weeklyCompleted } = useWeeklyCompletedCount();
  const { workouts } = useMyWorkouts();
  const { program: militaryProgram, subscriptionStatus: militaryStatus } = useMilitaryProgram();
  const base = `/${locale}`;
  const de = dict.dashboardExtra;

  const bmi = calculateBmi(profile?.heightCm, profile?.weightKg);
  const category = bmi !== null ? bmiCategory(bmi) : null;
  const displayName = account?.displayName?.split(" ")[0] || "";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 pt-28">
      <h1 className="font-heading text-2xl font-bold">
        {dict.dashboard.greeting}
        {displayName ? (
          <>
            , <span className="text-gold">{displayName}</span>
          </>
        ) : null}
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`${base}/treinos`}>
          <Button variant="secondary" size="sm">
            {dict.myWorkouts.title}
          </Button>
        </Link>
        <Link href={`${base}/treinos/novo`}>
          <Button variant="primary" size="sm">
            {dict.myWorkouts.newWorkout}
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Plan card */}
        <Card>
          <p className="text-xs uppercase text-silver">{de.planLabel}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {isActive(account?.memberProSubscriptionStatus) && <Badge variant="gold">Member Pro</Badge>}
            {isActive(account?.militaryAiSubscriptionStatus) && <Badge variant="gold">{dict.military.badge}</Badge>}
            {!isActive(account?.memberProSubscriptionStatus) && !isActive(account?.militaryAiSubscriptionStatus) && (
              <Badge variant="default">{de.planFree}</Badge>
            )}
          </div>
          <Link href={`${base}/planos`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              {de.viewPlans}
            </Button>
          </Link>
        </Card>

        {/* Health snapshot / BMI */}
        <Card className="lg:col-span-2">
          <p className="text-xs uppercase text-silver">{de.healthTitle}</p>
          {!loading && bmi !== null && category ? (
            <>
              <div className="mt-2 flex items-baseline gap-3">
                <p className="font-heading text-3xl font-extrabold">{bmi}</p>
                <p className="text-sm text-silver">
                  {de.bmiLabel} · <span className="font-semibold text-white">{de.bmiCategories[category]}</span>
                </p>
              </div>
              <BmiGauge bmi={bmi} />
              <p className="mt-3 text-xs text-silver">{de.bmiDisclaimer}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-silver">{de.noDataYet}</p>
          )}
        </Card>

        {/* Weekly consistency */}
        <Card>
          <p className="text-xs uppercase text-silver">{de.consistencyLabel}</p>
          {fitness?.daysAvailable ? (
            <>
              <p className="mt-2 font-heading text-2xl font-extrabold">
                {de.workoutsOfGoal.replace("{done}", String(weeklyCompleted)).replace("{goal}", String(fitness.daysAvailable))}
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gold transition-all"
                  style={{ width: `${Math.min(100, (weeklyCompleted / fitness.daysAvailable) * 100)}%` }}
                />
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-silver">{de.noDataYet}</p>
          )}
        </Card>

        {/* Training profile summary */}
        <Card className="lg:col-span-2">
          <p className="text-xs uppercase text-silver">{de.goalSummaryTitle}</p>
          {fitness ? (
            <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-silver">{de.goalLabelText}</dt>
                <dd className="font-semibold">
                  {fitness.goals?.[0] ? dict.onboarding.steps.goal.options[fitness.goals[0]] : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-silver">{de.experienceLabelText}</dt>
                <dd className="font-semibold">
                  {fitness.experience ? dict.onboarding.steps.experience.options[fitness.experience] : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-silver">{de.environmentLabelText}</dt>
                <dd className="font-semibold">
                  {fitness.environment?.length
                    ? fitness.environment.map((e) => dict.onboarding.steps.environment.options[e]).join(", ")
                    : "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-silver">{de.noDataYet}</p>
          )}
        </Card>

        {/* My Workouts preview */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-silver">{dict.myWorkouts.title}</p>
          </div>
          {workouts.length === 0 ? (
            <p className="mt-3 text-sm text-silver">{dict.myWorkouts.empty}</p>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {workouts.slice(0, 3).map((w) => {
                const exerciseCount = new Set(w.sets.map((s) => s.exerciseId)).size;
                return (
                  <Link
                    key={w.id}
                    href={`${base}/treinos/${w.id}`}
                    className="rounded-lg border border-white/10 p-3 transition-colors hover:border-gold/40"
                  >
                    <p className="font-heading text-sm font-bold">{w.name}</p>
                    <p className="mt-1 text-xs text-silver">
                      {dict.myWorkouts.exercisesCount.replace("{count}", String(exerciseCount))}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* FitPulse Tactical status */}
        {(militaryStatus === "active" || militaryStatus === "trialing" || militaryProgram) && (
          <Card className="lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-silver">{dict.military.badge}</p>
                {militaryProgram ? (
                  <p className="mt-1 font-heading text-lg font-bold">{militaryProgram.programName}</p>
                ) : (
                  <p className="mt-1 text-sm text-silver">{dict.militaryProgram.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {(militaryStatus === "active" || militaryStatus === "trialing") && (
                  <Badge variant="success">{militaryStatus}</Badge>
                )}
                <Link href={`${base}/militar/programa`}>
                  <Button variant="primary" size="sm">
                    {militaryProgram ? dict.militaryProgram.title : dict.militaryProgram.generateButton}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Blog teaser */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">{de.blogTeaserTitle}</h2>
          <Link href={`${base}/blog`} className="text-sm font-semibold text-gold hover:underline">
            {de.viewAllPosts}
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`${base}/blog/${post.slug}`}
              className="block rounded-xl border border-white/10 bg-graphite p-5 transition-colors hover:border-gold/40"
            >
              <p className="font-heading text-sm font-bold leading-snug">{post.title}</p>
              <p className="mt-2 text-sm text-silver line-clamp-2">{post.excerpt}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-gold">{de.readMore}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
