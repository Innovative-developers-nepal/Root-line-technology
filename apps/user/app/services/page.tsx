import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Package,
  Smartphone,
  Globe,
} from "lucide-react";
import { Container, Button } from "@rootline/ui/components";
import {
  FadeUp,
  Stagger,
  Aurora,
  DotBackground,
  SpotlightCard,
  VeinCard,
  NoiseOverlay,
} from "@rootline/ui/motion";
import { cn } from "@rootline/ui/lib/cn";
import {
  buildMetadata,
  breadcrumbJsonLd,
  serviceJsonLd,
  renderJsonLd,
  SITE,
} from "@rootline/seo";
import type { Service } from "@rootline/api-client";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: "VAPT, Flutter mobile apps, and Next.js web platforms.",
  path: "/services",
});

const SERVICES: Service[] = [
  {
    id: "vapt",
    slug: "vapt",
    title: "VAPT",
    summary: "Vulnerability Assessment & Penetration Testing",
    body: null as unknown as Record<string, unknown>,
    iconKey: "shield-check",
    order: 0,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "mobile-flutter",
    slug: "mobile-flutter",
    title: "Mobile Development",
    summary: "Cross-platform mobile apps built with Flutter",
    body: null as unknown as Record<string, unknown>,
    iconKey: "smartphone",
    order: 1,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "web-apps",
    slug: "web-apps",
    title: "Web Development",
    summary: "Production web platforms built with Next.js",
    body: null as unknown as Record<string, unknown>,
    iconKey: "globe",
    order: 2,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description:
      "Security-first approach protecting your infrastructure at every layer of the stack.",
  },
  {
    icon: Zap,
    title: "Performance Optimized",
    description:
      "Blazing fast applications that users love and search engines reward.",
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    description:
      "Built to grow with your business without costly rewrites or re-architecture.",
  },
  {
    icon: Package,
    title: "Reliable Delivery",
    description:
      "Predictable timelines and transparent communication throughout every engagement.",
  },
];

const PHASES = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Understanding your requirements, goals, and technical landscape to define the scope.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Designing architecture, selecting tools, and planning execution with precision.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Iterative development with clean code, regular reviews, and continuous testing.",
  },
  {
    number: "04",
    title: "Validate",
    description:
      "Thorough review, security auditing, and quality verification before launch.",
  },
  {
    number: "05",
    title: "Launch",
    description:
      "Deploy to production, monitor performance, and hand over with full confidence.",
  },
];

const ECOSYSTEM_ITEMS = [
  {
    slug: "vapt",
    icon: ShieldCheck,
    title: "VAPT",
    description: "Vulnerability Assessment & Penetration Testing",
    tags: ["OWASP", "Web", "Mobile", "Network", "Cloud", "Web3", "IoT"],
  },
  {
    slug: "mobile-flutter",
    icon: Smartphone,
    title: "Mobile Development",
    description: "Cross-platform mobile apps built with Flutter",
    tags: ["Flutter", "Android", "iOS", "Cross-platform"],
  },
  {
    slug: "web-apps",
    icon: Globe,
    title: "Web Development",
    description: "Production web platforms built with Next.js",
    tags: ["Next.js", "React", "Postgres", "TypeScript"],
  },
];

