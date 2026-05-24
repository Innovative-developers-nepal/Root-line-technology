import * as React from "react";
import { cn } from "../lib/cn";

export interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  fade?: boolean;
}

export function GridBackground({ fade = true, className, ...props }: GridBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        "[background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)]",
        "[background-size:48px_48px]",
        fade &&
          "[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
        "opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function DotBackground({ fade = true, className, ...props }: GridBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        "[background-image:radial-gradient(var(--color-border)_1px,transparent_1px)]",
        "[background-size:24px_24px]",
        fade &&
          "[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
        "opacity-60",
        className,
      )}
      {...props}
    />
  );
}
