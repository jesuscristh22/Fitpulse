import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { ExerciseVideoPlayer } from "@/components/ui/video-player";
import { getDictionary } from "@/lib/i18n";
import { getExercise, getExercises } from "@/lib/exercise-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default async function ExerciseDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const exercise = await getExercise(locale, params.slug);
  if (!exercise) notFound();

  const lib = dict.library;
  const allExercises = await getExercises(locale);
  const alternatives = allExercises.filter((e) => exercise.alternatives?.includes(e.slug));

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <article className="mx-auto max-w-2xl px-6 pb-24 pt-36 sm:px-10 sm:pt-44">
        <Link href={`/${locale}/exercicios`} className="inline-flex items-center gap-2 text-sm text-silver hover:text-white">
          <ArrowLeft size={14} /> {lib.back}
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <h1 className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl">{exercise.name}</h1>
          <Badge variant="gold">{lib.difficulty[exercise.difficulty]}</Badge>
        </div>
        <p className="mt-2 text-sm text-silver">{lib.categories[exercise.category]}</p>
        <p className="mt-4 text-silver">{exercise.description}</p>

        <div className="mt-6">
          <ExerciseVideoPlayer slug={exercise.slug} title={exercise.name} />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {exercise.muscles.map((m) => (
            <span key={m} className="rounded-full border border-white/10 px-3 py-1 text-xs text-silver">
              {lib.muscles[m as keyof typeof lib.muscles] ?? m}
            </span>
          ))}
        </div>

        <h2 className="mt-10 font-heading text-lg font-bold">{lib.instructionsTitle}</h2>
        <ol className="mt-3 space-y-2">
          {exercise.instructions.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-silver">
              <span className="font-heading font-bold text-gold">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>

        {exercise.safetyNotes && exercise.safetyNotes.length > 0 && (
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <ShieldAlert size={16} /> {lib.safetyTitle}
            </p>
            <ul className="mt-2 space-y-1">
              {exercise.safetyNotes.map((note, i) => (
                <li key={i} className="text-sm text-silver">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {alternatives.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-lg font-bold">{lib.alternativesTitle}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {alternatives.map((alt) => (
                <Link
                  key={alt.slug}
                  href={`/${locale}/exercicios/${alt.slug}`}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:border-gold/60"
                >
                  {alt.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