export default function ServicesPage() {
  return (
    <main className="relative">
      <NoiseOverlay opacity={0.008} />

      {/* ── Hero ── */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-1/2 right-0 h-[800px] w-[800wpx] -translate-y-1/2 translate-x-1/4 rounded-full bg-primary/[0.04] blur-[120px]" />
          <div className="absolute -bottom-1/4 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/4 rounded-full bg-accent/[0.04] blur-[100px]" />
        </div>

        <Container className="relative z-10 flex flex-col items-center gap-16 py-12 md:flex-row">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <FadeUp>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10",
                  "px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary",
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden />
                Services
              </span>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
                What we{" "}
                <span className="bg-gradient-to-br from-primary via-accent to-primary/70 bg-clip-text italic text-transparent">
                  build
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground md:mx-0">
                Three practices. Each runs deep.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <Button asChild size="lg" className="rounded-2xl uppercase tracking-wider shadow-xl shadow-primary/20">
                  <Link href="/contact">
                    Start a Project
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-2xl uppercase tracking-wider">
                  <Link href="/work">
                    See Our Work
                  </Link>
                </Button>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.4}>
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="relative flex h-[500px] w-[500px] items-center justify-center rounded-full border border-border">
              <div className="absolute inset-12 animate-[spin_25s_linear_infinite] rounded-full border border-border/50" />
              <div className="absolute inset-28 animate-[spin_20s_linear_infinite_reverse] rounded-full border border-border/30" />

              <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-3xl border border-border bg-card shadow-2xl backdrop-blur-xl">
                <ShieldCheck className="h-14 w-14 text-primary" aria-hidden />
              </div>

              <div
                className="absolute flex items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-xl transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:shadow-2xl cursor-default"
                style={{ top: "15%", left: "75%" }}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  VAPT
                </span>
              </div>
              <div
                className="absolute flex items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-xl transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:shadow-2xl cursor-default"
                style={{ top: "35%", left: "5%" }}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Flutter
                </span>
              </div>
              <div
                className="absolute flex items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-xl transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:shadow-2xl cursor-default"
                style={{ top: "75%", left: "70%" }}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Next.js
                </span>
              </div>
              <div
                className="absolute flex items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-xl transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:shadow-2xl cursor-default"
                style={{ top: "80%", left: "15%" }}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Postgres
                </span>
              </div>
            </div>
          </div>
          </FadeUp>
        </Container>
      </section>

      {/* ── Why It Matters ── */}
      <div className="relative overflow-hidden border-y">
        <Aurora intensity="subtle" />
        <DotBackground fade />
        <Container className="relative py-20 md:py-24">
          <FadeUp>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Zap className="h-3.5 w-3.5 text-accent" aria-hidden />
              Benefits
            </span>
          </FadeUp>
          <FadeUp>
            <h2 className="font-display text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
              Why It Matters for Your Business
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Modern applications are strategic assets that bridge the gap
              between your brand and your customers.
            </p>
          </FadeUp>

          <Stagger gap={0.1}>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {BENEFITS.map((b) => (
                <div key={b.title}>
                  <SpotlightCard className="flex flex-col gap-3 p-6">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <b.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-xl tracking-tight text-foreground">
                      {b.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {b.description}
                    </p>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </Stagger>
        </Container>
      </div>

      {/* ── How We Deliver Excellence ── */}
      <div className="relative overflow-hidden">
        <Aurora intensity="subtle" />
        <Container className="relative py-20 md:py-24">
        <FadeUp>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Layers className="h-3.5 w-3.5 text-accent" aria-hidden />
              Process
            </span>
          </FadeUp>
        <FadeUp>
          <h2 className="font-display text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
            How We Deliver Excellence
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A methodology that transforms high-level concepts into market-ready
            digital powerhouses.
          </p>
        </FadeUp>

        <Stagger gap={0.08}>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PHASES.map((p) => (
              <div key={p.number}>
                <VeinCard className="flex flex-col gap-3 p-6">
                  <span className="font-display text-3xl font-bold text-primary">
                    {p.number}
                  </span>
                  <h3 className="font-display text-xl tracking-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </VeinCard>
              </div>
            ))}
          </div>
        </Stagger>
      </Container>
      </div>

      {/* ── Our Service Ecosystem ── */}
      <div className="relative overflow-hidden border-y">
        <DotBackground fade />
        <Container className="relative py-20 md:py-24">
          <FadeUp>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden />
              Services
            </span>
          </FadeUp>
          <FadeUp>
            <h2 className="font-display text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
              Our Service Ecosystem
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              We specialize in cutting-edge platforms to create high-functioning
              products for diverse business needs.
            </p>
          </FadeUp>

          <Stagger gap={0.1}>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {ECOSYSTEM_ITEMS.map((item) => (
                <div key={item.slug}>
                  <Link href={`/services/${item.slug}`} className="group block h-full">
                    <SpotlightCard
                      className={cn(
                        "flex h-full flex-col gap-4 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                      )}
                    >
                      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <item.icon className="h-6 w-6" />
                      </span>
                      <h3 className="font-display text-2xl tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="flex flex-1 items-end">
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </div>
              ))}
            </div>
          </Stagger>
        </Container>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
            ]),
            ...SERVICES.map((s) =>
              serviceJsonLd({ name: s.title, description: s.summary, slug: s.slug }),
            ),
          ),
        }}
      />
    </main>
  );
}
