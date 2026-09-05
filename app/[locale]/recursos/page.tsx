import Image from "next/image";
import Link from "next/link";
import { Dumbbell, Activity, Users, ShieldCheck, Music2, Shield, ListChecks, CalendarDays, HeartPulse, Newspaper, ArrowRight } from "lucide-react";
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
  const base = `/${locale}`;

  // Real, live features on the site today — not marketing copy, actual links.
  const realFeatures = [
    { icon: Dumbbell, title: dict.nav.library, desc: dict.library.subtitle, href: `${base}/exercicios` },
    { icon: Activity, title: dict.functionalWorkouts.title, desc: dict.functionalWorkouts.subtitle, href: `${base}/treinos/funcionais` },
    { icon: Music2, title: dict.dance.title, desc: dict.dance.subtitle, href: `${base}/treinos/danca` },
    { icon: Shield, title: dict.military.badge, desc: dict.military.subheadline, href: `${base}/militar` },
    { icon: ListChecks, title: dict.myWorkouts.title, desc: dict.pages.features.myWorkoutsDesc, href: `${base}/treinos` },
    { icon: CalendarDays, title: dict.calendar.title, desc: dict.calendar.subtitle, href: `${base}/calendario` },
    { icon: HeartPulse, title: dict.profile.title, desc: dict.profile.subtitle, href: `${base}/perfil` },
    { icon: Newspaper, title: dict.blog.title, desc: dict.blog.subtitle, href: `${base}/blog` },
  ];

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="mx-auto max-w-[112rem] px-6 pb-16 pt-36 sm:px-10 sm:pt-44">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">{dict.pages.features.title}</p>
        <h1 className="mt-4 max-w-2xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          {dict.pages.features.headline}
        </h1>
        <p className="mt-4 max-w-xl text-silver">{dict.pages.features.subtext}</p>
      </section>

      <section className="mx-auto max-w-[112rem] px-6 pb-16 sm:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {dict.featuresSection.cards.map((card, i) => {
            const Icon = cardIcons[i];
            return (
              <div key={card.title} className="overflow-hidden rounded-2xl border border-white/10 bg-graphite">
                <div className="relative h-56 w-full">
                  <Image src={images[i]} alt={card.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
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

      {/* Real, clickable feature map of the whole site */}
      <section className="mx-auto max-w-[112rem] px-6 pb-24 sm:px-10 sm:pb-32">
        <h2 className="font-heading text-2xl font-extrabold">{dict.pages.features.realFeaturesTitle}</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {realFeatures.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group flex flex-col rounded-xl border border-white/10 bg-graphite p-5 transition-colors hover:border-gold/40"
            >
              <f.icon size={20} className="text-gold" />
              <h3 className="mt-3 font-heading text-sm font-bold">{f.title}</h3>
              <p className="mt-2 flex-1 text-xs text-silver">{f.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
