import type { CoachRelationship } from "./types";

export const DEFAULT_COACH_PERMISSIONS: CoachRelationship["permissions"] = {
  workouts: true, progress: false, measurements: false,
  progressPhotos: false, healthIntegrations: false, checkins: true,
};

export function canCoachViewField(
  relationship: CoachRelationship,
  field: keyof CoachRelationship["permissions"],
): boolean {
  return relationship.status === "active" && relationship.permissions[field];
}
