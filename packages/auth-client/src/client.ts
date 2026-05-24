"use client";

const API =
  (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : undefined) ??
  "http://localhost:5000";

async function fetchApi<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? json?.error?.message ?? "Request failed");
  return json.data as T;
}

export type SignInResult = { user: Record<string, unknown>; accessToken: string };

export async function signIn(email: string, password: string): Promise<SignInResult> {
  return fetchApi<SignInResult>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signOut(): Promise<void> {
  await fetchApi("/api/v1/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<Record<string, unknown>> {
  return fetchApi("/api/v1/auth/me");
}
