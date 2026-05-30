import type { Metadata } from "next";
import { Container } from "@rootline/ui/components";
import { FadeUp } from "@rootline/ui/motion";
import { buildMetadata, breadcrumbJsonLd, renderJsonLd, SITE } from "@rootline/seo";
import { TeamShowcase } from "@/components/team-showcase";
import { ValuesOrbit } from "@/components/values-orbit";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Rootline Technology, an engineering studio building secure software with care.",
  path: "/about",
});

const TEAM_PLACEHOLDER = [
  {
    name: "Prajwal Bhattarai",
    role: "Founder",
    image: "/team/sg.jpeg",
    icon: "code" as const,
    bio: "Full-stack engineer. Builds the platforms, sets the bar for code review, owns delivery end-to-end.",
    focus: ["Next.js", "Postgres", "Systems design"],
    links: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Sajan Ghimire",
    role: "CTO",
    image: "/team/pb.jpeg",
    icon: "cpu" as const,
    bio: "Architects scalable infrastructure and leads engineering execution across products.",
    focus: ["AWS", "Kubernetes", "DevOps"],
    links: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Nabin Thapa",
    role: "Lead Backend Engineer",
    image: "/team/nt.jpeg",
    icon: "database" as const,
    bio: "Designs APIs, microservices, queues, and distributed backend systems.",
    focus: ["Node.js", "Redis", "Kafka"],
    links: {
      github: "https://github.com/",
    },
  },
  {
    name: "Poshan Bista",
    role: "Mobile + Web",
    image: "/team/pb.png",
    icon: "smartphone" as const,
    bio: "Ships Flutter and Next.js features daily. Owns the mobile codebase and the public release pipeline.",
    focus: ["Flutter", "Riverpod", "CI/CD"],
    links: {
      github: "https://github.com/",
    },
  },
  {
    name: "Ashim Thapa Magar",
    role: "Frontend Engineer",
    image: "/team/at.png",
    icon: "monitor" as const,
    bio: "Builds performant interfaces and scalable design systems for modern web apps.",
    focus: ["React", "Next.js", "Tailwind"],
    links: {
      github: "https://github.com/",
    },
  },
  {
    name: "Nisha Lamichane",
    role: "Frontend Engineer",
    image: "/team/nl.jpeg",
    icon: "monitor" as const,
    bio: "Builds performant interfaces and scalable design systems for modern web apps.",
    focus: ["React", "Next.js", "Tailwind"],
    links: {
      github: "https://github.com/",
    },
  }
];

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Security is not a feature. It is the soil.",
    body: "We threat-model first. Security is designed into the system from the start, never bolted on at the end.",
  },
  {
    title: "Ship slow. Ship right.",
    body: "Scope is agreed in writing, every change is reviewed by a person, and we don't chase retainer creep.",
  },
  {
    title: "Code is a promise to whoever runs it at 3am.",
    body: "We build for reproducibility and observability, and for the engineer who inherits the codebase.",
  },
  {
    title: "Premium is restraint.",
    body: "Fewer moving parts, each one done properly. We cut whatever doesn't earn its place.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <Container>
          <FadeUp whenInView={false}>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              About Rootline
            </span>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] tracking-[-0.03em] text-foreground md:text-7xl">
              Built by engineers{" "}
              <span className="text-foreground/40">who ship.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Rootline is an engineering studio building secure, durable software.
              Clean code, hardened security, real users. No theatre, no shortcuts.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Principles */}
      <section className="border-t border-border/60 py-24 md:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <FadeUp>
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                  What we believe
                </span>
                <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
                  Principles before features.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                  We are new, and deliberate about it. These are the rules we hold
                  ourselves to on every engagement.
                </p>
              </div>
            </FadeUp>

            <div className="flex flex-col gap-9">
              {PRINCIPLES.map((p, i) => (
                <FadeUp key={p.title} delay={i * 0.05}>
                  <div className="flex gap-6">
                    <span className="font-display text-base text-primary/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-xl leading-snug tracking-tight text-foreground md:text-2xl">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* How we work */}
      <section className="border-t border-border/60 bg-muted/30 py-24 md:py-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <FadeUp>
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                  How we work
                </span>
                <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
                  Credibility comes from method, not noise.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                  Every engagement runs on the same rigour: scoped in writing, led by
                  threat modelling, reviewed by a person, and proven with a working
                  proof of concept. No track record needed to take that seriously.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <ValuesOrbit className="mx-auto aspect-square w-full max-w-md" />
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="border-t border-border/60 py-24 md:py-32">
        <Container>
          <FadeUp>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Team
            </span>
            <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
              The people at Rootline.
            </h2>
          </FadeUp>
          <div className="mt-14">
            <TeamShowcase
              members={TEAM_PLACEHOLDER.map((m) => ({
                name: m.name,
                image: m.image,
                role: m.role,
                bio: m.bio,
              }))}
            />
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "About", url: `${SITE.url}/about` },
            ]),
          ),
        }}
      />
    </main>
  );
}
