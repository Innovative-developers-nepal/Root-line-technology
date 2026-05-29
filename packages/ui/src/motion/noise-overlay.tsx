import * as React from "react";
import { cn } from "../lib/cn";

interface NoiseOverlayProps {
  className?: string;
  opacity?: number;
}

export function NoiseOverlay({ className, opacity = 0.015 }: NoiseOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 z-50", className)}
      style={{ opacity }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" opacity="1" />
      </svg>
    </div>
  );
}
