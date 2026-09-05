import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ExerciseGenerator } from "@/components/exercises/exercise-generator";
import { getDictionary } from "@/lib/i18n";
import { getExercises } from "@/lib/exercise-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

// Public, no login required — the free-tier alternative to the full
// (paid-only) exercise library at /exercicios.
export default async function ExerciseGeneratorPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const exercises = await getExercises(locale);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="mx-auto max-w-[112rem] px-6 pb-24 pt-36 text-center sm:px-10 sm:pt-44">
        <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">{dict.library.generatorTitle}</h1>
        <p className="mx-auto mt-4 max-w-xl text-silver">{dict.library.generatorSubtitle}</p>

        <div className="mt-12">
          <ExerciseGenerator locale={locale} dict={dict} exercises={exercises} />
        </div>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
