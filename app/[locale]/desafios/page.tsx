import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { ChallengesView } from "@/components/challenges/challenges-view";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function ChallengesPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon px-6 pb-24 pt-28">
        <SiteHeader locale={locale} dict={dict} />
        <div className="mx-auto max-w-7xl">
          <h1 className="font-heading text-2xl font-bold">{dict.challenges.title}</h1>
          <p className="mt-1 text-sm text-silver">{dict.challenges.subtitle}</p>
          <div className="mt-8">
            <ChallengesView locale={locale} dict={dict} />
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
