import type { Metadata } from "next";
import { Section, SectionHeading } from "@rootline/ui/blocks";
import { Container } from "@rootline/ui/components";
import { FadeUp } from "@rootline/ui/motion";
import { buildMetadata, breadcrumbJsonLd, renderJsonLd, SITE } from "@rootline/seo";
import { TeamGrid } from "@/components/team-grid";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Rootline Technology — engineering studio building secure software with care.",
  path: "/about",
});

const TEAM_PLACEHOLDER = [
  {
    name: "Ashim Magar",
    role: "Founder",
    icon: "code" as const,
    bio: "Full-stack engineer. Builds the platforms, sets the bar for code review, owns delivery end-to-end.",
    focus: ["Next.js", "Postgres", "Systems design"],
    links: { github: "https://github.com/", linkedin: "https://www.linkedin.com/" },
  },
  {
    name: "Lead Developer",
    role: "Mobile + Web",
    icon: "smartphone" as const,
    bio: "Ships Flutter and Next.js features daily. Owns the mobile codebase and the public release pipeline.",
    focus: ["Flutter", "Riverpod", "CI/CD"],
    links: { github: "https://github.com/" },
  },
  {
    name: "Security Lead",
    role: "VAPT",
    icon: "shield" as const,
    bio: "Drives offensive engagements end-to-end. Threat models, manual testing, remediation walkthroughs.",
    focus: ["Burp", "MobSF", "OWASP MASVS"],
    links: { linkedin: "https://www.linkedin.com/" },
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh">
      <Section>
        <Container>
          <FadeUp whenInView={false}>
            <SectionHeading
              eyebrow="About Rootline"
              title="Built by engineers who ship"
              description="We build things that endure — clean code, hardened security, real users."
              size="lg"
            />
          </FadeUp>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <FadeUp>
            <SectionHeading eyebrow="Team" title="People at Rootline" />
          </FadeUp>
          <TeamGrid members={TEAM_PLACEHOLDER} />
        </Container>
      </Section>

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
