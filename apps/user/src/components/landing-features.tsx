"use client";
import * as React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  Globe,
  Lock,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading, BentoGrid } from "@rootline/ui/blocks";
import { Container } from "@rootline/ui/components";
import { FadeUp } from "@rootline/ui/motion";
import { cn } from "@rootline/ui/lib/cn";

type Accent = "primary" | "earth";

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

const ACCENT: Record<Accent, { spot: string }> = {
  primary: { spot: "hsl(var(--color-primary) / 0.08)" },
  earth: { spot: "hsl(var(--color-accent) / 0.08)" },
};

const FEATURES: Feature[] = [
  {
    title: "VAPT",
    kicker: "Offensive security",
    description:
      "Human-led offensive security engagements focused on exploitability, business impact, and operational resilience.",
    Icon: ShieldCheck,
    accent: "primary",
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
    kicker: "Cross-platform delivery",
    description:
      "Cross-platform applications that ship fast, work offline, and feel native on every screen.",
    Icon: Smartphone,
    accent: "earth",
    href: "/services#mobile",
    standards: ["Material 3", "HIG"],
    stack: ["Flutter 3", "Riverpod", "Drift", "Firebase"],
  },
  {
    title: "Web platforms",
    kicker: "Production platforms",
    description:
      "Operational web platforms engineered for scale, security, and long-term maintainability.",
    Icon: Globe,
    accent: "primary",
    href: "/services#web",
    standards: ["WCAG 2.2 AA"],
    stack: ["Next 15", "Postgres", "Prisma", "Stripe"],
  },
  {
    title: "Hardening",
    kicker: "System resilience",
    description:
      "Threat-model driven defense \u2014 secrets hygiene, access governance, and supply chain verification.",
    Icon: Lock,
    accent: "earth",
    href: "/services#hardening",
    standards: ["CIS Benchmarks", "SLSA L2"],
    stack: ["Vault", "Trivy", "Syft"],
  },
  {
    title: "Performance",
    kicker: "Operational performance",
    description:
      "Speed engineered as a system property \u2014 measured in CI, cached at the edge, monitored in real-time.",
    Icon: Zap,
    accent: "primary",
    href: "/services#performance",
    standards: ["CWV", "RAIL"],
    stack: ["OpenTelemetry", "Vercel Edge", "Grafana"],
  },
];

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/60">
      {children}
    </span>
  );
}

function StandardBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/10 px-2 py-0.5">
      <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0" aria-hidden>
        <circle cx="6" cy="6" r="5" fill="none" strokeWidth="1" className="stroke-foreground/15" />
        <circle cx="6" cy="6" r="1" className="fill-foreground/20" />
      </svg>
      <span className="text-[10px] font-medium tracking-wide text-muted-foreground">{label}</span>
    </span>
  );
}

function StackBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border/40 bg-muted/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">
      {label}
    </span>
  );
}

function CardIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="relative h-11 w-11 shrink-0">
      <div className="absolute inset-0 rounded-full border border-border/60" />
      <svg
        viewBox="0 0 44 44"
        className="absolute inset-0 h-full w-full opacity-25"
        aria-hidden
      >
        <path
          d="M12,34 C16,28 18,24 22,20"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="none"
          className="text-primary/30"
        />
        <path
          d="M22,20 C26,16 30,14 34,12"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-primary/20"
        />
        <path
          d="M22,20 C20,17 17,15 12,14"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-primary/20"
        />
        <circle cx="34" cy="12" r="1.2" className="fill-primary/30" />
        <circle cx="12" cy="14" r="1.2" className="fill-primary/30" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="h-4.5 w-4.5 text-foreground/55" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function NodeCue({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/20 opacity-40" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full border border-primary/30 bg-primary/10" />
      </span>
      <MetaLabel>{label}</MetaLabel>
    </div>
  );
}

