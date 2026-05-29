"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "./hooks";

interface RootPath {
  d: string;
  w: number;
  delay: number;
  dur: number;
}

const PATHS: RootPath[] = [
  // Main taproot
  { d: "M400,640 C390,500 415,400 400,280 C385,160 408,80 400,20", w: 2, delay: 0, dur: 2.5 },
  // Primary branches
  { d: "M400,480 C350,460 300,470 250,450 C220,438 200,440 180,430", w: 1.2, delay: 0.3, dur: 1.8 },
  { d: "M400,380 C450,360 510,370 560,350 C590,338 610,340 630,330", w: 1.2, delay: 0.35, dur: 1.8 },
  { d: "M400,280 C350,260 310,270 270,250 C240,238 220,240 200,230", w: 1, delay: 0.4, dur: 1.6 },
  { d: "M400,240 C450,220 500,230 540,210 C570,198 590,200 610,190", w: 1, delay: 0.45, dur: 1.6 },
  { d: "M400,160 C365,140 335,150 305,130 C285,118 270,120 255,110", w: 0.8, delay: 0.5, dur: 1.4 },
  { d: "M400,120 C435,100 465,110 495,90 C515,78 530,80 545,70", w: 0.8, delay: 0.55, dur: 1.4 },
  // Secondary branches (thinner)
  { d: "M250,450 C235,440 220,442 210,435", w: 0.5, delay: 0.7, dur: 1 },
  { d: "M560,350 C575,340 590,342 600,335", w: 0.5, delay: 0.75, dur: 1 },
  { d: "M270,250 C255,240 245,242 235,235", w: 0.5, delay: 0.8, dur: 1 },
  { d: "M540,210 C555,200 565,202 575,195", w: 0.5, delay: 0.85, dur: 1 },
];

const NODES: { cx: number; cy: number; r: number; delay: number }[] = [
  { cx: 180, cy: 430, r: 3, delay: 0.6 },
  { cx: 630, cy: 330, r: 3, delay: 0.65 },
  { cx: 200, cy: 230, r: 2.5, delay: 0.7 },
  { cx: 610, cy: 190, r: 2.5, delay: 0.75 },
  { cx: 255, cy: 110, r: 2, delay: 0.8 },
  { cx: 545, cy: 70, r: 2, delay: 0.85 },
  { cx: 400, cy: 20, r: 3.5, delay: 0.3 },
  { cx: 400, cy: 640, r: 4, delay: 0 },
];

const CROSS_LINKS: { d: string; delay: number }[] = [
  { d: "M180,430 C250,400 300,380 400,380", delay: 0.9 },
  { d: "M630,330 C560,300 500,280 400,280", delay: 0.95 },
  { d: "M200,230 C260,210 320,200 400,240", delay: 1 },
  { d: "M610,190 C540,170 480,160 400,160", delay: 1.05 },
];

interface RootMotifProps {
  className?: string;
}

export function RootMotif({ className }: RootMotifProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 800 660"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ opacity: 0.35 }}
    >
      <defs>
        <linearGradient id="rm-primary" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="hsl(var(--color-accent) / 0.4)" />
          <stop offset="40%" stopColor="hsl(var(--color-primary) / 0.35)" />
          <stop offset="100%" stopColor="hsl(var(--color-primary) / 0.15)" />
        </linearGradient>
        <linearGradient id="rm-accent" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="hsl(var(--color-accent) / 0.3)" />
          <stop offset="100%" stopColor="hsl(var(--color-primary) / 0.1)" />
        </linearGradient>
        <filter id="rm-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="rm-center-glow" cx="50%" cy="40%" r="35%">
          <stop offset="0%" stopColor="hsl(var(--color-primary) / 0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Ambient center glow */}
      <rect x="0" y="0" width="800" height="660" fill="url(#rm-center-glow)" />

      {/* Cross-linking infrastructure lines */}
      {CROSS_LINKS.map((link, i) => (
        <motion.path
          key={`cross-${i}`}
          d={link.d}
          fill="none"
          stroke="hsl(var(--color-primary) / 0.15)"
          strokeWidth="0.4"
          strokeLinecap="round"
          strokeDasharray="4 4"
          initial={reduced ? { opacity: 1 } : { pathLength: 0 }}
          animate={reduced ? { opacity: 1 } : { pathLength: 1 }}
          transition={{ delay: link.delay, duration: 1.5, ease: "easeInOut" }}
        />
      ))}

      {/* Root paths */}
      {PATHS.map((p, i) => (
        <motion.path
          key={`path-${i}`}
          d={p.d}
          fill="none"
          stroke={i < 1 ? "url(#rm-primary)" : "url(#rm-accent)"}
          strokeWidth={p.w}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? { opacity: 1 } : { pathLength: 0 }}
          animate={reduced ? { opacity: 1 } : { pathLength: 1 }}
          transition={{ delay: p.delay, duration: p.dur, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Glow behind taproot */}
      <motion.path
        d={PATHS[0]!.d}
        fill="none"
        stroke="hsl(var(--color-primary) / 0.15)"
        strokeWidth={6}
        strokeLinecap="round"
        filter="url(#rm-glow)"
        initial={reduced ? { opacity: 1 } : { pathLength: 0 }}
        animate={reduced ? { opacity: 1 } : { pathLength: 1 }}
        transition={{ delay: 0, duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Nodes */}
      {NODES.map((n, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={n.cx}
          cy={n.cy}
          r={n.r}
          fill="hsl(var(--color-primary) / 0.4)"
          initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          animate={reduced ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{ delay: n.delay + 0.3, duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}
