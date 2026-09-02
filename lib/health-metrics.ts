// General wellness reference calculations — informational only, never a
// medical diagnosis or prescription. All results should be shown with a
// disclaimer pointing people to a doctor/nutritionist for personalized advice.

export function calculateAge(birthDateISO?: string): number | null {
  if (!birthDateISO) return null;
  const birth = new Date(birthDateISO);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// US Navy method — needs waist + neck (+ hip for women). Returns null when
// the inputs needed for the person's method aren't available yet.
export function calculateBodyFatPercent(params: {
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  heightCm?: number;
  waistCm?: number;
  neckCm?: number;
  hipCm?: number;
}): number | null {
  const { gender, heightCm, waistCm, neckCm, hipCm } = params;
  if (!heightCm || !waistCm || !neckCm) return null;

  if (gender === "female") {
    if (!hipCm) return null;
    const val =
      495 /
        (1.29579 -
          0.35004 * Math.log10(waistCm + hipCm - neckCm) +
          0.221 * Math.log10(heightCm)) -
      450;
    return Number(val.toFixed(1));
  }

  // Default to the male formula for male/other/unspecified, since it only
  // needs waist+neck (no extra field to demand from people who skip gender).
  const val =
    495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  return Number(val.toFixed(1));
}

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Mifflin-St Jeor — the most widely validated BMR formula for the general
// population. Returns null until age/height/weight/gender are all available.
export function calculateBmr(params: {
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  heightCm?: number;
  weightKg?: number;
  age?: number | null;
}): number | null {
  const { gender, heightCm, weightKg, age } = params;
  if (!heightCm || !weightKg || !age) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === "female") return Math.round(base - 161);
  return Math.round(base + 5); // male/other/unspecified default
}

export function calculateTdee(bmr: number | null, activityLevel: ActivityLevel): number | null {
  if (bmr === null) return null;
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}
