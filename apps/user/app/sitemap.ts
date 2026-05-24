import type { MetadataRoute } from "next";
import { listAllBlogSlugs, listAllJobSlugs } from "@rootline/api-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/about", "/services", "/careers", "/contact", "/blog"];

  const [blogs, jobs] = await Promise.all([
    listAllBlogSlugs().catch(() => []),
    listAllJobSlugs().catch(() => []),
  ]);

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1.0 : 0.7,
    })),
    ...blogs.map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: new Date(b.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...jobs.map((j) => ({
      url: `${SITE_URL}/careers/${j.slug}`,
      lastModified: new Date(j.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
