---
name: seo-page
description: Generate Next App Router metadata + JSON-LD + sitemap entry for a route. Adds Article/Service/JobPosting/FAQPage structured data as appropriate. Trigger when scaffolding new pages or when user says "add SEO", "wire metadata".
---

# SEO Page Skill

## When to trigger

- New page added under `apps/user/app/**`
- User: "add SEO to /<route>", "wire metadata"
- Run after `/page` command

## What to add

Every public route must export:

```tsx
import type { Metadata } from "next"
import { buildMetadata } from "@rootline/seo"

export const generateMetadata = async ({ params }): Promise<Metadata> => {
  const data = await fetchData(params)  // fetch what's needed
  return buildMetadata({
    title: data.title,
    description: data.summary,
    path: `/<route>`,
    image: data.ogImage ?? `/api/og/<type>?title=${encodeURIComponent(data.title)}`,
  })
}
```

Then inject JSON-LD via a server component:

```tsx
import { jsonLd } from "@rootline/seo/jsonld"

export default async function Page({ params }) {
  const data = await fetchData(params)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.article(data)) }}
      />
      {/* page content composed from blocks */}
    </>
  )
}
```

## JSON-LD type by route

| Route | Type |
|---|---|
| `/` | `Organization` + `WebSite` (in layout) |
| `/about` | `AboutPage` + `Organization` |
| `/services` | `Service` (one per section) + `BreadcrumbList` |
| `/careers` | `ItemList` of `JobPosting` |
| `/careers/[slug]` | `JobPosting` |
| `/blog` | `Blog` + `BreadcrumbList` |
| `/blog/[slug]` | `Article` + `FAQPage` (if FAQ block present) + `BreadcrumbList` |
| `/contact` | `LocalBusiness` + `ContactPage` |

## Sitemap

If route is dynamic (`/blog/[slug]`, `/careers/[slug]`, `/services/[slug]`):
- Update `apps/user/app/sitemap.ts` to query backend for slugs + emit URLs.
- Use `lastModified: post.updatedAt`, `changeFrequency`, `priority`.

## AEO requirements

- Concise summary paragraph at top of content (machine-extractable)
- FAQ section where applicable (with `FAQPage` JSON-LD)
- Clean heading hierarchy (no skips)
- Long-form: table of contents at top

## GEO requirements

- Layout emits `LocalBusiness` JSON-LD with company address + lat/long (from env)
- Contact page emits richer `LocalBusiness` with hours, areaServed

## Verification

- Run `/seo-check <route>` after scaffold
- `curl localhost:3000/<route>` and grep for `application/ld+json`
- Validate JSON-LD at https://search.google.com/test/rich-results
