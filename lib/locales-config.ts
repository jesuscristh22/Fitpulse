import type { SupportedLocale } from "./types";

// URL slug (e.g. /pt-br) <-> internal dictionary locale (e.g. "pt-BR").
// Kept separate from the URL so the URL can stay lowercase/clean.
export const LOCALE_SLUGS = {
  "pt-br": "pt-BR",
  en: "en-US",
  es: "es-ES",
} as const satisfies Record<string, SupportedLocale>;

export type LocaleSlug = keyof typeof LOCALE_SLUGS;

export const DEFAULT_LOCALE_SLUG: LocaleSlug = "pt-br";

export const LOCALE_OPTIONS: { slug: LocaleSlug; label: string; flag: string }[] = [
  { slug: "pt-br", label: "PT-BR", flag: "🇧🇷" },
  { slug: "en", label: "EN", flag: "🇺🇸" },
  { slug: "es", label: "ES", flag: "🇪🇸" },
];

export function isLocaleSlug(value: string): value is LocaleSlug {
  return value in LOCALE_SLUGS;
}
