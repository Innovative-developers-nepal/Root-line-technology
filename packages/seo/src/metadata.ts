import type { Metadata } from "next";
import { SITE } from "./site";

export type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

export function buildMetadata(input: BuildMetadataInput = {}): Metadata {
  const title = input.title ? `${input.title} — ${SITE.name}` : SITE.name;
  const description = input.description ?? SITE.description;
  const url = `${SITE.url}${input.path ?? ""}`;
  const image = input.image ?? `${SITE.url}${SITE.defaultOgImage}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    robots: input.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: SITE.locale,
      type: input.type ?? "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: SITE.twitter,
    },
  };
}
