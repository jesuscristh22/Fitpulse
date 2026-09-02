import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

// Public landing page (§97 Military Landing). Payment (Phase 10) and AI
// generation (Phase 11) aren't built yet — the CTA leads to the intake
// questionnaire only.
export default function MilitaryLandingPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const mil = dict.military;
  const base = `/${locale}`;

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="relative overflow-hidden pb-20 pt-36 sm:pt-44">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-block rounded-full border border-gold/40 bg-graphite px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
              {mil.badge}
            </p>
            <h1 className="mt-5 font-heading text-5xl font-extrabold uppercase leading-[0.95] sm:text-6xl">
              {mil.headline}
              <br />
              <span className="text-gold">{mil.headlineHighlight}</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-silver">{mil.subheadline}</p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-heading text-3xl font-extrabold">{mil.price}</span>
              <span className="text-sm text-silver">{mil.priceNote}</span>
            </div>

            <Link href={`${base}/militar/questionario`}>
              <Button size="lg" variant="primary" className="mt-8">
                {mil.cta}
              </Button>
            </Link>

            <ul className="mt-10 space-y-3">
              {mil.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-silver">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold" /> {f}
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-md text-xs text-silver/60">{mil.disclaimer}</p>
          </div>

          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/never-give-up.jpg"
              alt="FitPulse Tactical"
              width={900}
              height={700}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
