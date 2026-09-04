import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function PricingPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-36 text-center sm:px-10 sm:pt-44">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">{dict.pages.pricing.title}</p>
        <h1 className="mx-auto mt-4 max-w-2xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          {dict.pages.pricing.headline}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-silver">{dict.pages.pricing.subtext}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 sm:pb-32">
        <PricingPlans locale={locale} dict={dict} />
        <p className="mt-8 text-center text-xs text-silver/60">
          [CONFIGURATION REQUIRED] — prices shown are launch suggestions and are editable by Super Admin.
        </p>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
