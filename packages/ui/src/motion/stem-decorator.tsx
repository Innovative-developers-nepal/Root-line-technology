"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "./hooks";

type AccentColor = "primary" | "earth";
type StemPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface LeafDef {
  path: string;
  vein: string;
  x: number;
  y: number;
  rot: number;
  scale?: number;
}

interface StemConfig {
  stem: string;
  viewBox: string;
  leaves: LeafDef[];
}

const STEMS: Record<StemPosition, StemConfig> = {
  "bottom-left": {
    viewBox: "0 0 120 140",
    stem: "M100,130 C75,120 55,100 45,75 C35,50 25,30 10,10",
    leaves: [
      { path: "M0,0 C6,-9 18,-7 22,0 C18,7 6,9 0,0Z", vein: "M0,0 Q11,-2 20,0", x: 50, y: 82, rot: -20, scale: 1 },
      { path: "M0,0 C5,-8 16,-6 20,0 C16,6 5,8 0,0Z", vein: "M0,0 Q10,-1 18,0", x: 32, y: 52, rot: -35, scale: 0.9 },
      { path: "M0,0 C4,-7 14,-5 17,0 C14,5 4,7 0,0Z", vein: "M0,0 Q8,-1 15,0", x: 18, y: 24, rot: -50, scale: 0.7 },
    ],
  },
  "top-right": {
    viewBox: "0 0 120 140",
    stem: "M20,10 C45,20 65,40 75,65 C85,90 95,110 110,130",
    leaves: [
      { path: "M0,0 C6,-9 18,-7 22,0 C18,7 6,9 0,0Z", vein: "M0,0 Q11,-2 20,0", x: 70, y: 58, rot: 20, scale: 1 },
      { path: "M0,0 C5,-8 16,-6 20,0 C16,6 5,8 0,0Z", vein: "M0,0 Q10,-1 18,0", x: 88, y: 82, rot: 35, scale: 0.9 },
      { path: "M0,0 C4,-7 14,-5 17,0 C14,5 4,7 0,0Z", vein: "M0,0 Q8,-1 15,0", x: 102, y: 116, rot: 50, scale: 0.7 },
    ],
  },
  "top-left": {
    viewBox: "0 0 120 140",
    stem: "M100,10 C75,20 55,40 45,65 C35,90 25,110 10,130",
    leaves: [
      { path: "M0,0 C6,-9 18,-7 22,0 C18,7 6,9 0,0Z", vein: "M0,0 Q11,-2 20,0", x: 50, y: 58, rot: -160, scale: 1 },
      { path: "M0,0 C5,-8 16,-6 20,0 C16,6 5,8 0,0Z", vein: "M0,0 Q10,-1 18,0", x: 32, y: 82, rot: -145, scale: 0.9 },
      { path: "M0,0 C4,-7 14,-5 17,0 C14,5 4,7 0,0Z", vein: "M0,0 Q8,-1 15,0", x: 18, y: 116, rot: -130, scale: 0.7 },
    ],
  },
  "bottom-right": {
    viewBox: "0 0 120 140",
    stem: "M20,130 C45,120 65,100 75,75 C85,50 95,30 110,10",
    leaves: [
      { path: "M0,0 C6,-9 18,-7 22,0 C18,7 6,9 0,0Z", vein: "M0,0 Q11,-2 20,0", x: 70, y: 82, rot: 160, scale: 1 },
      { path: "M0,0 C5,-8 16,-6 20,0 C16,6 5,8 0,0Z", vein: "M0,0 Q10,-1 18,0", x: 88, y: 52, rot: 145, scale: 0.9 },
      { path: "M0,0 C4,-7 14,-5 17,0 C14,5 4,7 0,0Z", vein: "M0,0 Q8,-1 15,0", x: 102, y: 24, rot: 130, scale: 0.7 },
    ],
  },
};

const ACCENT_STEM: Record<AccentColor, { stroke: string; fill: string }> = {
  primary: { stroke: "stroke-primary/30 dark:stroke-primary/25", fill: "fill-primary/15 dark:fill-primary/10" },
  earth: { stroke: "stroke-accent/30 dark:stroke-accent/25", fill: "fill-accent/15 dark:fill-accent/10" },
};

interface StemDecoratorProps {
  position: StemPosition;
  accent: AccentColor;
  className?: string;
  size?: "sm" | "lg";
}

export function StemDecorator({ position, accent, className, size = "sm" }: StemDecoratorProps) {
  const reduced = usePrefersReducedMotion();
  const cfg = STEMS[position];
  const colors = ACCENT_STEM[accent];
  const dim = size === "lg" ? "w-40 h-48" : "w-32 h-36";

  const posClass =
    position === "top-left" ? "-top-6 -left-6" :
    position === "top-right" ? "-top-6 -right-6" :
    position === "bottom-left" ? "-bottom-6 -left-6" :
    "-bottom-6 -right-6";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 overflow-visible",
        dim,
        posClass,
        className,
      )}
    >
      <svg
        viewBox={cfg.viewBox}
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {cfg.leaves.map((leaf, i) => (
          <g
            key={i}
            transform={`translate(${leaf.x},${leaf.y}) rotate(${leaf.rot}) scale(${leaf.scale ?? 1})`}
          >
            <motion.path
              d={leaf.path}
              className={colors.fill}
              stroke="none"
              animate={reduced ? {} : { rotate: [0, i % 2 === 0 ? 3 : -3, 0] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
            <motion.path
              d={leaf.vein}
              className={colors.stroke}
              strokeWidth="0.8"
              strokeLinecap="round"
              animate={reduced ? {} : { rotate: [0, i % 2 === 0 ? 3 : -3, 0] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          </g>
        ))}
        <path
          d={cfg.stem}
          className={colors.stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={cfg.stem}
          className={colors.stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.15"
        />
      </svg>
    </div>
  );
}
