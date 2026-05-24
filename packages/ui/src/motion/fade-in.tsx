"use client";
import * as React from "react";
import { cn } from "../lib/cn";

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  as?: "div" | "section" | "article" | "span";
}

/**
 * CSS-only reveal-on-mount. Honors `prefers-reduced-motion`.
 * GSAP-driven scroll reveals live in `apps/user/app/_components`
 * for marketing-only motion. This is the lightweight default.
 */
export function FadeIn({
  className,
  delay = 0,
  as: As = "div",
  style,
  ...props
}: FadeInProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <As
      className={cn(
        "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 motion-reduce:opacity-100 motion-reduce:translate-y-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...props}
    />
  );
}
