import Image from "next/image";
import { Dumbbell, Activity, Users, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

const cardIcons = [Dumbbell, Activity, Users, ShieldCheck];
const images = [
  "/images/feature-dumbbell.jpg",
  "/images/feature-phoneapp.jpg",
  "/images/feature-womanback.jpg",
  "/images/feature-treadmill.jpg",
];

export default function FeaturesPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-36 sm:px-10 sm:pt-44">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">{dict.pages.features.title}</p>
        <h1 className="mt-4 max-w-2xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          {dict.pages.features.headline}
        </h1>
        <p className="mt-4 max-w-xl text-silver">{dict.pages.features.subtext}</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 sm:pb-32">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {dict.featuresSection.cards.map((card, i) => {
            const Icon = cardIcons[i];
            return (
              <div key={card.title} className="overflow-hidden rounded-2xl border border-white/10 bg-graphite">
                <div className="relative h-56 w-full">
                  <Image src={images[i]} alt={card.title} fill className="object-cover" />
                  <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-gold/40 bg-carbon/80 text-gold">
                    <Icon size={18} />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-base font-bold uppercase">{card.title}</h3>
                  <p className="mt-2 text-sm text-silver">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
