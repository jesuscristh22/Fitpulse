import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function SignupPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <main className="min-h-screen bg-carbon">
      <SiteHeader locale={locale} dict={dict} />
      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <Card className="w-full max-w-sm">
          <h1 className="mb-6 text-center font-heading text-2xl font-bold">{dict.nav.cta}</h1>

          {/* [CONFIGURATION REQUIRED] Google Auth provides name/email/photo only.
              Birth date, gender, height, weight, country are collected in onboarding (Phase 4). */}
          <Button type="button" variant="secondary" className="w-full">
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase text-silver">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="h-12 rounded-md border border-white/10 bg-carbon px-4 text-sm outline-none focus:border-gold"
            />
            <input
              type="password"
              placeholder="Password"
              className="h-12 rounded-md border border-white/10 bg-carbon px-4 text-sm outline-none focus:border-gold"
            />
            <Button type="submit" variant="primary" className="w-full">
              {dict.nav.cta}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-silver">
            Already have an account?{" "}
            <Link href={`${base}/login`} className="text-gold hover:underline">
              {dict.nav.login}
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
