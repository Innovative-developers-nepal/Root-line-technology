import type { AuthSession, AuthUser, RoleName } from "./types";

function mapUser(raw: Record<string, unknown>): AuthUser {
  const role = (raw.role as { name?: string })?.name ?? raw.roleName ?? "MEMBER";
  return {
    id: raw.id as string,
    email: raw.email as string,
    name: `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim() || (raw.email as string),
    role: role as RoleName,
    permissions: (raw.permissions as AuthUser["permissions"]) ?? [],
  };
}

/**
 * Server-side session fetch. Use in Next middleware or RSC layouts.
 * Calls backend `/api/v1/auth/me` with forwarded cookies.
 */
export async function getSessionFromHeaders(headers: Headers): Promise<AuthSession | null> {
  const cookie = headers.get("cookie");
  if (!cookie) return null;
  const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
  try {
    const res = await fetch(`${baseURL}/api/v1/auth/me`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: Record<string, unknown> } | null;
    if (!json?.data) return null;
    return { user: mapUser(json.data), expiresAt: "" };
  } catch {
    return null;
  }
}
