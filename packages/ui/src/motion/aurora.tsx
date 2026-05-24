"use client";
import * as React from "react";
import { cn } from "../lib/cn";

export interface AuroraProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "subtle" | "medium" | "strong";
}

export function Aurora({ intensity = "medium", className, ...props }: AuroraProps) {
  const opacity = intensity === "subtle" ? "opacity-30" : intensity === "strong" ? "opacity-80" : "opacity-50";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn(
          "absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl",
          opacity,
          "bg-[radial-gradient(circle_at_30%_40%,var(--color-primary),transparent_60%),radial-gradient(circle_at_70%_60%,var(--color-accent),transparent_55%)]",
        )}
      />
    </div>
  );
}
