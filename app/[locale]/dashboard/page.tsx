import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/auth/require-auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

// Phase 3: real auth guard (client-side). Real data wiring (Firestore reads,
// FitPulse Score calculation, coach/gym state) arrives in Phase 5+.
export default function MemberDashboardPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold">
              {dict.dashboard.greeting}, <span className="text-gold">Diego</span>
            </h1>
            <SignOutButton locale={locale} label={dict.authForm.signOut} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <p className="text-xs uppercase text-silver">{dict.hero.overallProgressLabel}</p>
              <p className="mt-2 font-heading text-5xl font-extrabold text-gold">84</p>
            </Card>
            <Card className="sm:col-span-2">
              <p className="text-xs uppercase text-silver">{dict.hero.nextWorkoutLabel}</p>
              <p className="mt-2 font-heading text-xl font-bold">{dict.hero.nextWorkoutName}</p>
              <p className="mt-1 text-sm text-silver">{dict.hero.nextWorkoutMeta}</p>
              <Button variant="primary" size="md" className="mt-4">
                {dict.hero.ctaSecondary}
              </Button>
            </Card>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {dict.miniFeatures.map((f) => (
              <Card key={f.title} className="text-center">
                <p className="font-heading text-sm font-semibold">{f.title}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
