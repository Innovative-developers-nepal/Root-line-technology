"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

export function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!posthog.__loaded) return;
    const url = `${pathname}${search?.toString() ? `?${search.toString()}` : ""}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, search]);

  return null;
}
