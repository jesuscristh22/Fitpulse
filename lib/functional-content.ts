import type { LocaleSlug } from "./locales-config";

interface FunctionalTemplateText {
  slug: string;
  name: string;
  description: string;
}

export const FUNCTIONAL_TEMPLATE_TEXT: Record<LocaleSlug, FunctionalTemplateText[]> = {
  "pt-br": [
    { slug: "iniciante-funcional", name: "Funcional Iniciante", description: "Um treino curto e simples pra quem está começando — só peso corporal." },
    { slug: "hiit-funcional", name: "HIIT Funcional", description: "Circuito intenso pra elevar o condicionamento em pouco tempo." },
    { slug: "full-body-funcional", name: "Full Body Funcional", description: "Treino completo pro corpo todo, sem precisar de nenhum equipamento." },
  ],
  en: [
    { slug: "iniciante-funcional", name: "Beginner Functional", description: "A short, simple workout for getting started — bodyweight only." },
    { slug: "hiit-funcional", name: "Functional HIIT", description: "An intense circuit to build conditioning in a short time." },
    { slug: "full-body-funcional", name: "Full Body Functional", description: "A complete full-body workout with no equipment needed." },
  ],
  es: [
    { slug: "iniciante-funcional", name: "Funcional Principiante", description: "Un entreno corto y simple para empezar — solo peso corporal." },
    { slug: "hiit-funcional", name: "HIIT Funcional", description: "Un circuito intenso para mejorar tu condición en poco tiempo." },
    { slug: "full-body-funcional", name: "Full Body Funcional", description: "Un entreno completo de cuerpo entero sin necesitar ningún equipo." },
  ],
};

export function getFunctionalTemplateText(locale: LocaleSlug, slug: string): FunctionalTemplateText | undefined {
  return FUNCTIONAL_TEMPLATE_TEXT[locale]?.find((t) => t.slug === slug);
}
