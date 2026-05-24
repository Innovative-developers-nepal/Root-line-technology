import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Badge } from "@rootline/ui/components";
import { RichTextRenderer } from "@rootline/ui/editor";
import {
  buildMetadata,
  breadcrumbJsonLd,
  serviceJsonLd,
  renderJsonLd,
  SITE,
} from "@rootline/seo";
import { fetchService, type Service } from "@rootline/api-client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getService(slug: string): Promise<Service | null> {
  try {
    return await fetchService(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  return buildMetadata({
    title: service?.title ?? "Service",
    description: service?.summary,
    path: `/services/${slug}`,
    image: service?.ogImage,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <main className="min-h-dvh">
      <div className="border-b">
        <Container size="md" className="py-4">
          <Link
            href="/services"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; All Services
          </Link>
        </Container>
      </div>

      <Container size="md" className="py-16">
        <Badge variant="secondary">
          {service.iconKey ?? "Service"}
        </Badge>

        <h1 className="mt-6 font-display text-4xl leading-tight tracking-tight md:text-5xl">
          {service.title}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          {service.summary}
        </p>
      </Container>

      <Container size="md" className="pb-24">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <RichTextRenderer content={service.body as Record<string, unknown>} />
        </article>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
              { name: service.title, url: `${SITE.url}/services/${service.slug}` },
            ]),
            serviceJsonLd({
              name: service.title,
              description: service.summary,
              slug: service.slug,
            }),
          ),
        }}
      />
    </main>
  );
}
