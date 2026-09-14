import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RequireAuth } from "@/components/auth/require-auth";
import { ExerciseLibraryClient } from "@/components/exercises/exercise-library-client";
import { getDictionary } from "@/lib/i18n";
import { getExercises } from "@/lib/exercise-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

// Business decision (Diego, Sept 2026): the exercise library is now open to
// every logged-in member, free or paying — it's the freemium "look around"
// layer. What's still paid is the AI-generated program itself, gated
// separately at generation time (military/generate and copilot/adapt), not
// here.
export default async function ExerciseLibraryPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const exercises = await getExercises(locale);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />
      <RequireAuth locale={locale}>
        <section className="mx-auto max-w-[112rem] px-6 pb-8 pt-36 sm:px-10 sm:pt-44">
          <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">{dict.library.title}</h1>
          <p className="mt-4 max-w-xl text-silver">{dict.library.subtitle}</p>
        </section>

        <section className="mx-auto max-w-[112rem] px-6 pb-24 sm:px-10 sm:pb-32">
          <ExerciseLibraryClient locale={locale} dict={dict} exercises={exercises} />
        </section>
      </RequireAuth>
      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
