// Central domain types. Kept framework-agnostic on purpose.

export type UserRole =
  | "member"
  | "coach"
  | "gym_staff"
  | "gym_manager"
  | "gym_owner"
  | "support"
  | "platform_admin"
  | "super_admin";

export type SupportedCountry = "BR" | "PT" | "ES" | "US";
export type SupportedLocale = "pt-BR" | "pt-PT" | "es-ES" | "en-US";

export interface FitPulseUser {
  id: string; // Firebase UID — never use email as primary identifier
  email: string;
  displayName: string;
  photoURL?: string;
  roles: UserRole[];
  country: SupportedCountry;
  locale: SupportedLocale;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  birthDate?: string;
  age?: number;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  heightCm?: number;
  weightKg?: number;
  waistCm?: number;
  neckCm?: number;
  hipCm?: number;
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  bodyTypeSelfDescription?:
    | "lean" | "average" | "athletic" | "higher_body_weight" | "muscular" | "prefer_not_to_say";
}

export type FitnessGoal =
  | "lose_weight" | "build_muscle" | "increase_strength" | "improve_conditioning"
  | "military_fitness" | "calisthenics" | "improve_mobility" | "improve_endurance"
  | "stay_active" | "general_fitness";

export type TrainingEnvironment =
  | "gym" | "home" | "outdoor" | "military_calisthenics" | "hybrid" | "with_coach";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface FitnessProfile {
  userId: string;
  goals: FitnessGoal[];
  environment: TrainingEnvironment[];
  experience: ExperienceLevel;
  daysAvailable: number;
  minutesAvailable: number;
  equipment: string[];
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  country: SupportedCountry;
}

export interface OrganizationMember {
  organizationId: string;
  userId: string;
  role: Extract<UserRole, "gym_staff" | "gym_manager" | "gym_owner" | "coach" | "member">;
  active: boolean;
}

export interface GymProfile {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  city?: string;
  country?: SupportedCountry;
  address?: string;
  amenities: string[];
  createdAt: string;
}

export interface GymStaffRelationship {
  gymId: string;
  staffId: string;
  staffDisplayName?: string;
  role: "gym_staff" | "gym_manager";
  status: "pending" | "active" | "ended";
  createdAt: string;
}

export interface GymMembership {
  gymId: string;
  memberId: string;
  memberDisplayName?: string;
  status: "active" | "ended";
  createdAt: string;
}

export interface CoachProfile {
  userId: string;
  displayName?: string;
  bio: string;
  specialties: string[];
  languages: string[];
  city?: string;
  country?: SupportedCountry;
  online: boolean;
  inPerson: boolean;
  pricingNote?: string;
  photoURL?: string;
  verificationStatus: "unverified" | "verified";
  createdAt: string;
}

export interface CoachRelationship {
  id: string;
  memberId: string;
  memberDisplayName?: string;
  coachId: string;
  status: "pending" | "active" | "ended";
  permissions: {
    workouts: boolean;
    progress: boolean;
    measurements: boolean;
    progressPhotos: boolean;
    healthIntegrations: boolean;
    checkins: boolean;
  };
  createdAt: string;
  startDate?: string;
  endDate?: string;
}
