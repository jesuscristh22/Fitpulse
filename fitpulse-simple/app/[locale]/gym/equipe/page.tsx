import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { GymTeamView } from "@/components/gym/gym-team-view";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function GymTeamPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon px-6 pb-24 pt-28">
        <SiteHeader locale={locale} dict={dict} />
        <GymTeamView locale={locale} dict={dict} />
      </main>
    </RequireAuth>
  );
}
