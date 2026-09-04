import type { LocaleSlug } from "./locales-config";

export interface Challenge {
  slug: string;
  name: string;
  description: string;
  durationDays: number;
  goalCheckins: number;
  isPremium: boolean;
}

export interface ChallengeParticipant {
  id?: string;
  challengeId: string;
  userId: string;
  joinedAt: string;
  checkinDates: string[]; // ISO dates (YYYY-MM-DD), one per day checked in
}

// Simple, unified progress model across every challenge: check in once per
// day, hit the goal number of check-ins before the challenge's duration
// runs out. This keeps free and premium challenges, and different themes
// (consistency, tactical, dance), all working through the same logic.
const CHALLENGES: Record<LocaleSlug, Challenge[]> = {
  "pt-br": [
    { slug: "consistencia-30-dias", name: "30 Dias de Consistência", description: "Treine pelo menos 20 dos próximos 30 dias — o hábito importa mais que a intensidade.", durationDays: 30, goalCheckins: 20, isPremium: false },
    { slug: "movimento-diario-14-dias", name: "Movimento Diário — 14 Dias", description: "Mova o corpo todos os dias por 14 dias seguidos, nem que seja uma caminhada curta.", durationDays: 14, goalCheckins: 14, isPremium: false },
    { slug: "tactical-4-semanas", name: "Desafio Tactical — 4 Semanas", description: "Complete seu programa Tactical por 4 semanas seguidas, sem pular mais de um dia por semana.", durationDays: 28, goalCheckins: 24, isPremium: true },
  ],
  en: [
    { slug: "consistencia-30-dias", name: "30-Day Consistency Challenge", description: "Train at least 20 of the next 30 days — the habit matters more than the intensity.", durationDays: 30, goalCheckins: 20, isPremium: false },
    { slug: "movimento-diario-14-dias", name: "Daily Movement — 14 Days", description: "Move your body every day for 14 days straight, even if it's just a short walk.", durationDays: 14, goalCheckins: 14, isPremium: false },
    { slug: "tactical-4-semanas", name: "Tactical Challenge — 4 Weeks", description: "Complete your Tactical program for 4 straight weeks, missing no more than one day per week.", durationDays: 28, goalCheckins: 24, isPremium: true },
  ],
  es: [
    { slug: "consistencia-30-dias", name: "Desafío de Consistencia — 30 Días", description: "Entrena al menos 20 de los próximos 30 días — el hábito importa más que la intensidad.", durationDays: 30, goalCheckins: 20, isPremium: false },
    { slug: "movimiento-diario-14-dias", name: "Movimiento Diario — 14 Días", description: "Mueve el cuerpo todos los días durante 14 días seguidos, aunque sea una caminata corta.", durationDays: 14, goalCheckins: 14, isPremium: false },
    { slug: "tactical-4-semanas", name: "Desafío Tactical — 4 Semanas", description: "Completa tu programa Tactical durante 4 semanas seguidas, sin fallar más de un día por semana.", durationDays: 28, goalCheckins: 24, isPremium: true },
  ],
};

export function getChallenges(locale: LocaleSlug): Challenge[] {
  return CHALLENGES[locale];
}
