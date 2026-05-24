import { SITE } from "./site";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}${SITE.logo}`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE.contact.email,
      contactType: "customer support",
    },
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function articleJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image ?? `${SITE.url}${SITE.defaultOgImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: post.author ?? SITE.legalName },
    publisher: {
      "@type": "Organization",
      name: SITE.legalName,
      logo: { "@type": "ImageObject", url: `${SITE.url}/logo.svg` },
    },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };
}

export function serviceJsonLd(svc: { name: string; description: string; slug: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.name,
    description: svc.description,
    provider: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
    url: `${SITE.url}/services#${svc.slug}`,
    areaServed: "Worldwide",
  };
}

export function jobPostingJsonLd(job: {
  title: string;
  description: string;
  slug: string;
  location: string;
  type: string;
  postedAt: string;
  validThrough?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    validThrough: job.validThrough,
    employmentType: job.type,
    hiringOrganization: {
      "@type": "Organization",
      name: SITE.legalName,
      sameAs: SITE.url,
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    },
    url: `${SITE.url}/careers/${job.slug}`,
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export function localBusinessJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.legalName,
    image: `${SITE.url}/logo.svg`,
    "@id": SITE.url,
    url: SITE.url,
    telephone: SITE.contact.phone,
    address: { "@type": "PostalAddress", streetAddress: SITE.contact.address },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.contact.geo.lat,
      longitude: SITE.contact.geo.lng,
    },
  };
}

export function renderJsonLd(...nodes: JsonLd[]): string {
  return JSON.stringify(nodes.length === 1 ? nodes[0] : nodes);
}
