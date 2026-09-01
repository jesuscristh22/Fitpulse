import ptBR from "./i18n/pt-BR.json";
import enUS from "./i18n/en-US.json";
import esES from "./i18n/es-ES.json";
import type { LocaleSlug } from "./locales-config";
import { LOCALE_SLUGS } from "./locales-config";

const dictionariesBySlug: Record<LocaleSlug, typeof ptBR> = {
  "pt-br": ptBR,
  en: enUS,
  es: esES,
};

export type Dictionary = typeof ptBR;

export function getDictionary(slug: LocaleSlug): Dictionary {
  return dictionariesBySlug[slug] ?? dictionariesBySlug["pt-br"];
}

export { LOCALE_SLUGS };
