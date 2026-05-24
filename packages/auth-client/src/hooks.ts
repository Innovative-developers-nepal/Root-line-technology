"use client";
import { useEffect, useState } from "react";
import { signIn as apiSignIn, signOut as apiSignOut } from "./client";
import type { AuthUser, Permission, RoleName } from "./types";

const API =
  (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : undefined) ??
  "http://localhost:5000";

function mapUser(raw: Record<string, unknown>): AuthUser {
  const role = (raw.role as { name?: string })?.name ?? raw.roleName ?? "MEMBER";
  const perms: Permission[] = (raw.permissions as Permission[]) ?? [];
  return {
    id: raw.id as string,
    email: raw.email as string,
    name: `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim() || (raw.email as string),
    role: role as RoleName,
    permissions: perms,
  };
}

async function fetchMe(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API}/api/v1/auth/me`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? "Not authenticated");
  return json.data as Record<string, unknown>;
}

export function useSession(): { session: { user: AuthUser; expiresAt: string } | null; isPending: boolean } {
  const [session, setSession] = useState<{ user: AuthUser; expiresAt: string } | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setSession({ user: mapUser(data), expiresAt: "" });
        setIsPending(false);
      })
      .catch(() => {
        setSession(null);
        setIsPending(false);
      });
  }, []);

  return { session, isPending };
}

export function useUser(): AuthUser | null {
  return useSession().session?.user ?? null;
}

export function useSignIn() {
  return apiSignIn;
}

export function useSignOut() {
  return apiSignOut;
}