function RootAccent({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 32"
      className={cn("pointer-events-none absolute bottom-0 right-0 h-16 w-48 opacity-15 dark:opacity-20", className)}
    >
      <path
        d="M200,32 C170,28 150,30 130,24 C110,18 90,22 70,16 C50,10 35,14 20,8 C10,4 5,6 0,2"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        className="text-primary/30"
      />
      <path
        d="M180,28 C160,26 145,28 130,22 C115,16 100,20 85,14"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        className="text-primary/20"
      />
    </svg>
  );
}

function ContourLines() {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 400 300"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025] dark:opacity-[0.035]"
      animate={{ x: [0, 6, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M0,80 C100,60 200,100 300,70 C350,55 400,75 400,75" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-foreground/30" />
      <path d="M0,110 C80,90 180,130 280,100 C340,85 400,105 400,105" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-foreground/30" />
      <path d="M0,150 C120,130 220,170 320,140 C370,125 400,145 400,145" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-foreground/25" />
      <path d="M0,190 C100,170 200,210 300,180 C360,165 400,185 400,185" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-foreground/25" />
      <path d="M0,230 C80,210 180,250 280,220 C340,205 400,225 400,225" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-foreground/20" />
    </motion.svg>
  );
}

function SpotlightCard({
  className,
  accent,
  children,
}: {
  className?: string;
  accent: Accent;
  children: React.ReactNode;
}) {
  const a = ACCENT[accent];

  return (
    <div
      className={cn(
        "relative h-full rounded-2xl border border-border/50 bg-card",
        "shadow-[0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_8px_-4px_rgba(0,0,0,0.08)]",
        "dark:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.3),0_4px_16px_-6px_rgba(0,0,0,0.4)]",
        "overflow-hidden",
        className,
      )}
    >
      {/* Gradient depth base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
        }}
      />

      {/* Ambient spot */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4"
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${a.spot}, transparent 70%)`,
        }}
      />

      {/* Top edge glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />

      {/* Contour lines */}
      <ContourLines />

      <RootAccent />

      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function LandingFeatures() {
  return (
    <section id="what-we-do" className="relative w-full scroll-mt-20 py-24 md:py-32 overflow-hidden">
      <Container>
        <FadeUp>
          <SectionHeading
            eyebrow="What we do"
            title="Systems designed to endure."
            description="Security, mobile, and web platforms engineered for resilience. Every engagement scoped in writing, reviewed by a human, shipped under NDA."
          />
        </FadeUp>

        <div className="relative mt-14">
          <BentoGrid cols="3" gap="md">
            {FEATURES.map((f) => {
              const isWide = f.span === "2";

              return (
                <div
                  key={f.title}
                  className={cn("relative", isWide ? "md:col-span-2 md:row-span-2" : "")}
                >
                  <a
                    href={f.href ?? "#"}
                    className="group relative block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <SpotlightCard className="p-7 md:p-8 flex flex-col" accent={f.accent}>
                      <div className="flex items-start justify-between gap-4">
                        <CardIcon Icon={f.Icon} />
                        <NodeCue label={f.kicker} />
                      </div>

                      <div className="mt-7 flex flex-col gap-3">
                        <h3 className="font-display text-2xl leading-[1.1] tracking-tight text-foreground md:text-[1.75rem]">
                          {f.title}
                        </h3>
                        <p className="mt-1 text-[0.9375rem] leading-[1.65] text-muted-foreground max-w-[60ch]">
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
                                className="mt-0.75 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border/50 text-foreground/35"
                                aria-hidden
                              >
                                <CheckMark />
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
                                <StandardBadge key={s} label={s} />
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <MetaLabel>Stack</MetaLabel>
                          <div className="flex flex-wrap gap-1.5">
                            {f.stack.map((t) => (
                              <StackBadge key={t} label={t} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </a>
                </div>
              );
            })}
          </BentoGrid>
        </div>
      </Container>
    </section>
  );
}

function CheckMark() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-foreground/35">
      <path
        d="M2 5L4 7L8 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
