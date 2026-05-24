"use client";
import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";

export type PostHogProviderProps = {
  apiKey?: string;
  apiHost?: string;
  children: ReactNode;
};

export function PostHogProvider({ apiKey, apiHost, children }: PostHogProviderProps) {
  useEffect(() => {
    if (!apiKey) return;
    if (typeof window === "undefined") return;
    if (posthog.__loaded) return;
    posthog.init(apiKey, {
      api_host: apiHost ?? "https://app.posthog.com",
      capture_pageview: false,
      person_profiles: "identified_only",
    });
  }, [apiKey, apiHost]);

  return <>{children}</>;
}
