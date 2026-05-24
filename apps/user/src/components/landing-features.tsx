"use client";
import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  Globe,
  Lock,
  Zap,
  ArrowUpRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading, BentoGrid } from "@rootline/ui/blocks";
import { Container } from "@rootline/ui/components";
import { FadeUp, usePrefersReducedMotion } from "@rootline/ui/motion";
import { cn } from "@rootline/ui/lib/cn";

type Accent = "emerald" | "sky" | "violet" | "amber" | "rose";

type Feature = {
  title: string;
  kicker: string;
  description: string;
  Icon: LucideIcon;
  accent: Accent;
  href?: string;
  stack: string[];
  standards?: string[];
  span?: "1" | "2";
  highlight?: boolean;
  deliverables?: string[];
};

const ACCENT: Record<
  Accent,
  {
    spot: string;
    iconGrad: string;
    iconFg: string;
    iconRing: string;
    chipBg: string;
    chipFg: string;
    chipBorder: string;
    edge: string;
  }
> = {
  emerald: {
    spot: "rgba(16,185,129,0.18)",
    iconGrad: "from-emerald-400/90 via-emerald-500/90 to-emerald-600/90",
    iconFg: "text-white",
    iconRing: "ring-emerald-400/30",
    chipBg: "bg-emerald-500/[0.07]",
    chipBorder: "border-emerald-500/25",
    chipFg: "text-emerald-700 dark:text-emerald-300",
    edge: "from-emerald-500/40",
  },
  sky: {
    spot: "rgba(14,165,233,0.18)",
    iconGrad: "from-sky-400/90 via-sky-500/90 to-sky-600/90",
    iconFg: "text-white",
    iconRing: "ring-sky-400/30",
    chipBg: "bg-sky-500/[0.07]",
    chipBorder: "border-sky-500/25",
    chipFg: "text-sky-700 dark:text-sky-300",
    edge: "from-sky-500/40",
  },
  violet: {
    spot: "rgba(139,92,246,0.18)",
    iconGrad: "from-violet-400/90 via-violet-500/90 to-violet-600/90",
    iconFg: "text-white",
    iconRing: "ring-violet-400/30",
    chipBg: "bg-violet-500/[0.07]",
    chipBorder: "border-violet-500/25",
    chipFg: "text-violet-700 dark:text-violet-300",
    edge: "from-violet-500/40",
  },
  amber: {
    spot: "rgba(245,158,11,0.18)",
    iconGrad: "from-amber-400/90 via-amber-500/90 to-amber-600/90",
    iconFg: "text-white",
    iconRing: "ring-amber-400/30",
    chipBg: "bg-amber-500/[0.07]",
    chipBorder: "border-amber-500/25",
    chipFg: "text-amber-800 dark:text-amber-300",
    edge: "from-amber-500/40",
  },
  rose: {
    spot: "rgba(244,63,94,0.18)",
    iconGrad: "from-rose-400/90 via-rose-500/90 to-rose-600/90",
    iconFg: "text-white",
    iconRing: "ring-rose-400/30",
    chipBg: "bg-rose-500/[0.07]",
    chipBorder: "border-rose-500/25",
    chipFg: "text-rose-700 dark:text-rose-300",
    edge: "from-rose-500/40",
  },
};

const FEATURES: Feature[] = [
  {
    title: "VAPT",
    kicker: "Offensive security",
    description:
      "Manual-led penetration tests across web, API, mobile, and cloud. Findings ranked by exploitability, not CVSS theatre.",
    Icon: ShieldCheck,
    accent: "emerald",
    span: "2",
    highlight: true,
    href: "/services#vapt",
    standards: ["OWASP ASVS L2", "OWASP MASVS", "PTES", "NIST SP 800-115"],
    stack: ["Burp Suite Pro", "MobSF", "Nuclei", "Semgrep"],
    deliverables: [
      "Threat-model first, scope locked in writing",
      "Business-logic and auth flow testing",
      "Reproducible PoC for every finding",
      "Free retest after remediation",
    ],
  },
  {
    title: "Mobile",
    kicker: "Flutter engineering",
    description:
      "Single Dart codebase shipping to App Store and Play. Native channels where they matter, offline-first by default.",
    Icon: Smartphone,
    accent: "sky",
    href: "/services#mobile",
    standards: ["Material 3", "HIG"],
    stack: ["Flutter 3", "Riverpod", "Drift", "Firebase"],
  },
  {
    title: "Web platforms",
    kicker: "Production web apps",
    description:
      "Next.js + Postgres systems with real auth, payments, RBAC, and an admin you can hand to ops.",
    Icon: Globe,
    accent: "violet",
    href: "/services#web",
    standards: ["WCAG 2.2 AA"],
    stack: ["Next 15", "Postgres", "Prisma", "Stripe"],
  },
  {
    title: "Hardening",
    kicker: "Defensive review",
    description:
      "Secrets rotation, RBAC audit, dependency and SBOM review against a written threat model.",
    Icon: Lock,
    accent: "amber",
    href: "/services#hardening",
    standards: ["CIS Benchmarks", "SLSA L2"],
    stack: ["Vault", "Trivy", "Syft"],
  },
  {
    title: "Performance",
    kicker: "Speed + observability",
    description:
      "Core Web Vitals tuned in CI, edge caching, real-user telemetry wired to your incident channel.",
    Icon: Zap,
    accent: "rose",
    href: "/services#performance",
    standards: ["CWV", "RAIL"],
    stack: ["OpenTelemetry", "Vercel Edge", "Grafana"],
  },
];

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
      {children}
    </span>
  );
}

