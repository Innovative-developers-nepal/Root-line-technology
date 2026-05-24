"use client";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@rootline/ui/motion";

const draw = (delay: number, duration: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration, ease: [0.22, 1, 0.36, 1] as const },
      opacity: { delay, duration: 0.2 },
    },
  },
});

const leaf = (delay: number) => ({
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { delay, type: "spring" as const, stiffness: 200, damping: 14 },
  },
});

const PULSE_PATH =
  "M250 480 L250 380 L250 280 L200 220 M250 280 L300 220 M250 380 L185 340 M250 380 L315 340";
const TRUNK_PATHS = [
  "M250 480 L250 280",
  "M250 280 L200 220",
  "M250 280 L300 220",
  "M250 320 L185 340",
  "M250 320 L315 340",
];
const ROOT_PATHS = [
  "M250 480 L250 550",
  "M250 510 Q230 530 200 545",
  "M250 510 Q270 530 300 545",
  "M250 540 Q220 560 170 565",
  "M250 540 Q280 560 330 565",
];
const LEAVES: Array<{ cx: number; cy: number; r: number; delay: number }> = [
  { cx: 200, cy: 220, r: 32, delay: 0.9 },
  { cx: 300, cy: 220, r: 32, delay: 1.0 },
  { cx: 250, cy: 180, r: 38, delay: 1.1 },
  { cx: 165, cy: 250, r: 22, delay: 1.2 },
  { cx: 335, cy: 250, r: 22, delay: 1.25 },
  { cx: 230, cy: 145, r: 18, delay: 1.3 },
  { cx: 275, cy: 150, r: 16, delay: 1.35 },
];

export function RootTree({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className={className}>
      <svg
        viewBox="0 0 500 600"
        className="w-full h-auto"
        aria-label="Rootline tree — root impulse animation"
        role="img"
      >
        <defs>
          <linearGradient id="trunk" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
          <radialGradient id="leafGrad">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.55" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Roots */}
        {ROOT_PATHS.map((d, i) => (
          <motion.path
            key={`r${i}`}
            d={d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={3}
            strokeLinecap="round"
            initial={reduced ? "show" : "hidden"}
            animate="show"
            variants={draw(0.05 * i, 0.6)}
            opacity={0.7}
          />
        ))}

        {/* Trunk + branches */}
        {TRUNK_PATHS.map((d, i) => (
          <motion.path
            key={`t${i}`}
            d={d}
            fill="none"
            stroke="url(#trunk)"
            strokeWidth={i === 0 ? 5 : 3.5}
            strokeLinecap="round"
            initial={reduced ? "show" : "hidden"}
            animate="show"
            variants={draw(0.3 + 0.15 * i, 0.7)}
          />
        ))}

        {/* Leaves */}
        {LEAVES.map((l, i) => (
          <motion.circle
            key={`l${i}`}
            cx={l.cx}
            cy={l.cy}
            r={l.r}
            fill="url(#leafGrad)"
            initial={reduced ? "show" : "hidden"}
            animate="show"
            variants={leaf(l.delay)}
          />
        ))}

        {/* Recurring root → branch impulse */}
        {!reduced && (
          <motion.circle
            r={5}
            fill="var(--color-primary)"
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, delay: 1.6 }}
          >
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              begin="1.6s"
              path={PULSE_PATH}
              rotate="auto"
            />
          </motion.circle>
        )}
      </svg>
    </div>
  );
}
