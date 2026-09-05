import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { CoachClientList } from "@/components/coach/coach-client-list";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function CoachClientsPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon px-6 pb-24 pt-28">
        <SiteHeader locale={locale} dict={dict} />
        <div className="mx-auto max-w-[112rem]">
          <h1 className="font-heading text-2xl font-bold">{dict.coach.clients.title}</h1>
          <div className="mt-8">
            <CoachClientList dict={dict} />
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
