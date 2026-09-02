"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useAuth } from "@/lib/auth-context";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

// Swaps the header's right-side actions based on auth state, so a signed-in
// person can browse the whole marketing site (Home, Recursos, Planos...)
// without ever needing to sign out first.
export function AuthNavActions({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const { user, loading } = useAuth();
  const base = `/${locale}`;

  if (loading) {
    return <div className="h-9 w-24" />; // avoid layout shift while auth resolves
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href={`${base}/dashboard`} className="hidden text-sm text-silver hover:text-white sm:block">
          {dict.nav.dashboard}
        </Link>
        <SignOutButton locale={locale} label={dict.authForm.signOut} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href={`${base}/login`} className="hidden text-sm text-silver hover:text-white sm:block">
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
