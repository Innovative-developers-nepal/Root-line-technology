"use client";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileSignature,
  Eye,
  RefreshCw,
  GitBranch,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@rootline/hooks";
import { cn } from "@rootline/ui/lib/cn";

const ITEMS: { icon: LucideIcon; title: string }[] = [
  { icon: FileSignature, title: "NDA first" },
  { icon: ShieldCheck, title: "Threat-model led" },
  { icon: Eye, title: "Human review" },
  { icon: GitBranch, title: "Reproducible" },
  { icon: RefreshCw, title: "Free retest" },
  { icon: Layers, title: "Built to last" },
];

const C = 200;
const R = 134;
const IR = 25;

export function ValuesOrbit({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();

  const nodes = ITEMS.map((it, i) => {
    const a = ((-90 + i * (360 / ITEMS.length)) * Math.PI) / 180;
    return { ...it, x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
  });

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none relative text-primary", className)}
      initial={false}
      animate={reduced ? undefined : { opacity: [0.92, 1, 0.92] }}
      transition={reduced ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
        {/* dashed connectors */}
        {nodes.map((n, i) => (
          <motion.line
            key={`l-${n.title}`}
            x1={C}
            y1={C}
            x2={n.x}
            y2={n.y}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="2 6"
            opacity={0.3}
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={reduced ? undefined : { pathLength: 1, opacity: 0.3 }}
            transition={reduced ? undefined : { duration: 0.9, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* center hub */}
        <circle cx={C} cy={C} r={32} fill="var(--color-background)" />
        <circle cx={C} cy={C} r={32} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.2} />
        <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
          <path d={`M${C} ${C - 11} ${C - 8} ${C + 11}M${C} ${C - 11} ${C + 8} ${C + 7}`} />
        </g>
        <circle cx={C} cy={C - 11} r={2.6} fill="currentColor" />
        <circle cx={C - 8} cy={C + 11} r={2.2} fill="currentColor" />
        <circle cx={C + 8} cy={C + 7} r={2.2} fill="currentColor" />

        {/* nodes */}
        {nodes.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.g
              key={`n-${n.title}`}
              initial={reduced ? false : { scale: 0, opacity: 0 }}
              animate={reduced ? undefined : { scale: 1, opacity: 1 }}
              transition={reduced ? undefined : { duration: 0.4, delay: 0.5 + 0.08 * i }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            >
              <circle cx={n.x} cy={n.y} r={IR} fill="var(--color-background)" />
              <circle cx={n.x} cy={n.y} r={IR} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.2} />
              <Icon x={n.x - 11} y={n.y - 11} width={22} height={22} stroke="currentColor" strokeWidth={1.6} />
              <text
                x={n.x}
                y={n.y + IR + 13}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight={500}
                fill="var(--color-foreground)"
                fillOpacity={0.9}
              >
                {n.title}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}
