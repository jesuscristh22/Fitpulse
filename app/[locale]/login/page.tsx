import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function LoginPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <main className="min-h-screen bg-carbon">
      <SiteHeader locale={locale} dict={dict} />
      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <Card className="w-full max-w-sm">
          <h1 className="mb-6 text-center font-heading text-2xl font-bold">{dict.nav.login}</h1>

          {/* [CONFIGURATION REQUIRED] wired to Firebase signInWithPopup(GoogleAuthProvider) in Phase 3 */}
          <Button type="button" variant="secondary" className="w-full">
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase text-silver">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* [CONFIGURATION REQUIRED] wired to Firebase signInWithEmailAndPassword in Phase 3 */}
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
              {dict.nav.login}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-silver">
            New to FitPulse?{" "}
            <Link href={`${base}/signup`} className="text-gold hover:underline">
              {dict.nav.cta}
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
