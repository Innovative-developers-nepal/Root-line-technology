"use client";
import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Code2,
  Shield,
  Smartphone,
  User,
  Github,
  Linkedin,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { Stagger } from "@rootline/ui/motion";
import { cn } from "@rootline/ui/lib/cn";

type IconKey = "code" | "shield" | "smartphone";

const ICON_MAP: Record<IconKey, LucideIcon> = {
  code: Code2,
  shield: Shield,
  smartphone: Smartphone,
};

const ACCENT: Record<
  IconKey,
  { spot: string; grad: string; ring: string; chipBg: string; chipFg: string }
> = {
  code: {
    spot: "rgba(139,92,246,0.18)",
    grad: "from-violet-400/90 via-violet-500/90 to-violet-600/90",
    ring: "ring-violet-400/30",
    chipBg: "bg-violet-500/[0.07] border-violet-500/25",
    chipFg: "text-violet-700 dark:text-violet-300",
  },
  smartphone: {
    spot: "rgba(14,165,233,0.18)",
    grad: "from-sky-400/90 via-sky-500/90 to-sky-600/90",
    ring: "ring-sky-400/30",
    chipBg: "bg-sky-500/[0.07] border-sky-500/25",
    chipFg: "text-sky-700 dark:text-sky-300",
  },
  shield: {
    spot: "rgba(16,185,129,0.18)",
    grad: "from-emerald-400/90 via-emerald-500/90 to-emerald-600/90",
    ring: "ring-emerald-400/30",
    chipBg: "bg-emerald-500/[0.07] border-emerald-500/25",
    chipFg: "text-emerald-700 dark:text-emerald-300",
  },
};

export type TeamMember = {
  name: string;
  role: string;
  icon?: IconKey;
  bio?: string;
  focus?: string[];
  links?: { github?: string; linkedin?: string; email?: string };
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PersonCard({ m }: { m: TeamMember }) {
  const key: IconKey = m.icon ?? "code";
  const Icon = ICON_MAP[key];
  const a = ACCENT[key];

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const bg = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, ${a.spot}, transparent 65%)`;

  const onMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    },
    [mx, my],
  );

  return (
    <div
      onMouseMove={onMove}
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-7",
        "shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.04)]",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-foreground/15 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18),0_4px_12px_-4px_rgba(0,0,0,0.06)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.3] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-15 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
      />
      <motion.div
        aria-hidden
        style={{ background: bg }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="relative">
          <div
            className={cn(
              "relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br text-white ring-1 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.22),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
              "transition-transform duration-300 group-hover:scale-[1.05] group-hover:-rotate-3",
              a.grad,
              a.ring,
            )}
          >
            <span className="font-display text-lg tracking-tight">{initials(m.name)}</span>
            <span
              className={cn(
                "absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-xl border border-background bg-card shadow-sm",
              )}
            >
              <Icon className="h-3.5 w-3.5 text-foreground/70" strokeWidth={1.75} />
            </span>
          </div>
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 -z-10 rounded-2xl bg-linear-to-br blur-2xl opacity-40 transition-opacity duration-300 group-hover:opacity-70",
              a.grad,
            )}
          />
        </div>

        <span
          className={cn(
            "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide",
            a.chipBg,
            a.chipFg,
          )}
        >
          {m.role}
        </span>
      </div>

      <div className="relative mt-6">
        <h3 className="font-display text-2xl leading-[1.1] tracking-tight text-foreground">
          {m.name}
        </h3>
        {m.bio && (
          <p className="mt-3 text-[0.9375rem] leading-[1.65] text-muted-foreground">{m.bio}</p>
        )}
      </div>

      {m.focus && m.focus.length > 0 && (
        <div className="relative mt-5 flex flex-wrap gap-1.5">
          {m.focus.map((f) => (
            <span
              key={f}
              className="inline-flex items-center rounded-md border border-border/70 bg-muted/30 px-2 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {m.links && (
        <div className="relative mt-auto flex items-center gap-2 pt-6">
          {m.links.github && (
            <a
              href={m.links.github}
              aria-label={`${m.name} on GitHub`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/60 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          )}
          {m.links.linkedin && (
            <a
              href={m.links.linkedin}
              aria-label={`${m.name} on LinkedIn`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/60 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <Linkedin className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          )}
          {m.links.email && (
            <a
              href={`mailto:${m.links.email}`}
              aria-label={`Email ${m.name}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/60 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <Stagger className="mt-12 grid gap-6 md:grid-cols-3" gap={0.1}>
      {members.map((m) => (
        <PersonCard key={m.name} m={m} />
      ))}
    </Stagger>
  );
}

export { type IconKey };
