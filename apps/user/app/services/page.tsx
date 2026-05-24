import type { Metadata } from "next";
import { Section, SectionHeading } from "@rootline/ui/blocks";
import { Container } from "@rootline/ui/components";
import {
  buildMetadata,
  breadcrumbJsonLd,
  serviceJsonLd,
  renderJsonLd,
  SITE,
} from "@rootline/seo";
import { fetchServiceList, type Service } from "@rootline/api-client";
import { ServiceSection } from "@/components/service-section";
import { ServiceNav } from "@/components/service-nav";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: "VAPT, Flutter mobile apps, and Next.js web platforms.",
  path: "/services",
});

const FALLBACK_SERVICES: Service[] = [
  {
    id: "1", slug: "vapt", title: "VAPT",
    summary: "Vulnerability Assessment & Penetration Testing",
    body: null as unknown as Record<string, unknown>,
    iconKey: "shield", order: 0, published: true,
    createdAt: "", updatedAt: "",
  },
  {
    id: "2", slug: "mobile-flutter", title: "Mobile (Flutter)",
    summary: "Cross-platform apps from one codebase",
    body: null as unknown as Record<string, unknown>,
    iconKey: "smartphone", order: 1, published: true,
    createdAt: "", updatedAt: "",
  },
  {
    id: "3", slug: "web-apps", title: "Web platforms",
    summary: "Next.js + Postgres production apps",
    body: null as unknown as Record<string, unknown>,
    iconKey: "globe", order: 2, published: true,
    createdAt: "", updatedAt: "",
  },
];

async function getServices(): Promise<Service[]> {
  try {
    return await fetchServiceList();
  } catch {
    return FALLBACK_SERVICES;
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="min-h-dvh">
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="What we build"
            description="Three practices. Each runs deep."
            size="lg"
          />
          <ServiceNav items={services.map(({ slug, title }) => ({ slug, title }))} />
        </Container>
      </Section>

      {services.map((svc, i) => (
        <ServiceSection
          key={svc.slug}
          slug={svc.slug}
          title={svc.title}
          summary={svc.summary}
          body={svc.body as string}
          tone={i % 2 === 0 ? "muted" : "default"}
        />
      ))}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
            ]),
            ...services.map((s) =>
              serviceJsonLd({ name: s.title, description: s.summary, slug: s.slug }),
            ),
          ),
        }}
      />
    </main>
  );
}
