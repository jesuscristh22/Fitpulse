import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { MyWorkoutsList } from "@/components/workouts/my-workouts-list";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function MyWorkoutsPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon">
        <SiteHeader locale={locale} dict={dict} />
        <MyWorkoutsList locale={locale} dict={dict} />
      </main>
    </RequireAuth>
  );
}
