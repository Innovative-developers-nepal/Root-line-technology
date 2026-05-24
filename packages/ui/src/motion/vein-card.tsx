"use client";
import * as React from "react";
import { useState } from "react";
import { cn } from "../lib/cn";

export interface VeinCardProps extends React.HTMLAttributes<HTMLDivElement> {
  veinColor?: string;
  duration?: number;
  radius?: number;
}

/**
 * Card whose root-vein border traces around the perimeter on hover.
 * Inline stroke with pathLength + dashoffset animates via React state on hover.
 */
export function VeinCard({
  veinColor = "var(--color-primary)",
  duration = 1.2,
  radius = 6,
  className,
  children,
  ...props
}: VeinCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative isolate overflow-hidden rounded-md border border-border bg-card transition-colors",
        className,
      )}
      {...props}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        fill="none"
      >
        <rect
          x="0.75"
          y="0.75"
          width="calc(100% - 1.5px)"
          height="calc(100% - 1.5px)"
          rx={radius}
          ry={radius}
          stroke={veinColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={hovered ? 0 : 1}
          style={{
            transition: `stroke-dashoffset ${duration}s cubic-bezier(0.22,1,0.36,1)`,
            opacity: hovered ? 1 : 0,
          }}
        />
        <rect
          x="0.75"
          y="0.75"
          width="calc(100% - 1.5px)"
          height="calc(100% - 1.5px)"
          rx={radius}
          ry={radius}
          stroke={veinColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={hovered ? 0 : 1}
          style={{
            transition: `stroke-dashoffset ${duration}s cubic-bezier(0.22,1,0.36,1)`,
            opacity: hovered ? 0.35 : 0,
            filter: "blur(3px)",
          }}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
