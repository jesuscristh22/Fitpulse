import { RequireAuth } from "@/components/auth/require-auth";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function OnboardingPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon">
        <OnboardingWizard locale={locale} dict={dict} />
      </main>
    </RequireAuth>
  );
}
