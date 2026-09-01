"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { LOCALE_OPTIONS, type LocaleSlug } from "@/lib/locales-config";

export function LanguageSwitcher({ current }: { current: LocaleSlug }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const currentOption = LOCALE_OPTIONS.find((o) => o.slug === current) ?? LOCALE_OPTIONS[0];

  function switchTo(slug: LocaleSlug) {
    setOpen(false);
    // Replace the leading locale segment, keep the rest of the path.
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${slug}${rest ? `/${rest}` : ""}`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md border border-white/10 bg-graphite px-3 py-2 text-sm text-white hover:border-gold/50"
      >
        <span>{currentOption.flag}</span>
        <span className="font-semibold">{currentOption.label}</span>
        <ChevronDown size={14} className="text-silver" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-30 mt-2 w-32 overflow-hidden rounded-md border border-white/10 bg-graphite shadow-xl"
        >
          {LOCALE_OPTIONS.map((option) => (
            <li key={option.slug}>
              <button
                type="button"
                onClick={() => switchTo(option.slug)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white hover:bg-white/5"
              >
                <span>{option.flag}</span>
                <span>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
