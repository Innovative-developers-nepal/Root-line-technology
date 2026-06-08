import { Badge, Button, Container } from "@rootline/ui/components";
import { Section, SectionHeading, CTA } from "@rootline/ui/blocks";
import { breadcrumbJsonLd, renderJsonLd, SITE } from "@rootline/seo";
import { LegalTOC, type TocSection } from "./legal-toc";

export interface LegalLayoutProps {
  eyebrow?: string;
  title: string;
  description?: string;
  lastUpdated: string;
  path: string;
  sections: TocSection[];
  children: React.ReactNode;
}

export function LegalLayout({
  eyebrow = "Legal",
  title,
  description,
  lastUpdated,
  path,
  sections,
  children,
}: LegalLayoutProps) {
  return (
    <main className="min-h-dvh">
      <Section spacing="xl" tone="muted">
        <Container size="md">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={
              <span className="flex items-center gap-3">
                {description && <span>{description}</span>}
                <Badge variant="outline" className="shrink-0">
                  Last updated: {lastUpdated}
                </Badge>
              </span>
            }
            size="lg"
          />
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="md">
          <div className="grid gap-12 lg:grid-cols-[14rem_1fr]">
            <aside className="order-2 lg:order-1">
              <LegalTOC sections={sections} />
            </aside>
            <div className="order-1 flex min-w-0 flex-col gap-6 lg:order-2">
              {children}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="muted" spacing="md">
        <Container>
          <CTA
            title="Have questions about our policies?"
            description="We&rsquo;re here to help. Reach out to our team for clarification."
            actions={
              <Button asChild>
                <a href={`mailto:${SITE.contact.email}`}>Contact us</a>
              </Button>
            }
          />
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: title, url: `${SITE.url}${path}` },
            ]),
          ),
        }}
      />
    </main>
  );
}
