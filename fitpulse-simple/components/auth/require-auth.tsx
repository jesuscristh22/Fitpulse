"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { LocaleSlug } from "@/lib/locales-config";

// Client-side route guard for Phase 3. Good enough while there's no
// server-rendered private data on the page yet; a server-verified session
// cookie can replace this once dashboard pages start reading Firestore
// server-side.
export function RequireAuth({
  locale,
  children,
}: {
  locale: LocaleSlug;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [loading, user, locale, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-carbon text-sm text-silver">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
