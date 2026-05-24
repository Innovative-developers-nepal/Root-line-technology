# SEO / AEO / GEO Checklist — Rootline

Every public route in `apps/user` must pass this checklist before launch.

## Per-page SEO

- [ ] `generateMetadata` exports `Metadata` via `@rootline/seo/buildMetadata`
- [ ] Title is ≤60 chars, unique per page
- [ ] Description is 120–160 chars, unique per page
- [ ] `alternates.canonical` set to absolute URL
- [ ] `openGraph` with type, url, title, description, image, locale
- [ ] `twitter` card (summary_large_image) with title, description, image
- [ ] OG image is 1200×630 — static or `/api/og/<type>?...` dynamic
- [ ] Route included in `app/sitemap.ts`
- [ ] Route allowed in `app/robots.ts`
- [ ] No `noindex`/`nofollow` unless intentional
- [ ] hreflang set if i18n active (not v1)

## Structured data (Schema.org JSON-LD)

Required per route type:

| Route | Required schemas |
|---|---|
| `/` (root layout) | `Organization`, `WebSite` |
| `/about` | `AboutPage` |
| `/services` | `Service` (per section), `BreadcrumbList` |
| `/careers` | `ItemList` (of JobPosting summaries) |
| `/careers/[slug]` | `JobPosting`, `BreadcrumbList` |
| `/blog` | `Blog`, `BreadcrumbList` |
| `/blog/[slug]` | `Article`, `BreadcrumbList`, `FAQPage` (if FAQ block) |
| `/contact` | `LocalBusiness`, `ContactPage`, `BreadcrumbList` |

- [ ] JSON-LD injected as `<script type="application/ld+json">` in server component
- [ ] Validates at https://search.google.com/test/rich-results
- [ ] No duplicate `@id` collisions across schemas

## AEO (answer-engine optimization)

For content surfaces (blog posts, services, FAQ pages):

- [ ] Concise summary paragraph at the top — 1–3 sentences, machine-extractable
- [ ] Q→A format used in FAQ blocks with `FAQPage` JSON-LD
- [ ] Heading hierarchy: H1 → H2 → H3 with no skips
- [ ] Long-form (>1500 words) has table of contents
- [ ] Lists prefer `<ul>`/`<ol>` over divs
- [ ] First 100 words contain the primary topic phrase
- [ ] `<dl>` for definition-style content
- [ ] Numbered steps for how-tos

## GEO (geographic/local)

- [ ] Footer + Contact page emit `LocalBusiness` JSON-LD with:
  - `name`, `legalName: "Rootline Technology Private Limited"`
  - `address` (full postal address)
  - `geo` with `latitude`/`longitude` from env
  - `areaServed`
  - `telephone`, `email`
  - `openingHoursSpecification` if applicable
- [ ] hreflang per locale (when i18n ships)
- [ ] Address as plain text in Contact page (crawlable)
- [ ] Google Search Console verified
- [ ] Bing Webmaster verified

## Performance (Core Web Vitals)

- [ ] LCP ≤ 2.5s on landing
- [ ] CLS ≤ 0.1 (no layout shifts from images, fonts, ads)
- [ ] INP ≤ 200ms
- [ ] All images via `next/image` with `priority` on above-fold
- [ ] All fonts via `next/font` (no external `<link>` to fonts)
- [ ] No render-blocking scripts
- [ ] No client-side render for above-fold marketing content

## Accessibility (paired with SEO for ranking signals)

- [ ] Lang attribute set on `<html>`
- [ ] All images have `alt` (empty for decorative)
- [ ] All interactive elements keyboard-reachable
- [ ] Color contrast ≥ 4.5:1 for body, 3:1 for large text
- [ ] Focus visible on all interactives
- [ ] Form inputs have labels
- [ ] Skip-to-content link
- [ ] Landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`

## Tools to run

- Lighthouse (Chrome DevTools or `npx lighthouse`)
- https://search.google.com/test/rich-results
- https://schema.org/docs/validator.html
- https://www.opengraph.xyz (preview OG)
- https://www.linkedin.com/post-inspector (LinkedIn cache)
- Bing URL Inspection (in Webmaster)
