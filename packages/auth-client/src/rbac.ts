import type { AuthUser, RoleName } from "./types";

export const ROLE_HIERARCHY: Record<RoleName, number> = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  BUSINESS_OWNER: 3,
  MANAGER: 4,
  ANALYST: 5,
  MEMBER: 6,
};

export function hasMinRole(user: AuthUser | null, min: RoleName): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] <= ROLE_HIERARCHY[min];
}

export function can(user: AuthUser | null, resource: string, action: string): boolean {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;
  return user.permissions.some((p) => p.resource === resource && p.action === action);
}
