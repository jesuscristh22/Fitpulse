"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useAuth } from "@/lib/auth-context";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

export function MobileNav({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const base = `/${locale}`;

  const links = [
    { href: base, label: dict.nav.home },
    { href: `${base}/exercicios`, label: dict.nav.library },
    { href: `${base}/treinos/funcionais`, label: dict.functionalWorkouts.navLabel },
    { href: `${base}/treinos/danca`, label: dict.dance.navLabel },
    { href: `${base}/militar`, label: dict.military.badge },
    { href: `${base}/planos`, label: dict.nav.pricing },
    { href: `${base}/blog`, label: dict.blog.title },
    { href: `${base}/recursos`, label: dict.nav.features },
    { href: `${base}/sobre`, label: dict.nav.about },
    { href: `${base}/contato`, label: dict.nav.contact },
  ];

  const accountLinks = user
    ? [
        { href: `${base}/dashboard`, label: dict.nav.dashboard },
        { href: `${base}/treinos`, label: dict.nav.myWorkouts },
        { href: `${base}/calendario`, label: dict.calendar.navLabel },
        { href: `${base}/perfil`, label: dict.profile.navLabel },
        { href: `${base}/progresso`, label: dict.progress.title },
        { href: `${base}/copiloto`, label: dict.copilot.navLabel },
      ]
    : [
        { href: `${base}/login`, label: dict.nav.login },
        { href: `${base}/signup`, label: dict.nav.cta },
      ];

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="text-white"
      >
        <Menu size={26} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-carbon">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-heading text-lg font-extrabold">
              FIT<span className="text-gold">PULSE</span>
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="text-white">
              <X size={26} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-lg text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-1 border-t border-white/10 px-6 py-4">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-lg text-gold"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="py-3">
                <SignOutButton locale={locale} label={dict.authForm.signOut} />
              </div>
            )}
          </div>

          <div className="px-6 py-4">
            <LanguageSwitcher current={locale} />
          </div>
        </div>
      )}
    </div>
  );
}
