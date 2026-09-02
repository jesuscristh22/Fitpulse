import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FunctionalWorkoutCard } from "@/components/workouts/functional-workout-card";
import { getDictionary } from "@/lib/i18n";
import { getFunctionalTemplates } from "@/lib/functional-templates-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

// Public page — anyone can browse; starting a workout clones it into the
// person's own account (requires login, handled inside FunctionalWorkoutCard).
export default async function FunctionalWorkoutsPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const templates = await getFunctionalTemplates(locale);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-36 sm:px-10 sm:pt-44">
        <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          {dict.functionalWorkouts.title}
        </h1>
        <p className="mt-4 max-w-xl text-silver">{dict.functionalWorkouts.subtitle}</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 sm:pb-32">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <FunctionalWorkoutCard key={template.slug} locale={locale} dict={dict} template={template} />
          ))}
        </div>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
