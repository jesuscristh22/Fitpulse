import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ExerciseLibraryClient } from "@/components/exercises/exercise-library-client";
import { getDictionary } from "@/lib/i18n";
import { getExercises } from "@/lib/exercise-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

// Public catalog — no login required, matching §25/§65 (exercises collection
// is publicly readable). Filtering happens client-side against the full list.
export default async function ExerciseLibraryPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const exercises = await getExercises();

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-36 sm:px-10 sm:pt-44">
        <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">{dict.library.title}</h1>
        <p className="mt-4 max-w-xl text-silver">{dict.library.subtitle}</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 sm:pb-32">
        <ExerciseLibraryClient locale={locale} dict={dict} exercises={exercises} />
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
