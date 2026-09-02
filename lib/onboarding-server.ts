import "server-only";
import { adminAuth, adminDb } from "./firebase-admin";
import { onboardingSchema } from "./validation";

function calculateAge(birthDateISO: string): number {
  const birth = new Date(birthDateISO);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Verifies the caller's ID token server-side, validates the full onboarding
// payload against the shared Zod schema (never trust client-side validation
// alone), then writes to user_profiles + fitness_profiles + updates the base
// users doc — all via the Admin SDK, which bypasses Firestore Security Rules
// safely because the uid comes from the verified token, not from the request body.
export async function completeOnboarding(idToken: string, rawInput: unknown) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const uid = decoded.uid;
  const input = onboardingSchema.parse(rawInput);
  const age = calculateAge(input.birthDate);

  await adminDb().collection("user_profiles").doc(uid).set(
    {
      userId: uid,
      birthDate: input.birthDate,
      age,
      gender: input.gender,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
    },
    { merge: true },
  );

  await adminDb().collection("fitness_profiles").doc(uid).set(
    {
      userId: uid,
      goals: input.goals,
      environment: input.environment,
      experience: input.experience,
      daysAvailable: input.daysAvailable,
      minutesAvailable: input.minutesAvailable,
      equipment: input.equipment,
    },
    { merge: true },
  );

  await adminDb().collection("users").doc(uid).set(
    {
      displayName: input.displayName,
      country: input.country,
      locale: input.locale,
    },
    { merge: true },
  );

  return { uid, age };
}
