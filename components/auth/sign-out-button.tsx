"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";
import type { LocaleSlug } from "@/lib/locales-config";

export function SignOutButton({ locale, label }: { locale: LocaleSlug; label: string }) {
  const router = useRouter();

  async function handleClick() {
    await signOut(auth);
    router.push(`/${locale}/login`);
  }

  return (
    <button onClick={handleClick} className="text-sm text-silver hover:text-white">
      {label}
    </button>
  );
}
