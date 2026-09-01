import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

export function SiteHeader({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href={base} className="flex items-center gap-3">
          <Image src="/images/app-icon.png" alt="FitPulse" width={40} height={40} className="rounded-lg" />
          <div className="leading-tight">
            <p className="font-heading text-lg font-extrabold tracking-tight">
              FIT<span className="text-gold">PULSE</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-silver">
              Train · Evolve · Live Better
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 text-sm text-silver md:flex">
          <Link href={base} className="hover:text-white">{dict.nav.home}</Link>
          <Link href={`${base}/recursos`} className="hover:text-white">{dict.nav.features}</Link>
          <Link href={`${base}/planos`} className="hover:text-white">{dict.nav.pricing}</Link>
          <Link href={`${base}/sobre`} className="hover:text-white">{dict.nav.about}</Link>
          <Link href={`${base}/contato`} className="hover:text-white">{dict.nav.contact}</Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher current={locale} />
          <Link href={`${base}/login`} className="hidden text-sm text-silver hover:text-white sm:block">
            {dict.nav.login}
          </Link>
          <Link href={`${base}/signup`}>
            <Button size="sm" variant="primary" className="gap-1.5">
              <Zap size={14} className="fill-carbon" /> {dict.nav.cta}
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
