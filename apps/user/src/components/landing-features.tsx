"use client";
import * as React from "react";
import {
  ShieldCheck,
  Smartphone,
  Globe,
  Lock,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@rootline/ui/blocks";
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
  primary: { spot: "color-mix(in oklab, var(--color-primary) 12%, transparent)" },
  earth: { spot: "color-mix(in oklab, var(--color-accent) 12%, transparent)" },
};

const FEATURES: Feature[] = [
  {
    title: "VAPT",
    kicker: "Offensive security",
    description:
      "Human-led offensive security focused on real exploitability and business impact — not checkbox scans.",
    Icon: ShieldCheck,
    accent: "primary",
    span: "2",
    highlight: true,
    href: "/services#vapt",
    standards: ["OWASP ASVS", "PTES", "NIST 800-115"],
    stack: ["Burp Suite Pro", "MobSF", "Nuclei", "Semgrep"],
    deliverables: [
      "Threat-model first, scope locked in writing",
      "Business-logic & auth-flow testing",
      "Reproducible PoC per finding, free retest",
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
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border/60 bg-muted/20">
      <Icon className="h-4.5 w-4.5 text-foreground/60" strokeWidth={1.5} />
    </div>
  );
}

function Kicker({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary/40" />
      <MetaLabel>{label}</MetaLabel>
    </div>
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
      {/* Ambient spot — the card's single signature accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${a.spot}, transparent 70%)`,
        }}
      />

      {/* Top edge glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />

      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function LandingFeatures() {
  const featured = FEATURES[0]!;
  const rest = FEATURES.slice(1);

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

        <div className="mt-14 flex flex-col gap-5 md:mt-16 md:gap-6">
          {/* Featured service */}
          <FadeUp>
            <a
              href={featured.href ?? "#"}
              className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <SpotlightCard accent={featured.accent} className="p-7 md:p-10">
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <CardIcon Icon={featured.Icon} />
                      <Kicker label={featured.kicker} />
                    </div>
                    <h3 className="mt-7 font-display text-3xl leading-[1.05] tracking-tight text-foreground md:text-4xl">
                      {featured.title}
                    </h3>
                    <p className="mt-4 max-w-[48ch] text-[0.9375rem] leading-[1.7] text-muted-foreground md:text-base">
                      {featured.description}
                    </p>
                    <div className="mt-auto space-y-4 pt-8">
                      {featured.standards && featured.standards.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <MetaLabel>Methodology</MetaLabel>
                          <div className="flex flex-wrap gap-1.5">
                            {featured.standards.map((s) => (
                              <StandardBadge key={s} label={s} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <MetaLabel>Stack</MetaLabel>
                        <div className="flex flex-wrap gap-1.5">
                          {featured.stack.map((t) => (
                            <StackBadge key={t} label={t} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {featured.deliverables && (
                    <div className="lg:border-l lg:border-border/50 lg:pl-14">
                      <MetaLabel>What you get</MetaLabel>
                      <ul className="mt-5 grid gap-3.5">
                        {featured.deliverables.map((d) => (
                          <li
                            key={d}
                            className="flex items-start gap-3 text-[0.9375rem] text-foreground/85"
                          >
                            <span
                              className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-primary/30 text-primary"
                              aria-hidden
                            >
                              <CheckMark />
                            </span>
                            <span className="leading-snug">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </a>
          </FadeUp>

          {/* Remaining services — even row */}
          <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {rest.map((f) => (
              <FadeUp key={f.title}>
                <a
                  href={f.href ?? "#"}
                  className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <SpotlightCard accent={f.accent} className="flex h-full flex-col p-6">
                    <CardIcon Icon={f.Icon} />
                    <div className="mt-5">
                      <MetaLabel>{f.kicker}</MetaLabel>
                      <h3 className="mt-2 font-display text-xl leading-tight tracking-tight text-foreground">
                        {f.title}
                      </h3>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {f.description}
                    </p>
                    <div className="mt-auto space-y-3 pt-6">
                      {f.standards && f.standards.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <MetaLabel>Methodology</MetaLabel>
                          <div className="flex flex-wrap gap-1.5">
                            {f.standards.map((s) => (
                              <StandardBadge key={s} label={s} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col gap-1.5">
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
              </FadeUp>
            ))}
          </div>
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
