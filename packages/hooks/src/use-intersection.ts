"use client";
import { type RefObject, useEffect, useState } from "react";

export function useIntersection(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit,
): { entry: IntersectionObserverEntry | null; isIntersecting: boolean } {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setEntry(e ?? null), options);
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, options]);

  return { entry, isIntersecting: entry?.isIntersecting ?? false };
}
