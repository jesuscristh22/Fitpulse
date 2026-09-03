import type { LocaleSlug } from "./locales-config";

export interface DanceRoutine {
  slug: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  moves: string[];
  // [CONFIGURATION REQUIRED] YouTube video ID for a real class recording of
  // this routine — left undefined until real footage exists.
  videoId?: string;
}

// Dance-based functional training — a distinct category from calisthenics/
// strength, matching real classes taught by PE/dance instructors (Zumba,
// dance cardio, Latin rhythms). Each move links to a YouTube search rather
// than an embedded video, same approach as the Military generator.
export const DANCE_ROUTINES: Record<LocaleSlug, DanceRoutine[]> = {
  "pt-br": [
    {
      slug: "danca-funcional-iniciante",
      name: "Dança Funcional Iniciante",
      description: "Uma aula leve pra quem nunca dançou treinando — combina passos simples com movimento funcional.",
      estimatedMinutes: 20,
      difficulty: "beginner",
      videoId: "aOFWraYaD-A", // "Como dançar forró: aprenda o Passo Básico"
      moves: ["Passo básico de forró", "Marcha com balanço de braços", "Passo lateral com agachamento", "Alongamento dançado"],
    },
    {
      slug: "zumba-cardio",
      name: "Zumba Cardio",
      description: "Aula de cardio dançante, no estilo Zumba, pra elevar a frequência cardíaca se divertindo.",
      estimatedMinutes: 30,
      difficulty: "intermediate",
      videoId: "6RQuxxZgJjk", // "Em Dança: Aprenda o passo básico da Salsa"
      moves: ["Salsa básico", "Merengue marchado", "Reggaeton perreo básico", "Cumbia passo cruzado"],
    },
    {
      slug: "ritmos-latinos-forca",
      name: "Ritmos Latinos + Força",
      description: "Combina coreografia latina com pausas de força funcional — o melhor dos dois mundos.",
      estimatedMinutes: 35,
      difficulty: "intermediate",
      videoId: "T7eHx0Lf6Pc", // "Passo Básico De BACHATA - Aula 01"
      moves: ["Salsa com giro", "Agachamento com samba no pé", "Prancha entre séries de dança", "Bachata básico"],
    },
  ],
  en: [
    {
      slug: "danca-funcional-iniciante",
      name: "Beginner Dance Fitness",
      description: "A light class for people who've never trained by dancing — simple steps combined with functional movement.",
      estimatedMinutes: 20,
      difficulty: "beginner",
      videoId: "wV8cDpJa2f4", // "Salsa Beginners 1 - Salsa Basic Step for the Absolute Beginner"
      moves: ["Basic forró step", "March with arm swings", "Side step with squat", "Danced stretch"],
    },
    {
      slug: "zumba-cardio",
      name: "Zumba Cardio",
      description: "A Zumba-style dance cardio class to raise your heart rate while having fun.",
      estimatedMinutes: 30,
      difficulty: "intermediate",
      videoId: "7nEOMuWrj2Y", // "How to Dance Merengue for Beginners | Basic Merengue Steps Patterns"
      moves: ["Basic salsa", "Marching merengue", "Basic reggaeton perreo", "Cumbia cross step"],
    },
    {
      slug: "ritmos-latinos-forca",
      name: "Latin Rhythms + Strength",
      description: "Combines Latin choreography with functional strength breaks — the best of both worlds.",
      estimatedMinutes: 35,
      difficulty: "intermediate",
      videoId: "SWrsMw0Da7Q", // "Bachata Basic Steps for Beginners"
      moves: ["Salsa with turn", "Squat with samba footwork", "Plank between dance sets", "Basic bachata"],
    },
  ],
  es: [
    {
      slug: "danca-funcional-iniciante",
      name: "Baile Funcional para Principiantes",
      description: "Una clase ligera para quien nunca entrenó bailando — combina pasos simples con movimiento funcional.",
      estimatedMinutes: 20,
      difficulty: "beginner",
      moves: ["Paso básico de forró", "Marcha con balanceo de brazos", "Paso lateral con sentadilla", "Estiramiento bailado"],
    },
    {
      slug: "zumba-cardio",
      name: "Zumba Cardio",
      description: "Clase de cardio bailado, estilo Zumba, para elevar el ritmo cardíaco divirtiéndote.",
      estimatedMinutes: 30,
      difficulty: "intermediate",
      videoId: "XDu_iwJqnOc", // "PASOS BÁSICOS DE SALSA - Clase para principiantes"
      moves: ["Salsa básica", "Merengue marchado", "Perreo básico de reggaetón", "Cumbia paso cruzado"],
    },
    {
      slug: "ritmos-latinos-forca",
      name: "Ritmos Latinos + Fuerza",
      description: "Combina coreografía latina con pausas de fuerza funcional — lo mejor de ambos mundos.",
      estimatedMinutes: 35,
      difficulty: "intermediate",
      videoId: "uYnK-3aQGyk", // "Iniciación a la BACHATA - Pasos Básicos"
      moves: ["Salsa con giro", "Sentadilla con paso de samba", "Plancha entre series de baile", "Bachata básica"],
    },
  ],
};

export function getDanceRoutines(locale: LocaleSlug): DanceRoutine[] {
  return DANCE_ROUTINES[locale];
}
