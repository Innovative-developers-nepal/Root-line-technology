export type RoleName =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "BUSINESS_OWNER"
  | "MANAGER"
  | "ANALYST"
  | "MEMBER";

export type Permission = {
  resource: string;
  action: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role: RoleName;
  permissions: Permission[];
};

export type AuthSession = {
  user: AuthUser;
  expiresAt: string;
};
