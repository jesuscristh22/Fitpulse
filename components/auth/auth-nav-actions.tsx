"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Zap, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useAuth } from "@/lib/auth-context";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

// Swaps the header's right-side actions based on auth state, so a signed-in
// person can browse the whole marketing site without ever needing to sign
// out first. Logged-in actions are consolidated into one dropdown instead of
// several separate links, to keep the header from getting crowded.
export function AuthNavActions({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const base = `/${locale}`;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (loading) {
    return <div className="hidden h-9 w-24 sm:block" />; // avoid layout shift while auth resolves
  }

  if (user) {
    return (
      <div ref={ref} className="relative hidden sm:block">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 text-sm text-silver hover:text-white"
        >
          <User size={16} /> <ChevronDown size={14} />
        </button>
        {open && (
          <ul className="absolute right-0 top-full z-30 mt-3 w-48 overflow-hidden rounded-md border border-white/10 bg-graphite shadow-xl">
            <li>
              <Link href={`${base}/dashboard`} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-white hover:bg-white/5">
                {dict.nav.dashboard}
              </Link>
            </li>
            <li>
              <Link href={`${base}/treinos`} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-white hover:bg-white/5">
                {dict.nav.myWorkouts}
              </Link>
            </li>
            <li>
              <Link href={`${base}/calendario`} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-white hover:bg-white/5">
                {dict.calendar.navLabel}
              </Link>
            </li>
            <li>
              <Link href={`${base}/perfil`} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-white hover:bg-white/5">
                {dict.profile.navLabel}
              </Link>
            </li>
            <li>
              <Link href={`${base}/militar/programa`} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-white hover:bg-white/5">
                {dict.militaryProgram.title}
              </Link>
            </li>
            <li className="border-t border-white/10 px-4 py-2.5">
              <SignOutButton locale={locale} label={dict.authForm.signOut} />
            </li>
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-3 sm:flex">
      <Link href={`${base}/login`} className="text-sm text-silver hover:text-white">
        {dict.nav.login}
      </Link>
      <Link href={`${base}/signup`}>
        <Button size="sm" variant="primary" className="gap-1.5">
          <Zap size={14} className="fill-carbon" /> {dict.nav.cta}
        </Button>
      </Link>
    </div>
  );
}
