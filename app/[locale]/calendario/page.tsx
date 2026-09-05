import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { TrainingCalendar } from "@/components/calendar/training-calendar";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function CalendarPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon px-6 pb-24 pt-28">
        <SiteHeader locale={locale} dict={dict} />
        <div className="mx-auto max-w-[112rem]">
          <h1 className="font-heading text-2xl font-bold">{dict.calendar.title}</h1>
          <p className="mt-1 text-sm text-silver">{dict.calendar.subtitle}</p>
          <div className="mt-8">
            <TrainingCalendar locale={locale} dict={dict} />
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
