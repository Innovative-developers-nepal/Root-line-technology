"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "./hooks";

interface RootPath {
  d: string;
  w: number;
  c: "primary" | "accent";
  delay: number;
}

const PATH_DURATIONS = [2.6, 2.8, 2.4, 2.5, 2.7, 1.8, 2.0, 1.6, 1.7, 1.5, 1.6, 1.4, 1.3, 1.2, 1.1, 1.2, 1.0, 1.1, 0.9, 1.0, 0.9, 0.8, 0.9, 0.8];

const PATHS: RootPath[] = [
  // Main taproots — thick, anchor the composition
  { d: "M480,900 C460,780 520,680 490,560 C460,440 480,340 490,240", w: 3, c: "primary", delay: 0 },
  { d: "M720,900 C690,800 760,680 730,540 C700,400 720,280 710,160", w: 3.5, c: "accent", delay: 0.15 },
  { d: "M960,900 C990,790 930,660 950,520 C970,380 940,280 960,180", w: 2.5, c: "primary", delay: 0.3 },
  { d: "M180,900 C150,800 200,680 170,540 C140,400 160,300 180,200", w: 2.2, c: "accent", delay: 0.1 },
  { d: "M1260,900 C1290,790 1240,660 1270,520 C1300,380 1260,280 1250,180", w: 2.8, c: "primary", delay: 0.25 },

  // Secondary branches — medium thickness
  { d: "M490,560 C430,530 380,490 340,440 C310,400 290,360 270,320", w: 1.5, c: "accent", delay: 0.5 },
  { d: "M730,540 C790,490 840,440 870,380 C890,340 900,300 910,260", w: 1.8, c: "primary", delay: 0.55 },
  { d: "M170,540 C110,500 70,450 40,390", w: 1.2, c: "primary", delay: 0.6 },
  { d: "M1270,520 C1330,470 1370,420 1400,360", w: 1.4, c: "accent", delay: 0.65 },
  { d: "M490,340 C430,310 380,280 350,240", w: 1, c: "accent", delay: 0.7 },
  { d: "M950,380 C890,350 840,320 810,280", w: 1.2, c: "accent", delay: 0.75 },
  { d: "M730,160 C670,130 620,110 580,100", w: 1, c: "primary", delay: 0.8 },
  { d: "M960,180 C1020,150 1060,130 1100,120", w: 0.8, c: "primary", delay: 0.85 },

  // Tertiary root hairs — fine details
  { d: "M340,440 C320,430 300,420 280,415", w: 0.5, c: "primary", delay: 1 },
  { d: "M870,380 C890,370 910,365 930,360", w: 0.5, c: "accent", delay: 1.05 },
  { d: "M40,390 C25,380 15,370 10,360", w: 0.4, c: "primary", delay: 1.1 },
  { d: "M1400,360 C1410,350 1425,345 1435,340", w: 0.4, c: "accent", delay: 1.15 },
  { d: "M350,240 C330,230 315,225 300,220", w: 0.4, c: "primary", delay: 1.2 },
  { d: "M810,280 C790,270 775,265 760,260", w: 0.4, c: "accent", delay: 1.25 },
  { d: "M580,100 C560,95 540,92 520,90", w: 0.3, c: "primary", delay: 1.3 },
  { d: "M1100,120 C1120,115 1140,112 1160,110", w: 0.3, c: "accent", delay: 1.35 },
  { d: "M270,320 C250,310 235,305 220,300", w: 0.3, c: "primary", delay: 1.4 },
  { d: "M910,260 C930,250 945,245 960,240", w: 0.3, c: "accent", delay: 1.45 },
  { d: "M490,240 C510,230 530,225 550,220", w: 0.35, c: "accent", delay: 1.5 },
  { d: "M710,160 C690,150 670,145 650,140", w: 0.35, c: "primary", delay: 1.55 },
];

interface RootSystemProps {
  className?: string;
  fadeHeight?: number;
}

export function RootSystem({ className, fadeHeight = 240 }: RootSystemProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Soil gradient at the base */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ height: fadeHeight }}
      >
        <div
          className="h-full w-full"
          style={{
            background: `linear-gradient(to top, 
              hsl(var(--color-accent) / 0.3) 0%,
              hsl(var(--color-accent) / 0.12) 30%,
              hsl(var(--color-primary) / 0.05) 60%,
              transparent 100%
            )`,
          }}
        />
        {/* Soil texture dots */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--color-accent) / 0.4) 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
      </div>

      {/* SVG Root System */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-1/2 h-full w-full -translate-x-1/2"
        style={{ maxHeight: "110%", minWidth: "100%" }}
      >
        <defs>
          <linearGradient id="root-grad-primary" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="hsl(var(--color-primary) / 0.35)" />
            <stop offset="60%" stopColor="hsl(var(--color-primary) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--color-primary) / 0)" />
          </linearGradient>
          <linearGradient id="root-grad-accent" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="hsl(var(--color-accent) / 0.4)" />
            <stop offset="50%" stopColor="hsl(var(--color-accent) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--color-accent) / 0)" />
          </linearGradient>
        </defs>

        {PATHS.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            fill="none"
            stroke={`url(#root-grad-${p.c})`}
            strokeWidth={p.w}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 0.4 }}
            animate={
              reduced
                ? { opacity: 1 }
                : { pathLength: 1, opacity: 1 }
            }
            transition={{
              pathLength: {
                delay: p.delay,
                duration: PATH_DURATIONS[i % PATH_DURATIONS.length],
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                delay: p.delay,
                duration: 1,
                ease: "easeOut",
              },
            }}
          />
        ))}
      </svg>
    </div>
  );
}
