import * as React from "react";
import { cn } from "../lib/cn";

interface WavyDividerProps {
  className?: string;
  color?: string;
}

export function WavyDivider({ className, color }: WavyDividerProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none w-full overflow-hidden", className)}
    >
      <svg
        viewBox="0 0 1440 32"
        preserveAspectRatio="none"
        className="h-8 w-full"
        style={{ color: color ?? "hsl(var(--color-border))" }}
      >
        <path
          d="M0,16 Q60,0 120,16 T240,16 T360,16 T480,16 T600,16 T720,16 T840,16 T960,16 T1080,16 T1200,16 T1320,16 T1440,16"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <path
          d="M0,24 Q80,8 160,24 T320,24 T480,24 T640,24 T800,24 T960,24 T1120,24 T1280,24 T1440,24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
