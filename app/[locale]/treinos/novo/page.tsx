import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { WorkoutBuilder } from "@/components/workouts/workout-builder";
import { getDictionary } from "@/lib/i18n";
import { getExercises } from "@/lib/exercise-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default async function NewWorkoutPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const exercises = await getExercises(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon">
        <SiteHeader locale={locale} dict={dict} />
        <WorkoutBuilder locale={locale} dict={dict} exercises={exercises} />
      </main>
    </RequireAuth>
  );
}