function SpotlightCard({
  spotColor,
  className,
  children,
}: {
  spotColor: string;
  className?: string;
  children: React.ReactNode;
}) {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const bg = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, ${spotColor}, transparent 65%)`;

  const onMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    },
    [mx, my],
  );

  return (
    <div
      onMouseMove={onMove}
      className={cn(
        "group/spot relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card",
        "shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.04)]",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-foreground/15 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18),0_4px_12px_-4px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-20 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
      />
      <motion.div
        aria-hidden
        style={{ background: bg }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function StickerIcon({
  Icon,
  gradient,
  ring,
  fg,
}: {
  Icon: LucideIcon;
  gradient: string;
  ring: string;
  fg: string;
}) {
  return (
    <div className="relative">
      <div
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br",
          gradient,
          fg,
          "ring-1",
          ring,
          "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.18),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
          "transition-transform duration-300 group-hover/spot:scale-[1.06] group-hover/spot:-rotate-3",
        )}
      >
        <Icon className="h-5.5 w-5.5" strokeWidth={1.75} />
      </div>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 rounded-xl bg-linear-to-br blur-xl opacity-40 transition-opacity duration-300 group-hover/spot:opacity-70",
          gradient,
        )}
      />
    </div>
  );
}

export function LandingFeatures() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="what-we-do" className="w-full scroll-mt-20 py-24 md:py-32">
      <Container>
        <FadeUp>
          <SectionHeading
            eyebrow="What we do"
            title="Built to outlast trends"
            description="Security, mobile, and web — depth over breadth. Every engagement scoped in writing, reviewed by a human, shipped under NDA."
          />
        </FadeUp>

        <motion.div
          className="mt-14"
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "show"}
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          <BentoGrid cols="3" gap="md">
            {FEATURES.map((f) => {
              const a = ACCENT[f.accent];
              const isWide = f.span === "2";

              return (
                <motion.div
                  key={f.title}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className={isWide ? "md:col-span-2 md:row-span-2" : ""}
                >
                  <a
                    href={f.href ?? "#"}
                    className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <SpotlightCard spotColor={a.spot} className="p-7 md:p-8 flex flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <StickerIcon
                          Icon={f.Icon}
                          gradient={a.iconGrad}
                          ring={a.iconRing}
                          fg={a.iconFg}
                        />
                        <div className="flex items-start gap-3 pt-1.5">
                          <MetaLabel>{f.kicker}</MetaLabel>
                          <ArrowUpRight
                            className="h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </div>
                      </div>

                      <div className="mt-7 flex flex-col gap-3">
                        <h3 className="font-display text-2xl leading-[1.1] tracking-tight text-foreground md:text-[1.75rem]">
                          {f.title}
                        </h3>
                        <p className="text-[0.9375rem] leading-[1.65] text-muted-foreground max-w-[60ch]">
                          {f.description}
                        </p>
                      </div>

                      {f.deliverables && (
                        <ul className="mt-7 grid gap-2.5 md:grid-cols-2">
                          {f.deliverables.map((d) => (
                            <li
                              key={d}
                              className="flex items-start gap-2.5 text-[0.9375rem] text-foreground/85"
                            >
                              <span
                                className={cn(
                                  "mt-0.75 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-linear-to-br ring-1 text-white",
                                  a.iconGrad,
                                  a.iconRing,
                                )}
                                aria-hidden
                              >
                                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                              </span>
                              <span className="leading-snug">{d}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto space-y-4 pt-8">
                        {f.standards && f.standards.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <MetaLabel>Methodology</MetaLabel>
                            <div className="flex flex-wrap gap-1.5">
                              {f.standards.map((s) => (
                                <span
                                  key={s}
                                  className={cn(
                                    "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide",
                                    a.chipBg,
                                    a.chipBorder,
                                    a.chipFg,
                                  )}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <MetaLabel>Stack</MetaLabel>
                          <div className="flex flex-wrap gap-1.5">
                            {f.stack.map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center rounded-md border border-border/70 bg-muted/30 px-2 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </a>
                </motion.div>
              );
            })}
          </BentoGrid>
        </motion.div>
      </Container>
    </section>
  );
}
