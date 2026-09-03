import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthNavActions } from "@/components/auth/auth-nav-actions";
import { NavMoreMenu } from "@/components/nav-more-menu";
import { MobileNav } from "@/components/mobile-nav";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

export function SiteHeader({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-[100rem] items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:px-14">
        <Link href={base} className="flex shrink-0 items-center gap-3">
          <Image src="/images/app-icon.png" alt="FitPulse" width={40} height={40} className="rounded-lg" />
          <div className="hidden leading-tight sm:block">
            <p className="font-heading text-lg font-extrabold tracking-tight">
              FIT<span className="text-gold">PULSE</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-silver">
              Train · Evolve · Live Better
            </p>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 whitespace-nowrap text-sm text-silver xl:flex">
          <Link href={base} className="hover:text-white">{dict.nav.home}</Link>
          <Link href={`${base}/exercicios`} className="hover:text-white">{dict.nav.library}</Link>
          <Link href={`${base}/treinos/funcionais`} className="hover:text-white">{dict.functionalWorkouts.navLabel}</Link>
          <Link href={`${base}/treinos/danca`} className="hover:text-white">{dict.dance.navLabel}</Link>
          <Link href={`${base}/militar`} className="hover:text-white">{dict.military.badge}</Link>
          <Link href={`${base}/planos`} className="hover:text-white">{dict.nav.pricing}</Link>
          <Link href={`${base}/blog`} className="hover:text-white">{dict.blog.title}</Link>
          <NavMoreMenu
            label={dict.nav.more}
            items={[
              { href: `${base}/recursos`, label: dict.nav.features },
              { href: `${base}/sobre`, label: dict.nav.about },
              { href: `${base}/contato`, label: dict.nav.contact },
            ]}
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher current={locale} />
          </div>
          <AuthNavActions locale={locale} dict={dict} />
          <MobileNav locale={locale} dict={dict} />
        </div>
      </nav>
    </header>
  );
}
