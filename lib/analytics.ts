export const ANALYTICS_EVENTS = {
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",
  ONBOARDING_COMPLETED: "onboarding_completed",
  WORKOUT_CREATED: "workout_created",
  WORKOUT_STARTED: "workout_started",
  WORKOUT_COMPLETED: "workout_completed",
  EXERCISE_COMPLETED: "exercise_completed",
  MILITARY_CHECKOUT_STARTED: "military_checkout_started",
  MILITARY_PURCHASE_COMPLETED: "military_purchase_completed",
  MILITARY_PROGRAM_GENERATED: "military_program_generated",
  PRO_CHECKOUT_STARTED: "pro_checkout_started",
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
  COACH_CONNECTED: "coach_connected",
  GYM_CONNECTED: "gym_connected",
  LEAD_CREATED: "lead_created",
  CHALLENGE_JOINED: "challenge_joined",
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
