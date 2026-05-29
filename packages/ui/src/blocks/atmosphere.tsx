"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import {
  Shield,
  Server,
  Database,
  Cloud,
  Cpu,
  Lock,
  Activity,
  Share2,
  GitBranch,
  Globe,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@rootline/hooks";
import { cn } from "../lib/cn";

/* ------------------------------------------------------------------ */
/* GrainOverlay — film-grain texture for cinematic depth.             */
/* Inline fractalNoise SVG, no external asset. Tiles cheaply.         */
/* ------------------------------------------------------------------ */

const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.825 0.825 0.825 0 -0.75 0.825 0.825 0.825 0 -0.75 0.825 0.825 0.825 0 -0.75 0 0 0 0 1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const grainStyles = cva("pointer-events-none absolute inset-0 -z-10 bg-repeat", {
  variants: {
    intensity: {
      subtle: "opacity-[0.025]",
      soft: "opacity-[0.04]",
      strong: "opacity-[0.06]",
    },
    blend: {
      overlay: "mix-blend-overlay",
      softLight: "mix-blend-soft-light",
      normal: "",
    },
  },
  defaultVariants: { intensity: "soft", blend: "overlay" },
});

export interface GrainOverlayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof grainStyles> {}

export function GrainOverlay({ intensity, blend, className, ...props }: GrainOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn(grainStyles({ intensity, blend }), className)}
      style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "140px 140px" }}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Spotlight — soft directional light, atmospheric depth.            */
/* Uses brand tokens via color-mix so it adapts to light/dark.       */
/* ------------------------------------------------------------------ */

const spotlightStyles = cva("pointer-events-none absolute inset-0 -z-20", {
  variants: {
    position: {
      "top-left": "[--x:18%] [--y:8%]",
      top: "[--x:50%] [--y:0%]",
      center: "[--x:50%] [--y:42%]",
    },
    hue: {
      moss: "[--spot:var(--color-primary)]",
      soil: "[--spot:var(--color-accent)]",
    },
  },
  defaultVariants: { position: "top-left", hue: "moss" },
});

export interface SpotlightProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spotlightStyles> {}

