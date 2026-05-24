"use client";
import posthog from "posthog-js";

export function identify(user: { id: string; email?: string; role?: string }): void {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;
  posthog.identify(user.id, { email: user.email, role: user.role });
}

export function resetIdentity(): void {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;
  posthog.reset();
}
