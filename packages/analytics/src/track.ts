"use client";
import posthog from "posthog-js";
import type { AnalyticsEvents, AnalyticsEventName } from "./events";

export function track<E extends AnalyticsEventName>(event: E, props: AnalyticsEvents[E]): void {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;
  posthog.capture(event, props as Record<string, unknown>);
}
