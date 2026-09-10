import type { LocaleSlug } from "./locales-config";

export interface ExerciseText {
  name: string;
  description: string;
  instructions: string[];
  safetyNotes?: string[];
}

// Human-readable content for every seed exercise, in all 3 site locales.
// Keyed by slug (matching ExerciseBase.slug in exercise-data.ts).
export const EXERCISE_TRANSLATIONS: Record<string, Record<LocaleSlug, ExerciseText>> = {
  "back-squat": {
    "pt-br": {
      name: "Agachamento com Barra",
      description: "Um exercício composto para a parte inferior do corpo que desenvolve força nas pernas, glúteos e core.",
      instructions: [
        "Posicione a barra na parte superior das costas, pés na largura dos ombros.",
        "Contraia o core e sente para trás e para baixo, mantendo o peito erguido.",
        "Desça até os quadris ficarem na altura dos joelhos ou abaixo.",
        "Empurre pelos calcanhares para voltar a ficar de pé.",
      ],
      safetyNotes: ["Mantenha os joelhos alinhados com os pés.", "Use um parceiro de treino ou pinos de segurança em cargas pesadas."],
    },
    en: {
      name: "Back Squat",
      description: "A compound lower-body lift that builds strength in the legs, glutes, and core.",
      instructions: [
        "Set the bar on your upper back, feet shoulder-width apart.",
        "Brace your core and sit back and down, keeping your chest up.",
        "Lower until your hips are at or below knee level.",
        "Drive through your heels to stand back up.",
      ],
      safetyNotes: ["Keep knees tracking over toes.", "Use a spotter or safety pins when going heavy."],
    },
    es: {
      name: "Sentadilla con Barra",
      description: "Un ejercicio compuesto para el tren inferior que desarrolla fuerza en piernas, glúteos y core.",
      instructions: [
        "Coloca la barra en la parte superior de la espalda, pies al ancho de los hombros.",
        "Contrae el core y siéntate hacia atrás y abajo, manteniendo el pecho erguido.",
        "Baja hasta que las caderas queden a la altura de las rodillas o más abajo.",
        "Empuja con los talones para volver a ponerte de pie.",
      ],
      safetyNotes: ["Mantén las rodillas alineadas con los pies.", "Usa un compañero o pines de seguridad con cargas pesadas."],
    },
  },
  "bench-press": {
    "pt-br": {
      name: "Supino Reto",
      description: "O clássico exercício de empurrar na horizontal para desenvolver peito, ombros e tríceps.",
      instructions: [
        "Deite no banco com os olhos embaixo da barra, pés apoiados no chão.",
        "Segure a barra um pouco mais aberto que a largura dos ombros.",
        "Desça a barra até o meio do peito com controle.",
        "Empurre de volta até a extensão total dos braços.",
      ],
      safetyNotes: ["Sempre use um parceiro de treino ou braços de segurança em cargas pesadas."],
    },
    en: {
      name: "Bench Press",
      description: "The classic horizontal press for building chest, shoulder, and tricep strength.",
      instructions: [
        "Lie on the bench with eyes under the bar, feet flat on the floor.",
        "Grip slightly wider than shoulder-width.",
        "Lower the bar to your mid-chest with control.",
        "Press back up to full arm extension.",
      ],
      safetyNotes: ["Always use a spotter or safety arms when lifting heavy."],
    },
    es: {
      name: "Press de Banca",
      description: "El clásico ejercicio de empuje horizontal para desarrollar pecho, hombros y tríceps.",
      instructions: [
        "Acuéstate en el banco con los ojos debajo de la barra, pies apoyados en el suelo.",
        "Agarra la barra un poco más ancho que el ancho de los hombros.",
        "Baja la barra hasta el medio del pecho con control.",
        "Empuja de vuelta hasta la extensión completa de los brazos.",
      ],
      safetyNotes: ["Usa siempre un compañero o brazos de seguridad con cargas pesadas."],
    },
  },
  deadlift: {
    "pt-br": {
      name: "Levantamento Terra",
      description: "Um movimento de puxar que envolve o corpo todo e é um dos melhores para ganho de força geral.",
      instructions: [
        "Fique em pé com os pés na largura do quadril, a barra sobre o meio do pé.",
        "Dobre o quadril e segure a barra logo fora dos joelhos.",
        "Mantenha as costas retas, peito erguido, e empurre pelos calcanhares para ficar de pé.",
        "Desça a barra de volta com controle, levando o quadril para trás primeiro.",
      ],
      safetyNotes: ["Nunca arredonde a lombar sob carga.", "Comece leve e priorize a técnica."],
    },
    en: {
      name: "Deadlift",
      description: "A full-body pulling movement and one of the best overall strength builders.",
      instructions: [
        "Stand with feet hip-width apart, bar over mid-foot.",
        "Hinge at the hips and grip the bar just outside your knees.",
        "Keep your back flat, chest up, and drive through your heels to stand.",
        "Lower the bar back down with control, hips moving back first.",
      ],
      safetyNotes: ["Never round your lower back under load.", "Start light and prioritize form."],
    },
    es: {
      name: "Peso Muerto",
      description: "Un movimiento de tirón de cuerpo completo y uno de los mejores para ganar fuerza general.",
      instructions: [
        "Ponte de pie con los pies al ancho de la cadera, la barra sobre el medio del pie.",
        "Flexiona la cadera y agarra la barra justo fuera de las rodillas.",
        "Mantén la espalda recta, pecho erguido, y empuja con los talones para ponerte de pie.",
        "Baja la barra de vuelta con control, llevando la cadera hacia atrás primero.",
      ],
      safetyNotes: ["Nunca redondees la zona lumbar bajo carga.", "Empieza ligero y prioriza la técnica."],
    },
  },
  "dumbbell-bench-press": {
    "pt-br": {
      name: "Supino com Halteres",
      description: "Uma variação do supino mais amigável às articulações, que também desafia a estabilidade dos ombros.",
      instructions: [
        "Deite no banco segurando um halter em cada mão na altura do peito.",
        "Empurre os dois halteres para cima até estender os braços.",
        "Desça com controle de volta até a altura do peito.",
      ],
      safetyNotes: ["Mantenha os punhos retos e alinhados sobre os cotovelos."],
    },
    en: {
      name: "Dumbbell Bench Press",
      description: "A joint-friendly variation of the bench press that also challenges shoulder stability.",
      instructions: [
        "Lie on a bench holding a dumbbell in each hand at chest level.",
        "Press both dumbbells up until your arms are extended.",
        "Lower with control back to chest level.",
      ],
      safetyNotes: ["Keep wrists straight and stacked over elbows."],
    },
    es: {
      name: "Press de Banca con Mancuernas",
      description: "Una variante del press de banca más amigable con las articulaciones, que también desafía la estabilidad de los hombros.",
      instructions: [
        "Acuéstate en el banco sujetando una mancuerna en cada mano a la altura del pecho.",
        "Empuja ambas mancuernas hacia arriba hasta extender los brazos.",
        "Baja con control de vuelta a la altura del pecho.",
      ],
      safetyNotes: ["Mantén las muñecas rectas y alineadas sobre los codos."],
    },
  },
  running: {
    "pt-br": {
      name: "Corrida",
      description: "Corrida contínua ou intervalada para resistência cardiovascular.",
      instructions: [
        "Aqueça com 5 minutos de caminhada leve ou trote.",
        "Mantenha um ritmo que você consiga sustentar respirando de forma constante.",
        "Desacelere o ritmo nos últimos minutos para desaquecer.",
      ],
      safetyNotes: ["Use tênis apropriados para corrida para reduzir o impacto nas articulações."],
    },
    en: {
      name: "Running",
      description: "Steady-state or interval running for cardiovascular endurance.",
      instructions: [
        "Warm up with 5 minutes of easy walking or jogging.",
        "Maintain a pace you can sustain while breathing rhythmically.",
        "Cool down with a slower pace for the last few minutes.",
      ],
      safetyNotes: ["Wear proper running shoes to reduce joint impact."],
    },
    es: {
      name: "Correr",
      description: "Carrera continua o por intervalos para resistencia cardiovascular.",
      instructions: [
        "Calienta con 5 minutos de caminata ligera o trote suave.",
        "Mantén un ritmo que puedas sostener respirando de forma constante.",
        "Reduce el ritmo en los últimos minutos para enfriar.",
      ],
      safetyNotes: ["Usa zapatillas adecuadas para correr y reducir el impacto en las articulaciones."],
    },
  },
  "jump-rope": {
    "pt-br": {
      name: "Pular Corda",
      description: "Um exercício cardio muito eficiente que também desenvolve coordenação e resistência de panturrilha.",
      instructions: [
        "Segure os cabos da corda na altura do quadril.",
        "Pule apenas o suficiente para a corda passar, aterrissando suavemente na ponta dos pés.",
        "Mantenha um ritmo constante, girando a corda mais com os punhos do que com os braços.",
      ],
      safetyNotes: ["Pule em uma superfície com algum amortecimento para proteger as articulações."],
    },
    en: {
      name: "Jump Rope",
      description: "A high-efficiency cardio drill that also builds coordination and calf endurance.",
      instructions: [
        "Hold the rope handles at hip height.",
        "Jump just high enough to clear the rope, landing softly on the balls of your feet.",
        "Keep a steady rhythm, using your wrists more than your arms to turn the rope.",
      ],
      safetyNotes: ["Jump on a surface with some give to protect your joints."],
    },
    es: {
      name: "Saltar la Cuerda",
      description: "Un ejercicio cardio muy eficiente que también desarrolla coordinación y resistencia de pantorrillas.",
      instructions: [
        "Sujeta los mangos de la cuerda a la altura de la cadera.",
        "Salta lo justo para que pase la cuerda, aterrizando suavemente en la punta de los pies.",
        "Mantén un ritmo constante, girando la cuerda más con las muñecas que con los brazos.",
      ],
      safetyNotes: ["Salta sobre una superficie con algo de amortiguación para proteger las articulaciones."],
    },
  },
  "rowing-machine": {
    "pt-br": {
      name: "Remo (Máquina)",
      description: "Um exercício cardio de baixo impacto para o corpo todo, que também desenvolve resistência nas costas e pernas.",
      instructions: [
        "Empurre primeiro com as pernas, depois incline o tronco levemente para trás e puxe a barra até o peito.",
        "Inverta a sequência para voltar: estenda os braços, incline o tronco à frente e depois dobre os joelhos.",
      ],
    },
    en: {
      name: "Rowing Machine",
      description: "A low-impact full-body cardio exercise that also builds back and leg endurance.",
      instructions: [
        "Drive with your legs first, then lean back slightly and pull the handle to your chest.",
        "Reverse the sequence to return: arms out, lean forward, then bend the knees.",
      ],
    },
    es: {
      name: "Remo (Máquina)",
      description: "Un ejercicio cardio de bajo impacto para todo el cuerpo, que también desarrolla resistencia en espalda y piernas.",
      instructions: [
        "Empuja primero con las piernas, luego inclina el torso ligeramente hacia atrás y tira de la barra hacia el pecho.",
        "Invierte la secuencia para volver: extiende los brazos, inclina el torso hacia adelante y luego flexiona las rodillas.",
      ],
    },
  },
  cycling: {
    "pt-br": {
      name: "Ciclismo",
      description: "Uma opção de cardio amigável às articulações, seja em bike ergométrica ou ao ar livre.",
      instructions: [
        "Ajuste o banco para que o joelho fique levemente flexionado na extensão total do pedal.",
        "Mantenha uma cadência constante, ajustando a resistência para controlar a intensidade.",
      ],
    },
    en: {
      name: "Cycling",
      description: "A joint-friendly cardio option, indoors on a stationary bike or outdoors.",
      instructions: [
        "Adjust the seat so your knee has a slight bend at full pedal extension.",
        "Maintain a steady cadence, adjusting resistance to control intensity.",
      ],
    },
    es: {
      name: "Ciclismo",
      description: "Una opción cardio amigable con las articulaciones, en bicicleta estática o al aire libre.",
      instructions: [
        "Ajusta el asiento para que la rodilla quede ligeramente flexionada en la extensión total del pedal.",
        "Mantén una cadencia constante, ajustando la resistencia para controlar la intensidad.",
      ],
    },
  },
  "push-up": {
    "pt-br": {
      name: "Flexão de Braço",
      description: "O movimento básico de empurrar com o peso do corpo para peito, ombros e tríceps.",
      instructions: [
        "Comece na posição de prancha, mãos um pouco mais abertas que os ombros.",
        "Desça o peito em direção ao chão, mantendo o corpo alinhado em linha reta.",
        "Empurre de volta até a posição inicial.",
      ],
      safetyNotes: ["Não deixe o quadril cair para proteger a lombar."],
    },
    en: {
      name: "Push-Up",
      description: "The foundational bodyweight pressing movement for chest, shoulders, and triceps.",
      instructions: [
        "Start in a plank position, hands slightly wider than shoulders.",
        "Lower your chest toward the floor, keeping your body in a straight line.",
        "Push back up to the starting position.",
      ],
      safetyNotes: ["Keep your hips from sagging to protect your lower back."],
    },
    es: {
      name: "Flexión de Brazos",
      description: "El movimiento básico de empuje con el peso corporal para pecho, hombros y tríceps.",
      instructions: [
        "Comienza en posición de plancha, manos un poco más abiertas que los hombros.",
        "Baja el pecho hacia el suelo, manteniendo el cuerpo alineado en línea recta.",
        "Empuja de vuelta hasta la posición inicial.",
      ],
      safetyNotes: ["No dejes que la cadera caiga para proteger la zona lumbar."],
    },
  },
  "pull-up": {
    "pt-br": {
      name: "Barra Fixa",
      description: "Um puxão exigente para a parte superior do corpo, que desenvolve força nas costas e bíceps usando o peso corporal.",
      instructions: [
        "Pendure-se na barra com pegada pronada, um pouco mais aberta que os ombros.",
        "Puxe o corpo para cima até o queixo passar da barra.",
        "Desça com controle até os braços ficarem totalmente estendidos.",
      ],
      safetyNotes: ["Evite balançar ou usar impulso (kipping) até ter bom controle do movimento."],
    },
    en: {
      name: "Pull-Up",
      description: "A demanding upper-body pull that builds back and bicep strength using bodyweight.",
      instructions: [
        "Hang from a bar with an overhand grip, slightly wider than shoulders.",
        "Pull yourself up until your chin clears the bar.",
        "Lower back down with control to a full hang.",
      ],
      safetyNotes: ["Avoid swinging or using momentum (kipping) until you have good control."],
    },
    es: {
      name: "Dominadas",
      description: "Un tirón exigente para el tren superior, que desarrolla fuerza en espalda y bíceps usando el peso corporal.",
      instructions: [
        "Cuélgate de la barra con agarre pronado, un poco más ancho que los hombros.",
        "Tira de tu cuerpo hacia arriba hasta que la barbilla pase la barra.",
        "Baja con control hasta que los brazos queden totalmente extendidos.",
      ],
      safetyNotes: ["Evita balancearte o usar impulso (kipping) hasta tener buen control del movimiento."],
    },
  },
  "bodyweight-squat": {
    "pt-br": {
      name: "Agachamento Sem Peso",
      description: "Um padrão de agachamento sem equipamento, ótimo para iniciantes ou aquecimento.",
      instructions: [
        "Fique em pé com os pés na largura dos ombros.",
        "Sente para trás e para baixo, mantendo o peito erguido e os calcanhares no chão.",
        "Volte a ficar em pé empurrando pelos calcanhares.",
      ],
    },
    en: {
      name: "Bodyweight Squat",
      description: "A no-equipment squat pattern, great for beginners or warm-ups.",
      instructions: [
        "Stand with feet shoulder-width apart.",
        "Sit back and down, keeping your chest up and heels planted.",
        "Stand back up by driving through your heels.",
      ],
    },
    es: {
      name: "Sentadilla sin Peso",
      description: "Un patrón de sentadilla sin equipo, ideal para principiantes o calentamiento.",
      instructions: [
        "Ponte de pie con los pies al ancho de los hombros.",
        "Siéntate hacia atrás y abajo, manteniendo el pecho erguido y los talones en el suelo.",
        "Vuelve a ponerte de pie empujando con los talones.",
      ],
    },
  },
  plank: {
    "pt-br": {
      name: "Prancha",
      description: "Uma sustentação isométrica de core que desenvolve estabilidade no tronco.",
      instructions: [
        "Apoie-se nos antebraços e nas pontas dos pés, cotovelos abaixo dos ombros.",
        "Mantenha o corpo alinhado em linha reta da cabeça aos calcanhares.",
        "Sustente a posição respirando de forma constante, sem deixar o quadril cair ou subir demais.",
      ],
    },
    en: {
      name: "Plank",
      description: "An isometric core hold that builds trunk stability.",
      instructions: [
        "Rest on your forearms and toes, elbows under your shoulders.",
        "Keep your body in a straight line from head to heels.",
        "Hold, breathing steadily, without letting your hips sag or pike up.",
      ],
    },
    es: {
      name: "Plancha",
      description: "Una sujeción isométrica de core que desarrolla estabilidad en el tronco.",
      instructions: [
        "Apóyate en los antebrazos y en las puntas de los pies, codos debajo de los hombros.",
        "Mantén el cuerpo alineado en línea recta desde la cabeza hasta los talones.",
        "Sostén la posición respirando de forma constante, sin dejar que la cadera caiga o suba demasiado.",
      ],
    },
  },
  burpee: {
    "pt-br": {
      name: "Burpee",
      description: "Um exercício de condicionamento para o corpo todo que combina agachamento, prancha, flexão e salto.",
      instructions: [
        "Agache e coloque as mãos no chão.",
        "Jogue os pés para trás até a posição de prancha e faça uma flexão.",
        "Traga os pés de volta para perto das mãos e salte para cima com força.",
      ],
      safetyNotes: ["Reduza a intensidade (dando um passo para trás em vez de saltar) se precisar poupar as articulações."],
    },
    en: {
      name: "Burpee",
      description: "A full-body conditioning move combining a squat, plank, push-up, and jump.",
      instructions: [
        "Squat down and place your hands on the floor.",
        "Kick your feet back into a plank and perform a push-up.",
        "Jump your feet back to your hands, then explode upward into a jump.",
      ],
      safetyNotes: ["Scale down (step back instead of jumping) if needed for your joints."],
    },
    es: {
      name: "Burpee",
      description: "Un ejercicio de acondicionamiento de cuerpo completo que combina sentadilla, plancha, flexión y salto.",
      instructions: [
        "Agáchate y coloca las manos en el suelo.",
        "Lleva los pies hacia atrás hasta la posición de plancha y haz una flexión.",
        "Trae los pies de vuelta cerca de las manos y salta hacia arriba con fuerza.",
      ],
      safetyNotes: ["Reduce la intensidad (dando un paso atrás en vez de saltar) si necesitas cuidar las articulaciones."],
    },
  },
  "mountain-climbers": {
    "pt-br": {
      name: "Escalador",
      description: "Um exercício acelerado de core e condicionamento, feito a partir da posição de prancha.",
      instructions: [
        "Comece na posição de prancha.",
        "Leve um joelho em direção ao peito e troque rapidamente de perna.",
        "Mantenha o quadril baixo e o core contraído durante todo o movimento.",
      ],
    },
    en: {
      name: "Mountain Climbers",
      description: "A fast-paced core and conditioning drill performed from a plank position.",
      instructions: [
        "Start in a plank position.",
        "Drive one knee toward your chest, then quickly switch legs.",
        "Keep your hips low and core braced throughout.",
      ],
    },
    es: {
      name: "Escalador",
      description: "Un ejercicio acelerado de core y acondicionamiento, realizado desde la posición de plancha.",
      instructions: [
        "Comienza en posición de plancha.",
        "Lleva una rodilla hacia el pecho y cambia rápidamente de pierna.",
        "Mantén la cadera baja y el core contraído durante todo el movimiento.",
      ],
    },
  },
  "bear-crawl": {
    "pt-br": {
      name: "Caminhada do Urso",
      description: "Um padrão de rastejar que desenvolve coordenação para o corpo todo, estabilidade de ombro e condicionamento.",
      instructions: [
        "Comece apoiado em mãos e pés, com os joelhos levemente afastados do chão.",
        "Mova a mão e o pé opostos para frente ao mesmo tempo, mantendo as costas retas.",
        "Continue por distância ou tempo determinado, mantendo o quadril nivelado.",
      ],
    },
    en: {
      name: "Bear Crawl",
      description: "A crawling pattern that builds full-body coordination, shoulder stability, and conditioning.",
      instructions: [
        "Start on hands and feet, knees hovering just off the ground.",
        "Move your opposite hand and foot forward together, keeping your back flat.",
        "Continue for distance or time, keeping your hips level.",
      ],
    },
    es: {
      name: "Marcha del Oso",
      description: "Un patrón de gateo que desarrolla coordinación de cuerpo completo, estabilidad de hombro y acondicionamiento.",
      instructions: [
        "Comienza apoyado en manos y pies, con las rodillas ligeramente separadas del suelo.",
        "Mueve la mano y el pie opuestos hacia adelante al mismo tiempo, manteniendo la espalda recta.",
        "Continúa por la distancia o tiempo indicado, manteniendo la cadera nivelada.",
      ],
    },
  },
  sprints: {
    "pt-br": {
      name: "Tiros de Velocidade",
      description: "Tiros curtos de corrida em esforço máximo para potência e condicionamento.",
      instructions: [
        "Aqueça bem com alongamentos dinâmicos e um trote leve.",
        "Corra em esforço quase máximo pela distância ou tempo definido.",
        "Volte caminhando para se recuperar totalmente antes da próxima repetição.",
      ],
      safetyNotes: ["Pular o aquecimento aumenta muito o risco de lesão em velocidades de sprint."],
    },
    en: {
      name: "Sprints",
      description: "Short, maximal-effort running intervals for power and conditioning.",
      instructions: [
        "Warm up thoroughly with dynamic stretches and light jogging.",
        "Sprint at near-maximal effort for the set distance or time.",
        "Walk back to recover fully before the next rep.",
      ],
      safetyNotes: ["Skipping the warm-up significantly raises injury risk at sprint speeds."],
    },
    es: {
      name: "Sprints",
      description: "Series cortas de carrera a esfuerzo máximo para potencia y acondicionamiento.",
      instructions: [
        "Calienta bien con estiramientos dinámicos y un trote suave.",
        "Corre a esfuerzo casi máximo durante la distancia o tiempo establecido.",
        "Vuelve caminando para recuperarte por completo antes de la siguiente repetición.",
      ],
      safetyNotes: ["Saltarse el calentamiento aumenta mucho el riesgo de lesión a velocidades de sprint."],
    },
  },
  "hip-flexor-stretch": {
    "pt-br": {
      name: "Alongamento de Flexor de Quadril Ajoelhado",
      description: "Alonga os flexores do quadril, comumente tensos após longos períodos sentado.",
      instructions: [
        "Ajoelhe em um joelho com o outro pé apoiado à frente.",
        "Leve o quadril suavemente para frente até sentir o alongamento na frente do quadril que está ajoelhado.",
        "Sustente a posição e depois troque de lado.",
      ],
    },
    en: {
      name: "Kneeling Hip Flexor Stretch",
      description: "Opens up tight hip flexors, common after long periods of sitting.",
      instructions: [
        "Kneel on one knee with the other foot planted in front.",
        "Shift your hips forward gently until you feel a stretch in the front of the kneeling hip.",
        "Hold, then switch sides.",
      ],
    },
    es: {
      name: "Estiramiento de Flexor de Cadera de Rodillas",
      description: "Estira los flexores de cadera, comúnmente tensos tras largos periodos sentado.",
      instructions: [
        "Arrodíllate sobre una rodilla con el otro pie apoyado adelante.",
        "Lleva la cadera suavemente hacia adelante hasta sentir el estiramiento en la parte frontal de la cadera que está de rodillas.",
        "Sostén la posición y luego cambia de lado.",
      ],
    },
  },
  "cat-cow": {
    "pt-br": {
      name: "Gato-Vaca",
      description: "Uma sequência suave de mobilidade da coluna, ótima como aquecimento ou recuperação.",
      instructions: [
        "Comece apoiado em mãos e joelhos.",
        "Inspire, deixe a barriga cair e levante o peito e o cóccix (posição vaca).",
        "Expire, arredonde a coluna e leve o queixo em direção ao peito (posição gato).",
      ],
    },
    en: {
      name: "Cat-Cow",
      description: "A gentle spinal mobility flow, great as a warm-up or recovery movement.",
      instructions: [
        "Start on hands and knees.",
        "Inhale, drop your belly, and lift your chest and tailbone (cow).",
        "Exhale, round your spine and tuck your chin (cat).",
      ],
    },
    es: {
      name: "Gato-Vaca",
      description: "Una secuencia suave de movilidad de columna, ideal como calentamiento o recuperación.",
      instructions: [
        "Comienza apoyado en manos y rodillas.",
        "Inhala, deja caer el vientre y levanta el pecho y el cóccix (posición vaca).",
        "Exhala, redondea la columna y lleva la barbilla hacia el pecho (posición gato).",
      ],
    },
  },
  "shoulder-dislocates": {
    "pt-br": {
      name: "Rotação de Ombro com Faixa/Bastão",
      description: "Melhora a amplitude de movimento do ombro usando uma faixa elástica ou bastão.",
      instructions: [
        "Segure uma faixa ou bastão com pegada pronada bem aberta à frente do corpo.",
        "Levante lentamente por cima da cabeça e para trás, mantendo os braços retos.",
        "Volte à posição inicial com controle.",
      ],
      safetyNotes: ["Abra mais a pegada se sentir compressão nos ombros."],
    },
    en: {
      name: "Shoulder Dislocates (band or stick)",
      description: "Improves shoulder range of motion using a resistance band or stick.",
      instructions: [
        "Hold a band or stick with a wide overhand grip in front of you.",
        "Slowly raise it overhead and back behind you, keeping arms straight.",
        "Reverse back to the starting position with control.",
      ],
      safetyNotes: ["Widen your grip if you feel pinching in the shoulders."],
    },
    es: {
      name: "Rotación de Hombro con Banda/Palo",
      description: "Mejora el rango de movimiento del hombro usando una banda elástica o palo.",
      instructions: [
        "Sujeta una banda o palo con agarre pronado bien abierto frente al cuerpo.",
        "Levanta lentamente por encima de la cabeza y hacia atrás, manteniendo los brazos rectos.",
        "Vuelve a la posición inicial con control.",
      ],
      safetyNotes: ["Abre más el agarre si sientes pinzamiento en los hombros."],
    },
  },
  "worlds-greatest-stretch": {
    "pt-br": {
      name: "O Melhor Alongamento do Mundo",
      description: "Uma sequência de mobilidade que trabalha quadril, posterior de coxa e coluna torácica em um só movimento.",
      instructions: [
        "Dê um passo em um avanço profundo, com as duas mãos no chão dentro do pé da frente.",
        "Rotacione o tronco e leve o braço interno em direção ao teto.",
        "Volte a mão ao chão e depois estenda a perna da frente para alongar o posterior de coxa.",
      ],
    },
    en: {
      name: "World's Greatest Stretch",
      description: "A multi-joint mobility flow covering hips, hamstrings, and thoracic spine in one movement.",
      instructions: [
        "Step into a deep lunge, both hands on the floor inside the front foot.",
        "Rotate your torso and reach the inside arm toward the ceiling.",
        "Return hand to the floor, then straighten the front leg to stretch the hamstring.",
      ],
    },
    es: {
      name: "El Mejor Estiramiento del Mundo",
      description: "Una secuencia de movilidad que trabaja cadera, isquiotibiales y columna torácica en un solo movimiento.",
      instructions: [
        "Da un paso en una zancada profunda, con ambas manos en el suelo dentro del pie delantero.",
        "Rota el torso y lleva el brazo interno hacia el techo.",
        "Vuelve la mano al suelo y luego estira la pierna delantera para estirar el isquiotibial.",
      ],
    },
  },
  "jumping-jacks": {
    "pt-br": {
      name: "Polichinelo",
      description: "Um exercício clássico de aquecimento para o corpo todo, que eleva a frequência cardíaca e a temperatura corporal.",
      instructions: [
        "Comece em pé com os pés juntos e os braços ao lado do corpo.",
        "Salte abrindo as pernas enquanto levanta os braços acima da cabeça.",
        "Salte de volta à posição inicial e repita.",
      ],
    },
    en: {
      name: "Jumping Jacks",
      description: "A classic full-body warm-up move to raise heart rate and body temperature.",
      instructions: [
        "Start standing with feet together, arms at your sides.",
        "Jump feet out while raising arms overhead.",
        "Jump back to the starting position and repeat.",
      ],
    },
    es: {
      name: "Salto de Tijera",
      description: "Un ejercicio clásico de calentamiento de cuerpo completo, que eleva la frecuencia cardíaca y la temperatura corporal.",
      instructions: [
        "Comienza de pie con los pies juntos y los brazos a los costados.",
        "Salta abriendo las piernas mientras levantas los brazos por encima de la cabeza.",
        "Salta de vuelta a la posición inicial y repite.",
      ],
    },
  },
  "high-knees": {
    "pt-br": {
      name: "Joelho Alto",
      description: "Um exercício dinâmico de aquecimento que eleva a frequência cardíaca e ativa os flexores do quadril.",
      instructions: [
        "Trote no lugar, levando os joelhos até a altura do quadril.",
        "Movimente os braços no ritmo das pernas.",
      ],
    },
    en: {
      name: "High Knees",
      description: "A dynamic warm-up drill that raises heart rate and activates the hip flexors.",
      instructions: [
        "Jog in place, driving your knees up toward hip height.",
        "Pump your arms in rhythm with your legs.",
      ],
    },
    es: {
      name: "Rodillas Altas",
      description: "Un ejercicio dinámico de calentamiento que eleva la frecuencia cardíaca y activa los flexores de cadera.",
      instructions: [
        "Trota en el lugar, llevando las rodillas hasta la altura de la cadera.",
        "Mueve los brazos al ritmo de las piernas.",
      ],
    },
  },
  "arm-circles": {
    "pt-br": {
      name: "Círculos com os Braços",
      description: "Um aquecimento simples de ombro para preparar a articulação para exercícios de empurrar ou acima da cabeça.",
      instructions: [
        "Estenda os braços para os lados na altura dos ombros.",
        "Faça pequenos círculos, aumentando gradualmente o tamanho.",
        "Inverta a direção após 15-20 segundos.",
      ],
    },
    en: {
      name: "Arm Circles",
      description: "A simple shoulder warm-up to prepare the joint for pressing or overhead work.",
      instructions: [
        "Extend arms out to your sides at shoulder height.",
        "Make small circles, gradually increasing the size.",
        "Reverse direction after 15-20 seconds.",
      ],
    },
    es: {
      name: "Círculos de Brazos",
      description: "Un calentamiento simple de hombro para preparar la articulación para ejercicios de empuje o por encima de la cabeza.",
      instructions: [
        "Extiende los brazos hacia los lados a la altura de los hombros.",
        "Haz pequeños círculos, aumentando gradualmente el tamaño.",
        "Invierte la dirección después de 15-20 segundos.",
      ],
    },
  },
  "walking-lunges-warmup": {
    "pt-br": {
      name: "Avanço Caminhando (Aquecimento)",
      description: "Um aquecimento dinâmico para a parte inferior do corpo que também melhora o equilíbrio.",
      instructions: [
        "Dê um passo à frente em um avanço, descendo o joelho de trás em direção ao chão.",
        "Empurre com o pé da frente para dar o próximo passo.",
        "Continue alternando as pernas pela distância definida.",
      ],
    },
    en: {
      name: "Walking Lunges (warm-up pace)",
      description: "A dynamic lower-body warm-up that also improves balance.",
      instructions: [
        "Step forward into a lunge, lowering the back knee toward the floor.",
        "Push off the front foot to step into the next lunge.",
        "Continue alternating legs for the set distance.",
      ],
    },
    es: {
      name: "Zancadas Caminando (Calentamiento)",
      description: "Un calentamiento dinámico para el tren inferior que también mejora el equilibrio.",
      instructions: [
        "Da un paso adelante en una zancada, bajando la rodilla trasera hacia el suelo.",
        "Empuja con el pie delantero para dar el siguiente paso.",
        "Continúa alternando las piernas durante la distancia establecida.",
      ],
    },
  },
  "foam-rolling-quads": {
    "pt-br": {
      name: "Liberação Miofascial — Quadríceps",
      description: "Liberação miofascial para a parte frontal da coxa, para aliviar a tensão pós-treino.",
      instructions: [
        "Deite de bruços com um rolo de espuma sob as coxas.",
        "Role lentamente de logo acima do joelho até logo abaixo do quadril.",
        "Pare nos pontos mais sensíveis por 20-30 segundos.",
      ],
    },
    en: {
      name: "Foam Rolling — Quads",
      description: "Self-myofascial release for the front of the thighs to ease post-workout tightness.",
      instructions: [
        "Lie face down with a foam roller under your thighs.",
        "Slowly roll from just above the knee to just below the hip.",
        "Pause on tender spots for 20-30 seconds.",
      ],
    },
    es: {
      name: "Liberación Miofascial — Cuádriceps",
      description: "Liberación miofascial para la parte frontal del muslo, para aliviar la tensión post-entreno.",
      instructions: [
        "Acuéstate boca abajo con un rodillo de espuma bajo los muslos.",
        "Rueda lentamente desde justo encima de la rodilla hasta justo debajo de la cadera.",
        "Detente en los puntos más sensibles durante 20-30 segundos.",
      ],
    },
  },
  "childs-pose": {
    "pt-br": {
      name: "Postura da Criança",
      description: "Um alongamento suave de descanso para as costas e o quadril, geralmente usado para encerrar a sessão.",
      instructions: [
        "Ajoelhe e sente sobre os calcanhares.",
        "Incline o tronco à frente, estendendo os braços à sua frente, testa em direção ao chão.",
        "Respire devagar e relaxe no alongamento.",
      ],
    },
    en: {
      name: "Child's Pose",
      description: "A gentle resting stretch for the back and hips, often used to close out a session.",
      instructions: [
        "Kneel and sit back onto your heels.",
        "Fold forward, extending your arms in front of you, forehead toward the floor.",
        "Breathe slowly and relax into the stretch.",
      ],
    },
    es: {
      name: "Postura del Niño",
      description: "Un estiramiento suave de descanso para la espalda y la cadera, usado a menudo para cerrar la sesión.",
      instructions: [
        "Arrodíllate y siéntate sobre los talones.",
        "Inclina el torso hacia adelante, extendiendo los brazos frente a ti, frente hacia el suelo.",
        "Respira despacio y relájate en el estiramiento.",
      ],
    },
  },
  "walking-cooldown": {
    "pt-br": {
      name: "Caminhada Leve de Desaquecimento",
      description: "Uma caminhada leve para reduzir gradualmente a frequência cardíaca após um treino intenso.",
      instructions: [
        "Caminhe em um ritmo leve e confortável por 5-10 minutos.",
        "Concentre-se em respirar de forma lenta e profunda.",
      ],
    },
    en: {
      name: "Easy Walking Cool-Down",
      description: "A low-intensity walk to gradually bring your heart rate down after intense training.",
      instructions: [
        "Walk at an easy, comfortable pace for 5-10 minutes.",
        "Focus on slow, deep breathing.",
      ],
    },
    es: {
      name: "Caminata Suave de Enfriamiento",
      description: "Una caminata de baja intensidad para bajar gradualmente la frecuencia cardíaca tras un entreno intenso.",
      instructions: [
        "Camina a un ritmo suave y cómodo durante 5-10 minutos.",
        "Concéntrate en respirar de forma lenta y profunda.",
      ],
    },
  },
  "box-breathing": {
    "pt-br": {
      name: "Respiração Quadrada",
      description: "Um padrão de respiração estruturado que apoia a recuperação ao acalmar o sistema nervoso.",
      instructions: [
        "Inspire lentamente contando até 4.",
        "Segure a respiração contando até 4.",
        "Expire lentamente contando até 4 e depois segure com os pulmões vazios contando até 4.",
        "Repita por vários ciclos.",
      ],
    },
    en: {
      name: "Box Breathing",
      description: "A structured breathing pattern that supports recovery by calming the nervous system.",
      instructions: [
        "Inhale slowly for a count of 4.",
        "Hold your breath for a count of 4.",
        "Exhale slowly for a count of 4, then hold empty for a count of 4.",
        "Repeat for several cycles.",
      ],
    },
    es: {
      name: "Respiración Cuadrada",
      description: "Un patrón de respiración estructurado que favorece la recuperación al calmar el sistema nervioso.",
      instructions: [
        "Inhala lentamente contando hasta 4.",
        "Sostén la respiración contando hasta 4.",
        "Exhala lentamente contando hasta 4 y luego sostén con los pulmones vacíos contando hasta 4.",
        "Repite durante varios ciclos.",
      ],
    },
  },
  "sit-up": {
    "pt-br": {
      name: "Abdominal (Padrão Militar)",
      description: "O abdominal clássico usado em testes de aptidão física militar — trabalha o core de forma completa.",
      instructions: [
        "Deite de costas com os joelhos dobrados e pés apoiados no chão.",
        "Cruze os braços sobre o peito ou entrelace os dedos atrás da cabeça.",
        "Suba o tronco até os cotovelos tocarem as coxas, depois desça com controle.",
      ],
      safetyNotes: ["Evite puxar o pescoço com as mãos ao subir."],
    },
    en: {
      name: "Sit-Up (Military Standard)",
      description: "The classic sit-up used in military fitness tests — works the core through a full range of motion.",
      instructions: [
        "Lie on your back with your knees bent and feet flat on the floor.",
        "Cross your arms over your chest or interlace your fingers behind your head.",
        "Curl your torso up until your elbows touch your thighs, then lower with control.",
      ],
      safetyNotes: ["Avoid pulling on your neck with your hands as you come up."],
    },
    es: {
      name: "Abdominal (Estándar Militar)",
      description: "El abdominal clásico usado en pruebas de aptitud física militar — trabaja el core en todo su rango de movimiento.",
      instructions: [
        "Acuéstate boca arriba con las rodillas dobladas y los pies apoyados en el suelo.",
        "Cruza los brazos sobre el pecho o entrelaza los dedos detrás de la cabeza.",
        "Sube el torso hasta que los codos toquen los muslos, luego baja con control.",
      ],
      safetyNotes: ["Evita tirar del cuello con las manos al subir."],
    },
  },
  "flutter-kicks": {
    "pt-br": {
      name: "Flutter Kicks",
      description: "Exercício clássico de condicionamento militar para o core e flexores do quadril.",
      instructions: [
        "Deite de costas com as mãos sob os glúteos e a cabeça levemente elevada.",
        "Levante as pernas retas a poucos centímetros do chão.",
        "Alterne pequenos chutes para cima e para baixo, mantendo o core contraído.",
      ],
      safetyNotes: ["Mantenha a lombar pressionada contra o chão para proteger as costas."],
    },
    en: {
      name: "Flutter Kicks",
      description: "A classic military conditioning move for the core and hip flexors.",
      instructions: [
        "Lie on your back with your hands under your glutes and your head slightly raised.",
        "Lift your straight legs a few inches off the floor.",
        "Alternate small up-and-down kicks, keeping your core braced throughout.",
      ],
      safetyNotes: ["Keep your lower back pressed into the floor to protect your spine."],
    },
    es: {
      name: "Flutter Kicks",
      description: "Un movimiento clásico de acondicionamiento militar para el core y los flexores de cadera.",
      instructions: [
        "Acuéstate boca arriba con las manos bajo los glúteos y la cabeza ligeramente elevada.",
        "Levanta las piernas rectas unos centímetros del suelo.",
        "Alterna pequeñas patadas hacia arriba y abajo, manteniendo el core contraído.",
      ],
      safetyNotes: ["Mantén la zona lumbar presionada contra el suelo para proteger la espalda."],
    },
  },
  "squat-thrust": {
    "pt-br": {
      name: "Squat Thrust",
      description: "A base do burpee — um movimento de condicionamento militar completo, sem o salto final.",
      instructions: [
        "Comece em pé, depois agache e apoie as mãos no chão.",
        "Jogue os pés para trás até a posição de prancha.",
        "Traga os pés de volta para perto das mãos e levante-se.",
      ],
    },
    en: {
      name: "Squat Thrust",
      description: "The foundation of the burpee — a full military conditioning move without the final jump.",
      instructions: [
        "Start standing, then squat down and place your hands on the floor.",
        "Kick your feet back into a plank position.",
        "Bring your feet back in toward your hands and stand up.",
      ],
    },
    es: {
      name: "Squat Thrust",
      description: "La base del burpee — un movimiento completo de acondicionamiento militar sin el salto final.",
      instructions: [
        "Comienza de pie, luego agáchate y coloca las manos en el suelo.",
        "Lleva los pies hacia atrás hasta la posición de plancha.",
        "Trae los pies de vuelta cerca de las manos y ponte de pie.",
      ],
    },
  },
  "squat-jump": {
    "pt-br": {
      name: "Squat Jump",
      description: "Um agachamento explosivo que desenvolve potência nas pernas, usado em treinos de condicionamento militar.",
      instructions: [
        "Fique em pé com os pés na largura dos ombros.",
        "Agache até a coxa ficar paralela ao chão.",
        "Exploda para cima em um salto, aterrissando suavemente de volta no agachamento.",
      ],
      safetyNotes: ["Aterrisse com os joelhos levemente flexionados para absorver o impacto."],
    },
    en: {
      name: "Squat Jump",
      description: "An explosive squat that builds leg power, used in military-style conditioning workouts.",
      instructions: [
        "Stand with feet shoulder-width apart.",
        "Squat down until your thighs are parallel to the floor.",
        "Explode upward into a jump, landing softly back into the squat.",
      ],
      safetyNotes: ["Land with knees slightly bent to absorb the impact."],
    },
    es: {
      name: "Squat Jump",
      description: "Una sentadilla explosiva que desarrolla potencia en las piernas, usada en entrenos de acondicionamiento militar.",
      instructions: [
        "Ponte de pie con los pies al ancho de los hombros.",
        "Agáchate hasta que los muslos queden paralelos al suelo.",
        "Explota hacia arriba en un salto, aterrizando suavemente de vuelta en la sentadilla.",
      ],
      safetyNotes: ["Aterriza con las rodillas ligeramente flexionadas para absorber el impacto."],
    },
  },
};
