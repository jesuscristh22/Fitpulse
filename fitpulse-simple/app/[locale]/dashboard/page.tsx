import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getDictionary } from "@/lib/i18n";
import { getBlogPosts } from "@/lib/blog-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

// Phase 3-4-5: real auth guard + live Firestore profile data (plan, BMI,
// weekly consistency, training profile) + blog teaser. Workout history/
// completion tracking still pending (Phase 8), shown honestly as "coming soon".
export default async function MemberDashboardPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const blogPosts = (await getBlogPosts(locale)).slice(0, 2);

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon">
        <SiteHeader locale={locale} dict={dict} />
        <DashboardContent locale={locale} dict={dict} blogPosts={blogPosts} />
      </main>
    </RequireAuth>
  );
}
