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
    {
      slug: "sobrecarga-progressiva-explicada",
      title: "Sobrecarga progressiva: o princípio por trás de todo ganho de força",
      excerpt: "Levantar o mesmo peso, do mesmo jeito, para sempre, tem um limite. É aí que entra a sobrecarga progressiva.",
      body: [
        "Sobrecarga progressiva é o aumento gradual da exigência colocada sobre o corpo durante o treino — mais peso, mais repetições, mais séries ou menos descanso. Sem esse aumento gradual, o corpo se adapta ao estímulo atual e para de responder com mais força ou massa muscular.",
        "Isso não significa aumentar carga toda semana a qualquer custo. Alternar entre semanas mais pesadas (poucas repetições) e semanas de maior volume (mais repetições) costuma funcionar tão bem quanto, ou melhor, do que só empilhar peso — e reduz o risco de lesão por excesso de carga acumulada.",
        "Um sinal de que está na hora de progredir: quando as últimas repetições de uma série deixam de ser desafiadoras. Anotar cargas e repetições em cada treino ajuda a enxergar esse ponto com clareza, em vez de depender só da memória.",
        "A cada 3-4 semanas de treino mais intenso, uma semana de volume reduzido (deload) ajuda o corpo a absorver o estímulo acumulado antes de seguir progredindo.",
      ],
      tags: ["treino de força", "sobrecarga progressiva"],
      publishedAt: "2026-09-01",
      source: "seed",
    },
    {
      slug: "proteina-e-recuperacao-muscular",
      title: "Quanto de proteína seu corpo realmente precisa para se recuperar",
      excerpt: "Mais proteína não é sempre melhor — mas comer pouco definitivamente atrapalha a recuperação.",
      body: [
        "A proteína fornece os aminoácidos usados para reparar as fibras musculares depois do treino. Distribuir a ingestão ao longo do dia — em vez de concentrar tudo numa refeição só — parece ajudar mais a síntese de proteína muscular do que a quantidade total isolada.",
        "Fontes magras como frango, peixe, ovos, iogurte e leguminosas cobrem bem essa necessidade para a maioria das pessoas fisicamente ativas, sem exigir suplementação.",
        "Whey protein e outros suplementos são uma forma prática de completar a meta diária, não um substituto obrigatório da comida — o total do dia importa mais do que a fonte específica.",
      ],
      tags: ["nutrição", "recuperação"],
      publishedAt: "2026-07-28",
      source: "seed",
    },
    {
      slug: "beneficios-da-calistenia",
      title: "Por que a calistenia continua sendo um dos treinos mais eficientes",
      excerpt: "Sem equipamento, sem academia, sem desculpa — só o peso do próprio corpo bem utilizado.",
      body: [
        "Calistenia usa o peso do próprio corpo como resistência em movimentos como flexões, barras, agachamentos e pranchas. Por não depender de equipamento, pode ser feita em qualquer lugar — de casa a um parque — o que ajuda muito na consistência do treino.",
        "Muitos desses movimentos são multiarticulares, ou seja, trabalham vários grupos musculares e a estabilidade do core ao mesmo tempo, diferente de máquinas que isolam um músculo por vez.",
        "A progressão em calistenia costuma vir de variações mais difíceis do mesmo movimento (por exemplo, de flexão de joelhos para flexão completa, e depois para flexão com pés elevados) em vez de simplesmente adicionar peso — o que faz da técnica um fator ainda mais importante.",
      ],
      tags: ["calistenia", "treino funcional"],
      publishedAt: "2026-07-21",
      source: "seed",
    },
    {
      slug: "o-que-e-treino-funcional",
      title: "O que é treino funcional, na prática",
      excerpt: "Não é sobre levantar mais peso — é sobre se mover melhor no dia a dia.",
      body: [
        "Treino funcional é um conjunto de exercícios que imitam movimentos do cotidiano — agachar para pegar algo no chão, empurrar, puxar, girar o tronco — em vez de isolar um músculo específico como em máquinas tradicionais de academia.",
        "O foco costuma estar em equilíbrio, coordenação, estabilidade do core e mobilidade das articulações, além de força bruta. Isso tende a se traduzir em benefícios práticos: subir escadas com menos cansaço, carregar compras com mais segurança, reduzir o risco de quedas.",
        "É uma ótima porta de entrada para quem está começando a se exercitar, já que os movimentos costumam ser mais intuitivos e adaptáveis ao nível de cada pessoa do que um treino de musculação tradicional.",
      ],
      tags: ["treino funcional"],
      publishedAt: "2026-07-14",
      source: "seed",
    },
    {
      slug: "danca-como-exercicio-cardiovascular",
      title: "Dança conta como exercício cardiovascular de verdade",
      excerpt: "Uma aula de dança pode elevar a frequência cardíaca tanto quanto uma corrida — e é bem mais divertida para muita gente.",
      body: [
        "Aulas de dança como zumba, forró ou ritmos latinos mantêm o corpo em movimento contínuo por longos períodos, o que já configura um treino cardiovascular igual a qualquer outro exercício aeróbico — com o benefício extra de trabalhar coordenação e ritmo.",
        "Um dos maiores motivos pelos quais programas de exercício falham é a falta de prazer na atividade. Dança tende a manter as pessoas engajadas por mais tempo justamente por ser vivida como diversão, não como obrigação — e consistência é o fator mais importante para resultados de longo prazo.",
        "Além do condicionamento cardiovascular, dançar regularmente também desafia equilíbrio e memória motora, um combo que poucos outros exercícios oferecem ao mesmo tempo.",
      ],
      tags: ["dança", "cardio"],
      publishedAt: "2026-07-07",
      source: "seed",
    },
    {
      slug: "exercicio-e-saude-mental",
      title: "O que o exercício físico faz pela sua saúde mental",
      excerpt: "O efeito não é só no corpo — treinar regularmente muda como você se sente no dia a dia.",
      body: [
        "Exercício físico regular está associado a reduções nos sintomas de ansiedade e humor deprimido, em parte pela liberação de endorfinas e outros neurotransmissores durante a atividade, e em parte pela rotina e senso de progresso que o treino constrói.",
        "Não é preciso treino intenso para sentir esse efeito: caminhadas regulares e treinos moderados já mostram benefícios mensuráveis para o bem-estar, o que torna esse benefício acessível mesmo para quem está apenas começando.",
        "Isso não substitui tratamento profissional para quem enfrenta um quadro de saúde mental diagnosticado — mas é uma ferramenta complementar bem estabelecida, que vale a pena ter na rotina ao lado de outros cuidados.",
      ],
      tags: ["saúde mental", "bem-estar"],
      publishedAt: "2026-06-30",
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
    {
      slug: "progressive-overload-explained",
      title: "Progressive overload: the principle behind every strength gain",
      excerpt: "Lifting the same weight, the same way, forever has a ceiling. This is where progressive overload comes in.",
      body: [
        "Progressive overload is the gradual increase in demand placed on the body during training — more weight, more reps, more sets, or less rest. Without that gradual increase, the body adapts to the current stimulus and stops responding with more strength or muscle.",
        "That doesn't mean adding load every single week no matter what. Alternating heavier weeks (fewer reps) with higher-volume weeks (more reps) tends to work as well as, or better than, just stacking weight — and it lowers injury risk from accumulated fatigue.",
        "One sign it's time to progress: when the last reps of a set stop feeling challenging. Logging weights and reps each session makes that point much easier to spot than relying on memory alone.",
        "Every 3-4 weeks of harder training, a lighter deload week helps the body absorb the accumulated stimulus before continuing to progress.",
      ],
      tags: ["strength training", "progressive overload"],
      publishedAt: "2026-09-01",
      source: "seed",
    },
    {
      slug: "protein-and-muscle-recovery",
      title: "How much protein your body actually needs to recover",
      excerpt: "More protein isn't always better — but eating too little definitely hurts recovery.",
      body: [
        "Protein supplies the amino acids used to repair muscle fibers after training. Spreading intake across the day — rather than loading it all into one meal — appears to support muscle protein synthesis better than the daily total alone.",
        "Lean sources like chicken, fish, eggs, yogurt, and legumes cover this need well for most physically active people without requiring supplementation.",
        "Whey protein and other supplements are a convenient way to hit a daily target, not a mandatory replacement for food — the day's total matters more than the specific source.",
      ],
      tags: ["nutrition", "recovery"],
      publishedAt: "2026-07-28",
      source: "seed",
    },
    {
      slug: "benefits-of-calisthenics",
      title: "Why calisthenics remains one of the most efficient workouts",
      excerpt: "No equipment, no gym, no excuse — just your own bodyweight used well.",
      body: [
        "Calisthenics uses your own bodyweight as resistance in movements like push-ups, pull-ups, squats, and planks. Because it doesn't depend on equipment, it can be done almost anywhere — from home to a park — which helps a lot with training consistency.",
        "Many of these movements are multi-joint, working several muscle groups and core stability at once, unlike machines that isolate one muscle at a time.",
        "Progression in calisthenics usually comes from harder variations of the same movement (say, from knee push-ups to full push-ups, then to elevated push-ups) rather than simply adding weight — which makes technique an even bigger factor.",
      ],
      tags: ["calisthenics", "functional training"],
      publishedAt: "2026-07-21",
      source: "seed",
    },
    {
      slug: "what-is-functional-training",
      title: "What functional training actually means",
      excerpt: "It's not about lifting more weight — it's about moving better in everyday life.",
      body: [
        "Functional training is a set of exercises that mimic everyday movements — squatting to pick something up, pushing, pulling, rotating the torso — instead of isolating one specific muscle the way traditional gym machines do.",
        "The focus tends to be on balance, coordination, core stability, and joint mobility, alongside raw strength. That tends to translate into practical benefits: climbing stairs with less fatigue, carrying groceries more safely, lowering fall risk.",
        "It's a great entry point for people just starting to exercise, since the movements tend to be more intuitive and adaptable to each person's level than traditional weight training.",
      ],
      tags: ["functional training"],
      publishedAt: "2026-07-14",
      source: "seed",
    },
    {
      slug: "dance-as-cardiovascular-exercise",
      title: "Dance counts as real cardiovascular exercise",
      excerpt: "A dance class can raise your heart rate as much as a run — and it's a lot more fun for many people.",
      body: [
        "Dance classes like Zumba, forró, or Latin rhythms keep the body moving continuously for extended periods, which is exactly what qualifies as a cardiovascular workout on par with any other aerobic exercise — with the added benefit of training coordination and rhythm.",
        "One of the biggest reasons exercise programs fail is a lack of enjoyment in the activity itself. Dance tends to keep people engaged longer precisely because it's experienced as fun rather than obligation — and consistency is the single biggest factor in long-term results.",
        "Beyond cardiovascular conditioning, dancing regularly also challenges balance and motor memory, a combination few other exercises offer at the same time.",
      ],
      tags: ["dance", "cardio"],
      publishedAt: "2026-07-07",
      source: "seed",
    },
    {
      slug: "exercise-and-mental-health",
      title: "What regular exercise does for your mental health",
      excerpt: "The effect isn't just physical — training regularly changes how you feel day to day.",
      body: [
        "Regular physical exercise is associated with reduced anxiety symptoms and depressed mood, partly through endorphins and other neurotransmitters released during activity, and partly through the routine and sense of progress training builds.",
        "You don't need intense training to feel this effect: regular walks and moderate workouts already show measurable wellbeing benefits, which makes this a benefit accessible even to people just getting started.",
        "This doesn't replace professional treatment for someone facing a diagnosed mental health condition — but it's a well-established complementary tool worth having in a routine alongside other care.",
      ],
      tags: ["mental health", "wellbeing"],
      publishedAt: "2026-06-30",
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
    {
      slug: "sobrecarga-progresiva-explicada",
      title: "Sobrecarga progresiva: el principio detrás de toda ganancia de fuerza",
      excerpt: "Levantar el mismo peso, de la misma forma, para siempre tiene un límite. Ahí entra la sobrecarga progresiva.",
      body: [
        "La sobrecarga progresiva es el aumento gradual de la exigencia sobre el cuerpo durante el entreno — más peso, más repeticiones, más series o menos descanso. Sin ese aumento gradual, el cuerpo se adapta al estímulo actual y deja de responder con más fuerza o masa muscular.",
        "Esto no significa aumentar la carga cada semana a cualquier costo. Alternar entre semanas más pesadas (pocas repeticiones) y semanas de mayor volumen (más repeticiones) suele funcionar tan bien, o mejor, que solo acumular peso — y reduce el riesgo de lesión por carga acumulada.",
        "Una señal de que es momento de progresar: cuando las últimas repeticiones de una serie dejan de ser un desafío. Anotar cargas y repeticiones en cada entreno ayuda a ver este punto con claridad, en vez de depender solo de la memoria.",
        "Cada 3-4 semanas de entreno más intenso, una semana de volumen reducido (deload) ayuda al cuerpo a absorber el estímulo acumulado antes de seguir progresando.",
      ],
      tags: ["entreno de fuerza", "sobrecarga progresiva"],
      publishedAt: "2026-09-01",
      source: "seed",
    },
    {
      slug: "proteina-y-recuperacion-muscular",
      title: "Cuánta proteína necesita realmente tu cuerpo para recuperarse",
      excerpt: "Más proteína no siempre es mejor — pero comer poca definitivamente perjudica la recuperación.",
      body: [
        "La proteína aporta los aminoácidos usados para reparar las fibras musculares después del entreno. Distribuir la ingesta a lo largo del día — en vez de concentrarla en una sola comida — parece ayudar más a la síntesis de proteína muscular que la cantidad total por sí sola.",
        "Fuentes magras como pollo, pescado, huevos, yogur y legumbres cubren bien esta necesidad para la mayoría de las personas físicamente activas, sin requerir suplementación.",
        "La proteína en polvo y otros suplementos son una forma práctica de completar la meta diaria, no un sustituto obligatorio de la comida — el total del día importa más que la fuente específica.",
      ],
      tags: ["nutrición", "recuperación"],
      publishedAt: "2026-07-28",
      source: "seed",
    },
    {
      slug: "beneficios-de-la-calistenia",
      title: "Por qué la calistenia sigue siendo uno de los entrenos más eficientes",
      excerpt: "Sin equipo, sin gimnasio, sin excusa — solo el peso de tu propio cuerpo bien utilizado.",
      body: [
        "La calistenia usa el peso del propio cuerpo como resistencia en movimientos como flexiones, dominadas, sentadillas y planchas. Al no depender de equipo, se puede hacer casi en cualquier lugar — desde casa hasta un parque — lo que ayuda mucho con la consistencia del entreno.",
        "Muchos de estos movimientos son multiarticulares, es decir, trabajan varios grupos musculares y la estabilidad del core a la vez, a diferencia de las máquinas que aíslan un músculo por vez.",
        "La progresión en calistenia suele venir de variaciones más difíciles del mismo movimiento (por ejemplo, de flexión de rodillas a flexión completa, y luego a flexión con pies elevados) en vez de simplemente añadir peso — lo que hace de la técnica un factor aún más importante.",
      ],
      tags: ["calistenia", "entreno funcional"],
      publishedAt: "2026-07-21",
      source: "seed",
    },
    {
      slug: "que-es-el-entreno-funcional",
      title: "Qué es el entreno funcional, en la práctica",
      excerpt: "No se trata de levantar más peso — se trata de moverte mejor en el día a día.",
      body: [
        "El entreno funcional es un conjunto de ejercicios que imitan movimientos cotidianos — agacharse para recoger algo del suelo, empujar, tirar, girar el torso — en vez de aislar un músculo específico como en las máquinas tradicionales de gimnasio.",
        "El foco suele estar en el equilibrio, la coordinación, la estabilidad del core y la movilidad articular, además de la fuerza bruta. Esto tiende a traducirse en beneficios prácticos: subir escaleras con menos cansancio, cargar la compra con más seguridad, reducir el riesgo de caídas.",
        "Es una excelente puerta de entrada para quien empieza a hacer ejercicio, ya que los movimientos suelen ser más intuitivos y adaptables al nivel de cada persona que un entreno de musculación tradicional.",
      ],
      tags: ["entreno funcional"],
      publishedAt: "2026-07-14",
      source: "seed",
    },
    {
      slug: "el-baile-como-ejercicio-cardiovascular",
      title: "El baile cuenta como ejercicio cardiovascular de verdad",
      excerpt: "Una clase de baile puede elevar tu ritmo cardíaco tanto como correr — y es mucho más divertida para mucha gente.",
      body: [
        "Clases de baile como zumba, salsa o ritmos latinos mantienen el cuerpo en movimiento continuo durante largos periodos, lo que ya configura un entreno cardiovascular igual que cualquier otro ejercicio aeróbico — con el beneficio extra de trabajar coordinación y ritmo.",
        "Una de las mayores razones por las que los programas de ejercicio fallan es la falta de disfrute en la actividad. El baile tiende a mantener a las personas motivadas por más tiempo precisamente porque se vive como diversión, no como obligación — y la consistencia es el factor más importante para resultados a largo plazo.",
        "Además del acondicionamiento cardiovascular, bailar regularmente también desafía el equilibrio y la memoria motora, una combinación que pocos otros ejercicios ofrecen al mismo tiempo.",
      ],
      tags: ["baile", "cardio"],
      publishedAt: "2026-07-07",
      source: "seed",
    },
    {
      slug: "ejercicio-y-salud-mental",
      title: "Qué hace el ejercicio físico por tu salud mental",
      excerpt: "El efecto no es solo físico — entrenar regularmente cambia cómo te sientes día a día.",
      body: [
        "El ejercicio físico regular está asociado con reducciones en los síntomas de ansiedad y estado de ánimo deprimido, en parte por la liberación de endorfinas y otros neurotransmisores durante la actividad, y en parte por la rutina y la sensación de progreso que construye el entreno.",
        "No hace falta un entreno intenso para sentir este efecto: caminatas regulares y entrenos moderados ya muestran beneficios medibles para el bienestar, lo que hace de este un beneficio accesible incluso para quien recién empieza.",
        "Esto no sustituye el tratamiento profesional para quien enfrenta una condición de salud mental diagnosticada — pero es una herramienta complementaria bien establecida, que vale la pena tener en la rutina junto a otros cuidados.",
      ],
      tags: ["salud mental", "bienestar"],
      publishedAt: "2026-06-30",
      source: "seed",
    },
  ],
};

export function getSeedPosts(locale: "pt-br" | "en" | "es"): BlogPost[] {
  return SEED_POSTS[locale];
}
