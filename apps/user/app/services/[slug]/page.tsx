import type { Metadata } from "next";
import {
  buildMetadata,
  breadcrumbJsonLd,
  serviceJsonLd,
  renderJsonLd,
  SITE,
} from "@rootline/seo";
import type { Service } from "@rootline/api-client";
import { ServiceDetail } from "@/components/service-detail";

export function generateStaticParams() {
  return [{ slug: "vapt" }, { slug: "mobile-flutter" }, { slug: "web-apps" }];
}

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

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  return buildMetadata({
    title: service?.title ?? "Service",
    description: service?.summary,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return null;

  const related = SERVICES.filter((s) => s.slug !== slug);

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
