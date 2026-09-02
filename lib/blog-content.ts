export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string[]; // paragraphs
  tags: string[];
  publishedAt: string; // ISO date
  source: "seed" | "ai";
}

// Seed posts so the blog is never empty before the AI pipeline runs (or if
// OPENAI_API_KEY isn't configured yet). Written once by hand, evidence-based,
// general wellness information — not medical advice.
const SEED_POSTS: Record<"pt-br" | "en" | "es", BlogPost[]> = {
  "pt-br": [
    {
      slug: "hidratacao-e-desempenho",
      title: "Por que hidratação afeta seu desempenho no treino",
      excerpt: "Uma perda de líquidos de apenas 2% do peso corporal já pode reduzir sua força e resistência.",
      body: [
        "A água participa do transporte de nutrientes, da regulação da temperatura corporal e da lubrificação das articulações. Durante o exercício, a perda de líquido pelo suor aumenta, e mesmo uma desidratação leve (perto de 2% do peso corporal) já está associada a quedas mensuráveis de força, resistência e concentração.",
        "Uma referência prática usada por nutricionistas esportivos é observar a cor da urina: tons muito escuros geralmente indicam necessidade de beber mais água ao longo do dia, não só durante o treino.",
        "Não existe uma quantidade universal ideal — clima, intensidade do treino, e características individuais mudam a necessidade de cada pessoa. Beber água regularmente ao longo do dia, e não só quando sente sede, costuma ser mais eficaz do que tentar compensar tudo de uma vez antes do treino.",
      ],
      tags: ["hidratação", "desempenho"],
      publishedAt: "2026-08-04",
      source: "seed",
    },
    {
      slug: "frequencia-ideal-treino-forca",
      title: "Quantas vezes por semana treinar força, segundo a ciência",
      excerpt: "Mais não é sempre melhor: o corpo precisa de tempo para se recuperar e se adaptar ao estímulo.",
      body: [
        "Estudos de fisiologia do exercício apontam que treinar cada grupo muscular de 2 a 3 vezes por semana costuma gerar ganhos de força semelhantes ou melhores do que treiná-lo apenas uma vez, desde que o volume total seja adequado.",
        "A recuperação faz parte do processo de ficar mais forte: é durante o descanso que o corpo se adapta ao estímulo do treino. Treinar o mesmo grupo muscular todos os dias, sem pausa, tende a prejudicar o progresso em vez de acelerá-lo.",
        "Para iniciantes, 2 a 3 sessões de corpo inteiro por semana costumam ser um ponto de partida sólido, permitindo aprender os movimentos e progredir com segurança antes de aumentar frequência ou volume.",
      ],
      tags: ["treino de força", "recuperação"],
      publishedAt: "2026-08-11",
      source: "seed",
    },
    {
      slug: "importancia-do-sono-na-recuperacao",
      title: "O papel do sono na recuperação muscular",
      excerpt: "Boa parte da reparação muscular acontece enquanto você dorme — não apenas na academia.",
      body: [
        "O treino cria o estímulo, mas é durante o sono profundo que o corpo libera boa parte do hormônio do crescimento responsável pela reparação e construção muscular. Dormir mal repetidamente pode reduzir os ganhos de força e aumentar a sensação de fadiga nos treinos seguintes.",
        "Adultos costumam se beneficiar de 7 a 9 horas de sono por noite, embora a necessidade individual varie. Manter horários regulares de sono, mesmo nos fins de semana, tende a ajudar mais do que tentar compensar uma noite mal dormida com uma soneca longa.",
        "Se o cansaço persistir mesmo dormindo o suficiente, vale conversar com um profissional de saúde — pode haver outros fatores envolvidos além do treino.",
      ],
      tags: ["sono", "recuperação"],
      publishedAt: "2026-08-18",
      source: "seed",
    },
  ],
  en: [
    {
      slug: "hydration-and-performance",
      title: "Why hydration affects your workout performance",
      excerpt: "Losing just 2% of your body weight in fluids can already reduce strength and endurance.",
      body: [
        "Water plays a role in nutrient transport, body temperature regulation, and joint lubrication. During exercise, fluid loss through sweat increases, and even mild dehydration (around 2% of body weight) is linked to measurable drops in strength, endurance, and focus.",
        "A practical reference sports nutritionists often use is urine color: very dark shades usually signal a need to drink more water throughout the day, not just during training.",
        "There's no universal ideal amount — climate, training intensity, and individual factors all change what a person needs. Drinking water steadily throughout the day, rather than only when thirsty, tends to work better than trying to catch up all at once before a workout.",
      ],
      tags: ["hydration", "performance"],
      publishedAt: "2026-08-04",
      source: "seed",
    },
    {
      slug: "ideal-strength-training-frequency",
      title: "How often to strength train, according to research",
      excerpt: "More isn't always better — your body needs time to recover and adapt to the stimulus.",
      body: [
        "Exercise physiology research suggests training each muscle group 2-3 times a week tends to produce similar or better strength gains than training it just once, as long as total volume is adequate.",
        "Recovery is part of getting stronger: it's during rest that the body adapts to the training stimulus. Training the same muscle group every day without a break tends to hurt progress rather than speed it up.",
        "For beginners, 2-3 full-body sessions a week is usually a solid starting point, allowing time to learn the movements and progress safely before increasing frequency or volume.",
      ],
      tags: ["strength training", "recovery"],
      publishedAt: "2026-08-11",
      source: "seed",
    },
    {
      slug: "role-of-sleep-in-muscle-recovery",
      title: "The role of sleep in muscle recovery",
      excerpt: "A large part of muscle repair happens while you sleep — not just at the gym.",
      body: [
        "Training creates the stimulus, but it's during deep sleep that the body releases much of the growth hormone responsible for muscle repair and building. Repeated poor sleep can reduce strength gains and increase fatigue in following workouts.",
        "Adults generally benefit from 7-9 hours of sleep a night, though individual needs vary. Keeping consistent sleep times, even on weekends, tends to help more than trying to make up for a bad night with a long nap.",
        "If fatigue persists even with enough sleep, it's worth talking to a healthcare professional — there may be factors beyond training involved.",
      ],
      tags: ["sleep", "recovery"],
      publishedAt: "2026-08-18",
      source: "seed",
    },
  ],
  es: [
    {
      slug: "hidratacion-y-rendimiento",
      title: "Por qué la hidratación afecta tu rendimiento en el entreno",
      excerpt: "Perder solo un 2% de tu peso corporal en líquidos ya puede reducir tu fuerza y resistencia.",
      body: [
        "El agua participa en el transporte de nutrientes, la regulación de la temperatura corporal y la lubricación de las articulaciones. Durante el ejercicio, la pérdida de líquido por el sudor aumenta, y incluso una deshidratación leve (cerca del 2% del peso corporal) se asocia con caídas medibles de fuerza, resistencia y concentración.",
        "Una referencia práctica que usan los nutricionistas deportivos es el color de la orina: tonos muy oscuros suelen indicar la necesidad de beber más agua a lo largo del día, no solo durante el entreno.",
        "No existe una cantidad ideal universal — el clima, la intensidad del entreno y factores individuales cambian la necesidad de cada persona. Beber agua de forma constante durante el día, en vez de solo cuando hay sed, suele funcionar mejor que intentar compensar todo de golpe antes del entreno.",
      ],
      tags: ["hidratación", "rendimiento"],
      publishedAt: "2026-08-04",
      source: "seed",
    },
    {
      slug: "frecuencia-ideal-entreno-fuerza",
      title: "Cuántas veces por semana entrenar fuerza, según la ciencia",
      excerpt: "Más no siempre es mejor: el cuerpo necesita tiempo para recuperarse y adaptarse al estímulo.",
      body: [
        "Estudios de fisiología del ejercicio indican que entrenar cada grupo muscular de 2 a 3 veces por semana suele generar ganancias de fuerza similares o mejores que entrenarlo solo una vez, siempre que el volumen total sea adecuado.",
        "La recuperación es parte del proceso de hacerse más fuerte: es durante el descanso cuando el cuerpo se adapta al estímulo del entreno. Entrenar el mismo grupo muscular todos los días sin pausa tiende a perjudicar el progreso en vez de acelerarlo.",
        "Para principiantes, 2 a 3 sesiones de cuerpo completo por semana suelen ser un buen punto de partida, permitiendo aprender los movimientos y progresar con seguridad antes de aumentar frecuencia o volumen.",
      ],
      tags: ["entreno de fuerza", "recuperación"],
      publishedAt: "2026-08-11",
      source: "seed",
    },
    {
      slug: "importancia-del-sueno-en-la-recuperacion",
      title: "El papel del sueño en la recuperación muscular",
      excerpt: "Buena parte de la reparación muscular ocurre mientras duermes — no solo en el gimnasio.",
      body: [
        "El entreno crea el estímulo, pero es durante el sueño profundo cuando el cuerpo libera buena parte de la hormona del crecimiento responsable de la reparación y construcción muscular. Dormir mal de forma repetida puede reducir las ganancias de fuerza y aumentar la fatiga en los siguientes entrenos.",
        "Los adultos suelen beneficiarse de 7 a 9 horas de sueño por noche, aunque la necesidad individual varía. Mantener horarios de sueño regulares, incluso los fines de semana, tiende a ayudar más que intentar compensar una mala noche con una siesta larga.",
        "Si la fatiga persiste incluso durmiendo lo suficiente, vale la pena hablar con un profesional de la salud — puede haber otros factores además del entreno.",
      ],
      tags: ["sueño", "recuperación"],
      publishedAt: "2026-08-18",
      source: "seed",
    },
  ],
};

export function getSeedPosts(locale: "pt-br" | "en" | "es"): BlogPost[] {
  return SEED_POSTS[locale];
}
