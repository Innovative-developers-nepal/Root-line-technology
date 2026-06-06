import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildMetadata,
  breadcrumbJsonLd,
  serviceJsonLd,
  renderJsonLd,
  SITE,
} from "@rootline/seo";
import { fetchService, fetchServiceList, type Service } from "@rootline/api-client";
import { ServiceDetail } from "@/components/service-detail";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getService(slug: string): Promise<Service | null> {
  try {
    return await fetchService(slug);
  } catch {
    return null;
  }
}

async function getRelatedServices(
  currentSlug: string,
  currentTitle: string,
): Promise<Service[]> {
  try {
    const all = await fetchServiceList();
    return all.filter(
      (s) => s.slug !== currentSlug && s.title !== currentTitle,
    );
  } catch {
    return [];
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

  const related = await getRelatedServices(service.slug, service.title);

  return (
    <>
      <ServiceDetail service={service} related={related} />

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
    </>
  );
}
