import Image from "next/image";
import Link from "next/link";
import { Zap, Play, Target, TrendingUp, Dumbbell, Activity, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

const miniFeatureIcons = [Dumbbell, Activity, Users, ShieldCheck];
const cardIcons = [Dumbbell, TrendingUp, Users, ShieldCheck];

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden pb-20 pt-36 sm:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-gold/5 blur-3xl"
        />
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-8">
          {/* Left: copy */}
          <div className="animate-hero-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-graphite px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gold">
              <Zap size={13} className="fill-gold" />
              {dict.hero.eyebrow}
            </div>

            <h1 className="mt-6 font-heading text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {dict.hero.headlineLine1}
              <br />
              <span className="text-gold">{dict.hero.headlineHighlight1}</span>{" "}
              {dict.hero.headlineMid}{" "}
              <span className="text-gold">{dict.hero.headlineHighlight2}</span>
            </h1>

            <p className="mt-6 max-w-md text-lg text-silver">{dict.hero.subtext}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={`${base}/signup`}>
                <Button size="lg" variant="primary" className="gap-2">
                  <Zap size={16} className="fill-carbon" /> {dict.hero.ctaPrimary}
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Play size={14} className="fill-white" /> {dict.hero.ctaSecondary}
                </Button>
              </Link>
            </div>

            {/* Mini feature strip */}
            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {dict.miniFeatures.map((feature, i) => {
                const Icon = miniFeatureIcons[i];
                return (
                  <div key={feature.title} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Icon size={16} />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-white">{feature.title}</p>
                      <p className="text-xs text-silver">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: hero image + floating stat cards */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/hero-couple.jpg"
                alt="FitPulse members training with dumbbells"
                width={1510}
                height={414}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            {/* Floating cards — desktop only, absolutely positioned like the reference */}
            <div className="pointer-events-none absolute -right-6 -top-8 hidden w-52 rounded-xl border border-white/10 bg-graphite/95 p-4 shadow-2xl backdrop-blur lg:block">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wide text-silver">{dict.hero.weeklyGoalLabel}</p>
                <Target size={16} className="text-gold" />
              </div>
              <p className="mt-1 font-heading text-xl font-extrabold">{dict.hero.weeklyGoalValue}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-4/5 rounded-full bg-gold" />
              </div>
            </div>

            <div className="pointer-events-none absolute -right-6 top-32 hidden w-52 rounded-xl border border-white/10 bg-graphite/95 p-4 shadow-2xl backdrop-blur lg:block">
              <p className="text-[11px] uppercase tracking-wide text-silver">{dict.hero.caloriesLabel}</p>
              <p className="mt-1 font-heading text-xl font-extrabold">
                {dict.hero.caloriesValue} <span className="text-xs font-normal text-silver">{dict.hero.caloriesTarget}</span>
              </p>
              <svg viewBox="0 0 100 30" className="mt-2 h-8 w-full">
                <polyline
                  fill="none"
                  stroke="#E8A942"
                  strokeWidth="2"
                  points="0,26 15,24 30,20 45,22 60,14 75,10 90,4 100,2"
                />
              </svg>
            </div>

            <div className="pointer-events-none absolute -bottom-6 -left-6 hidden w-56 items-center gap-3 rounded-xl border border-white/10 bg-graphite/95 p-4 shadow-2xl backdrop-blur lg:flex">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image src="/images/feature-treadmill.jpg" alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-silver">{dict.hero.nextWorkoutLabel}</p>
                <p className="font-heading text-sm font-bold">{dict.hero.nextWorkoutName}</p>
                <p className="text-[11px] text-silver">{dict.hero.nextWorkoutMeta}</p>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-10 right-10 hidden w-48 rounded-xl border border-white/10 bg-graphite/95 p-4 shadow-2xl backdrop-blur lg:block">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wide text-silver">{dict.hero.overallProgressLabel}</p>
                <TrendingUp size={16} className="text-gold" />
              </div>
              <p className="mt-1 font-heading text-xl font-extrabold">{dict.hero.overallProgressValue}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[78%] rounded-full bg-gold" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES GRID ---------------- */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-28">
        <div className="max-w-xl">
          <p className="inline-block rounded-full border border-white/10 bg-graphite px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
            {dict.featuresSection.eyebrow}
          </p>
          <h2 className="mt-5 font-heading text-3xl font-extrabold uppercase leading-tight sm:text-4xl">
            {dict.featuresSection.headline} <span className="text-gold">{dict.featuresSection.headlineHighlight}</span>
          </h2>
          <p className="mt-4 text-silver">{dict.featuresSection.subtext}</p>
          <Link
            href={`${base}/recursos`}
            className="mt-6 inline-block rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold hover:border-gold"
          >
            {dict.featuresSection.cta}
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.featuresSection.cards.map((card, i) => {
            const Icon = cardIcons[i];
            const images = [
              "/images/feature-dumbbell.jpg",
              "/images/feature-phoneapp.jpg",
              "/images/feature-womanback.jpg",
              "/images/feature-treadmill.jpg",
            ];
            return (
              <div key={card.title} className="overflow-hidden rounded-2xl border border-white/10 bg-graphite">
                <div className="relative h-40 w-full">
                  <Image src={images[i]} alt={card.title} fill className="object-cover" />
                  <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 bg-carbon/80 text-gold">
                    <Icon size={16} />
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-sm font-bold uppercase">{card.title}</h3>
                  <p className="mt-2 text-sm text-silver">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- MANIFESTO BREAK ---------------- */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden py-20">
        <Image
          src="/images/never-give-up.jpg"
          alt="Never Give Up neon sign at a FitPulse gym"
          fill
          className="object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-carbon/75" />
        <p className="relative z-10 max-w-2xl px-6 text-center font-heading text-3xl font-extrabold leading-tight sm:text-5xl">
          {dict.manifesto}
        </p>
      </section>

      {/* ---------------- SCORE SECTION ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <h2 className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
              {dict.scoreSection.headline}
            </h2>
            <p className="mt-4 max-w-md text-silver">{dict.scoreSection.subtext}</p>
            <ul className="mt-8 space-y-4 text-sm">
              {dict.scoreSection.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span className="text-silver">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 overflow-hidden rounded-2xl lg:order-2">
            <Image src="/images/dashboard.jpg" alt="FitPulse Score dashboard" width={900} height={600} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIAL ---------------- */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
          <Image src="/images/back-shirt.jpg" alt="FitPulse member training" fill className="object-cover object-[60%_20%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/60 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center px-6 sm:px-10 lg:px-16">
            <p className="font-heading text-xl font-bold leading-snug sm:text-2xl">&quot;{dict.testimonial.quote}&quot;</p>
            <p className="mt-4 text-sm text-silver">{dict.testimonial.author}</p>
          </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center sm:px-10 sm:py-28">
        <h2 className="mx-auto max-w-xl font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
          {dict.finalCta.headline}
        </h2>
        <div className="mt-8 flex justify-center">
          <Link href={`${base}/signup`}>
            <Button size="lg" variant="primary" className="gap-2">
              <Zap size={16} className="fill-carbon" /> {dict.finalCta.cta}
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
