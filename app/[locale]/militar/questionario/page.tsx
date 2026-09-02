import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { MilitaryIntakeWizard } from "@/components/military/military-intake-wizard";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function MilitaryQuestionnairePage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon px-6 pb-24 pt-28">
        <SiteHeader locale={locale} dict={dict} />
        <div className="mx-auto max-w-lg pt-8 text-center">
          <h1 className="font-heading text-2xl font-bold">{dict.militaryIntake.title}</h1>
          <p className="mt-2 text-sm text-silver">{dict.militaryIntake.subtitle}</p>
        </div>
        <div className="mt-10">
          <MilitaryIntakeWizard dict={dict} />
        </div>
      </main>
    </RequireAuth>
  );
}
