import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { CopilotChat } from "@/components/copilot/copilot-chat";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function CopilotPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon px-6 pb-24 pt-28">
        <SiteHeader locale={locale} dict={dict} />
        <div className="mx-auto max-w-2xl pb-8 text-center">
          <h1 className="font-heading text-2xl font-bold">{dict.copilot.title}</h1>
          <p className="mt-2 text-sm text-silver">{dict.copilot.subtitle}</p>
        </div>
        <CopilotChat locale={locale} dict={dict} />
      </main>
    </RequireAuth>
  );
}