export function Spotlight({ position, hue, className, ...props }: SpotlightProps) {
  return (
    <div
      aria-hidden
      className={cn(spotlightStyles({ position, hue }), className)}
      style={{
        background:
          "radial-gradient(60% 50% at var(--x) var(--y), color-mix(in oklab, var(--spot) 16%, transparent), transparent 70%)",
      }}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* SystemGraph — single hero visual: a processor "chip". A secure core    */
/* radiates circuit traces (the roots) out to labelled service pads.      */
/* Slow draw-in + breathing + data pulses. Reduced-motion safe.           */
/* ------------------------------------------------------------------ */

type Side = "left" | "right" | "top" | "bottom";
type Pt = { x: number; y: number };
type Pad = { icon: LucideIcon; label: string; side: Side; along: number };

const VW = 440;
const VH = 430;
const RING = 15; // half the pad size

// chip body edges + where each side's pads sit
const EDGE = { left: 162, right: 278, top: 152, bottom: 268 };
const PADPOS = { left: 46, right: 394, top: 52, bottom: 368 };

const PADS: Pad[] = [
  { icon: Cpu, label: "Edge", side: "left", along: 168 },
  { icon: Database, label: "Data", side: "left", along: 210 },
  { icon: GitBranch, label: "Pipelines", side: "left", along: 252 },
  { icon: Cloud, label: "Cloud", side: "right", along: 168 },
  { icon: Share2, label: "Network", side: "right", along: 210 },
  { icon: Globe, label: "Regions", side: "right", along: 252 },
  { icon: Lock, label: "Identity", side: "top", along: 176 },
  { icon: Boxes, label: "Services", side: "top", along: 264 },
  { icon: Activity, label: "Observe", side: "bottom", along: 176 },
  { icon: Shield, label: "Security", side: "bottom", along: 264 },
];

// pulses feeding the core travel along these pad indices
const PULSES = [0, 3, 6, 9, 1, 5];

function geom(side: Side, along: number): { c: Pt; anchor: Pt; end: Pt } {
  switch (side) {
    case "left":
      return { c: { x: PADPOS.left, y: along }, anchor: { x: EDGE.left, y: along }, end: { x: PADPOS.left + RING, y: along } };
    case "right":
      return { c: { x: PADPOS.right, y: along }, anchor: { x: EDGE.right, y: along }, end: { x: PADPOS.right - RING, y: along } };
    case "top":
      return { c: { x: along, y: PADPOS.top }, anchor: { x: along, y: EDGE.top }, end: { x: along, y: PADPOS.top + RING } };
    default:
      return { c: { x: along, y: PADPOS.bottom }, anchor: { x: along, y: EDGE.bottom }, end: { x: along, y: PADPOS.bottom - RING } };
  }
}

// service traces attach at these positions — skip legs there
const SERVICE_ALONG: Record<Side, number[]> = {
  left: [168, 210, 252],
  right: [168, 210, 252],
  top: [176, 264],
  bottom: [176, 264],
};

// dense gull-wing IC legs — straight out of the body, then a splayed bend
const LEGS: Array<{ d: string; foot: Pt; horizontal: boolean }> = (() => {
  const out: Array<{ d: string; foot: Pt; horizontal: boolean }> = [];
  const o1 = 6; // straight stub
  const o2 = 13; // bent tip reach
  const perSide = 9;
  const margin = 16;
  const sides: Side[] = ["left", "right", "top", "bottom"];
  for (const side of sides) {
    const horizontal = side === "left" || side === "right";
    const lo = (horizontal ? EDGE.top : EDGE.left) + margin;
    const hi = (horizontal ? EDGE.bottom : EDGE.right) - margin;
    for (let k = 0; k < perSide; k++) {
      const along = lo + (k / (perSide - 1)) * (hi - lo);
      if (SERVICE_ALONG[side].some((v) => Math.abs(v - along) < 9)) continue;
      const a = geom(side, along).anchor;
      // splay the bent tip away from the chip centre
      const splay = (along < (horizontal ? 210 : 220) ? -4 : along > (horizontal ? 210 : 220) ? 4 : 0);
      let p1: Pt;
      let foot: Pt;
      if (side === "left") {
        p1 = { x: a.x - o1, y: a.y };
        foot = { x: a.x - o2, y: a.y + splay };
      } else if (side === "right") {
        p1 = { x: a.x + o1, y: a.y };
        foot = { x: a.x + o2, y: a.y + splay };
      } else if (side === "top") {
        p1 = { x: a.x, y: a.y - o1 };
        foot = { x: a.x + splay, y: a.y - o2 };
      } else {
        p1 = { x: a.x, y: a.y + o1 };
        foot = { x: a.x + splay, y: a.y + o2 };
      }
      out.push({
        d: `M ${a.x} ${a.y} L ${p1.x} ${p1.y} L ${foot.x.toFixed(1)} ${foot.y.toFixed(1)}`,
        foot,
        horizontal,
      });
    }
  }
  return out;
})();

// service trace with an orthogonal jog, so the "branches" read as routed
function tracePath(side: Side, anchor: Pt, end: Pt): string {
  if (side === "left" || side === "right") {
    const x1 = anchor.x + (end.x - anchor.x) * 0.32;
    const x2 = anchor.x + (end.x - anchor.x) * 0.62;
    const jy = anchor.y - 11;
    return `M ${anchor.x} ${anchor.y} H ${x1.toFixed(1)} V ${jy} H ${x2.toFixed(1)} V ${anchor.y} H ${end.x}`;
  }
  const y1 = anchor.y + (end.y - anchor.y) * 0.32;
  const y2 = anchor.y + (end.y - anchor.y) * 0.62;
  const jx = anchor.x + 11;
  return `M ${anchor.x} ${anchor.y} V ${y1.toFixed(1)} H ${jx} V ${y2.toFixed(1)} H ${anchor.x} V ${end.y}`;
}

export interface SystemGraphProps {
  className?: string;
}

export function SystemGraph({ className }: SystemGraphProps) {
  const reduced = usePrefersReducedMotion();

  const draw = (delay: number, opacity: number, duration = 1.1) =>
    reduced
      ? { opacity }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity },
          transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none relative text-primary", className)}
      initial={false}
      animate={reduced ? undefined : { opacity: [0.94, 1, 0.94] }}
      transition={reduced ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* circuit traces — the routed "roots" feeding the core */}
        {PADS.map((p, i) => {
          const g = geom(p.side, p.along);
          return (
            <motion.path
              key={`tr-${p.label}`}
              d={tracePath(p.side, g.anchor, g.end)}
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...draw(0.4 + 0.06 * i, 0.42)}
            />
          );
        })}

        {/* IC legs — gull-wing bend + foot pad */}
        {LEGS.map((l, i) => (
          <g key={`leg-${i}`} opacity={0.5}>
            <path
              d={l.d}
              stroke="currentColor"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <rect
              x={l.foot.x - (l.horizontal ? 1.5 : 3)}
              y={l.foot.y - (l.horizontal ? 3 : 1.5)}
              width={l.horizontal ? 3 : 6}
              height={l.horizontal ? 6 : 3}
              rx={0.8}
              fill="currentColor"
            />
          </g>
        ))}

        {/* chip body */}
        <motion.g
          initial={reduced ? false : { scale: 0.9, opacity: 0 }}
          animate={reduced ? undefined : { scale: 1, opacity: 1 }}
          transition={reduced ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "220px 210px" }}
        >
          <rect x={EDGE.left} y={EDGE.top} width={116} height={116} rx={10} fill="var(--color-background)" />
          <rect
            x={EDGE.left}
            y={EDGE.top}
            width={116}
            height={116}
            rx={10}
            fill="currentColor"
            fillOpacity={0.07}
            stroke="currentColor"
            strokeOpacity={0.55}
            strokeWidth={1.4}
          />

          {/* pin-1 orientation notch (top edge) */}
          <circle
            cx={220}
            cy={EDGE.top}
            r={6}
            fill="var(--color-background)"
            stroke="currentColor"
            strokeOpacity={0.55}
            strokeWidth={1.2}
          />
          {/* pin-1 marker dot */}
          <circle cx={EDGE.left + 13} cy={EDGE.top + 13} r={2.6} fill="currentColor" fillOpacity={0.7} />

          {/* die */}
          <rect
            x={183}
            y={173}
            width={74}
            height={74}
            rx={6}
            fill="currentColor"
            fillOpacity={0.05}
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeWidth={1.1}
          />
          {/* bond pads at die corners */}
          {([
            [189, 179], [251, 179], [189, 241], [251, 241],
          ] as Array<[number, number]>).map(([bx, by]) => (
            <rect key={`bp-${bx}-${by}`} x={bx - 2} y={by - 2} width={4} height={4} rx={1} fill="currentColor" fillOpacity={0.4} />
          ))}

          {/* core glyph */}
          <Server x={206} y={196} width={28} height={28} stroke="currentColor" strokeWidth={1.5} opacity={0.9} />

          {/* etched part label */}
          <text x={220} y={300} textAnchor="middle" fontSize={7.5} letterSpacing={2} fill="currentColor" fillOpacity={0.6}>
            RL-CORE
          </text>
        </motion.g>

        {/* data pulses flowing into the core */}
        {!reduced &&
          PULSES.map((idx, i) => {
            const p = PADS[idx]!;
            const g = geom(p.side, p.along);
            return (
              <motion.circle
                key={`pulse-${p.label}`}
                r={2.4}
                fill="currentColor"
                initial={{ cx: g.end.x, cy: g.end.y, opacity: 0 }}
                animate={{
                  cx: [g.end.x, g.anchor.x],
                  cy: [g.end.y, g.anchor.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2.6,
                  delay: 1.4 + 0.4 * i,
                  repeat: Infinity,
                  repeatDelay: 1.8,
                  ease: "easeInOut",
                }}
              />
            );
          })}

        {/* labelled service pads */}
        {PADS.map((p, i) => {
          const { c } = geom(p.side, p.along);
          const Icon = p.icon;
          return (
            <motion.g
              key={`pad-${p.label}`}
              initial={reduced ? false : { scale: 0, opacity: 0 }}
              animate={reduced ? undefined : { scale: 1, opacity: 1 }}
              transition={reduced ? undefined : { duration: 0.4, delay: 0.9 + 0.07 * i }}
              style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            >
              <rect x={c.x - RING} y={c.y - RING} width={RING * 2} height={RING * 2} rx={5} fill="var(--color-background)" />
              <rect
                x={c.x - RING}
                y={c.y - RING}
                width={RING * 2}
                height={RING * 2}
                rx={5}
                fill="currentColor"
                fillOpacity={0.1}
                stroke="currentColor"
                strokeOpacity={0.6}
                strokeWidth={1.2}
              />
              <Icon x={c.x - 9} y={c.y - 9} width={18} height={18} stroke="currentColor" strokeWidth={1.7} />
              <text
                x={c.x}
                y={c.y + RING + 12}
                textAnchor="middle"
                fontSize={8.5}
                fontWeight={500}
                letterSpacing={0.4}
                fill="var(--color-foreground)"
                fillOpacity={0.9}
              >
                {p.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}
