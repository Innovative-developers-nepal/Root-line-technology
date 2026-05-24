import type { Metadata } from "next";
import { Section, SectionHeading } from "@rootline/ui/blocks";
import { Container, Card } from "@rootline/ui/components";
import { buildMetadata, breadcrumbJsonLd, renderJsonLd, SITE } from "@rootline/seo";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Rootline Technology.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="min-h-dvh">
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Contact"
            title="Tell us about your project"
            description="We reply within one business day."
          />
          <Card className="mt-12 p-8">
            <ContactForm />
          </Card>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Contact", url: `${SITE.url}/contact` },
            ]),
          ),
        }}
      />
    </main>
  );
}
