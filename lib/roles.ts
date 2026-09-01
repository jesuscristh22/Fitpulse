import type { UserRole } from "./types";

// Role checks must ALSO be enforced server-side via Firebase Custom Claims
// and Firestore Security Rules. Never trust these on the client alone.
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  member: 0, coach: 1, gym_staff: 1, gym_manager: 2, gym_owner: 3,
  support: 4, platform_admin: 5, super_admin: 6,
};

export function hasRole(userRoles: UserRole[], required: UserRole): boolean {
  return userRoles.includes(required);
}
export function hasAnyRole(userRoles: UserRole[], required: UserRole[]): boolean {
  return required.some((r) => userRoles.includes(r));
}
export function isPlatformStaff(userRoles: UserRole[]): boolean {
  return hasAnyRole(userRoles, ["support", "platform_admin", "super_admin"]);
}
