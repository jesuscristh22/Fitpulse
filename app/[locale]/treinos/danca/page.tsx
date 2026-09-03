import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/i18n";
import { getDanceRoutines } from "@/lib/dance-content";
import { buildExerciseVideoSearchUrl } from "@/lib/youtube-search-link";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";

// Public, free — dance-based functional training classes. Moves link to a
// YouTube search (not embedded/curated video), same approach as the
// Military generator, since verifying dance-instructor videos per move
// across 3 languages isn't something we can do reliably yet.
export default function DancePage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const routines = getDanceRoutines(locale);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-36 sm:px-10 sm:pt-44">
        <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">{dict.dance.title}</h1>
        <p className="mt-4 max-w-xl text-silver">{dict.dance.subtitle}</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 sm:pb-32">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <Card key={routine.slug} className="flex flex-col">
              <div className="flex items-start justify-between">
                <h3 className="font-heading text-base font-bold">{routine.name}</h3>
                <Badge variant="success">{dict.functionalWorkouts.freeBadge}</Badge>
              </div>
              <p className="mt-2 text-sm text-silver">{routine.description}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-silver">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {routine.estimatedMinutes} {dict.functionalWorkouts.minutesLabel}
                </span>
                <Badge variant="gold">{dict.library.difficulty[routine.difficulty]}</Badge>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase text-silver">{dict.dance.movesLabel}</p>
              <ul className="mt-2 flex-1 space-y-1">
                {routine.moves.map((move) => (
                  <li key={move}>
                    <a
                      href={buildExerciseVideoSearchUrl(move, locale, "dance class")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-silver hover:text-gold hover:underline"
                    >
                      {move}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
