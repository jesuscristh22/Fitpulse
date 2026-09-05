import Image from "next/image";
import { Dumbbell, HeartPulse, TrendingUp, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

const pillars = [
  { icon: Dumbbell, key: 0 },
  { icon: HeartPulse, key: 1 },
  { icon: TrendingUp, key: 2 },
  { icon: Users, key: 3 },
];

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const pillarLabels = dict.pages.about.headline.split(". ").filter(Boolean);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
        <div className="mx-auto grid max-w-[112rem] grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">{dict.pages.about.title}</p>
            <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
              {dict.pages.about.headline}
            </h1>
            <p className="mt-6 max-w-md text-silver">{dict.pages.about.body}</p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {pillars.map(({ icon: Icon, key }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-semibold">{pillarLabels[key] ?? ""}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/reception.jpg"
              alt="FitPulse studio"
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
