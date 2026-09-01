import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "@/components/auth/login-form";
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

          <LoginForm
            locale={locale}
            labels={{
              google: dict.authForm.google,
              email: dict.authForm.email,
              password: dict.authForm.password,
              submit: dict.authForm.loginSubmit,
              error: dict.authForm.error,
            }}
          />

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
