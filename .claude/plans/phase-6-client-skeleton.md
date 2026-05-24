# Phase 6 — Client App Skeleton

## Context

Phase 5 packages (`@rootline/seo`, `api-client`, `auth-client`, `storage`, `utils`, `hooks`, `analytics`, `validators`) deferred to another model. Phase 6 = build `apps/user` (port 3000) marketing site with 6 routes, full SEO/AEO/GEO, theme, nav, footer, placeholder content.

**Dependency rule:** Phase 6 imports `@rootline/*` packages **as if they exist**. If Phase 5 not landed yet, implementer creates one-line local stubs in `apps/user/src/_stubs/` that mirror Phase 5 contracts (see `phase-5-shared-packages.md` for signatures). Stubs deleted once Phase 5 merges. No business logic inside stubs — they return placeholder data or no-op.

Goal: user app boots, all 6 routes render, sitemap + robots + OG endpoints live, theme toggle works, Lighthouse SEO ≥ 90 on placeholder content.

## Scope

**In scope:**
- App shell: root layout, nav, footer, theme provider, PostHog provider, fonts.
- 6 marketing routes with metadata + JSON-LD + placeholder content composed from `@rootline/ui/blocks/*`.
- `app/sitemap.ts` (fetch slugs from API), `app/robots.ts`, `app/manifest.ts`.
- `app/api/og/[type]/route.tsx` (dynamic OG via `@vercel/og`).
- `app/api/revalidate/route.ts` (HMAC-verified webhook target).
- `app/api/contact/route.ts`, `app/api/careers/apply/route.ts` (thin proxies to backend with file relay for resume).
- Brand globals wired (`@rootline/config-tailwind/tokens.css` imported).

**Out of scope:**
- Real CMS-driven content (Phase 8).
- GSAP/Framer motion polish (Phase 9).
- PostHog dashboard (Phase 10).
- Admin app (Phase 7).

## File Tree

```
apps/user/
├── app/
│   ├── layout.tsx                  # fonts, theme, providers, nav, footer
│   ├── page.tsx                    # Landing (composed blocks)
│   ├── globals.css                 # imports @rootline/config-tailwind/tokens.css
│   ├── about/
│   │   └── page.tsx                # About + Team grid
│   ├── services/
│   │   └── page.tsx                # Single page, anchor-sectioned: #vapt, #mobile-flutter, #web-apps
│   ├── careers/
│   │   ├── page.tsx                # Job list
│   │   └── [slug]/page.tsx         # Job detail + apply form
│   ├── contact/
│   │   └── page.tsx                # Contact form
│   ├── blog/
│   │   ├── page.tsx                # Cursor-paginated list
│   │   └── [slug]/page.tsx         # Article with TOC + RichTextRenderer
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── manifest.ts
│   ├── not-found.tsx
│   ├── error.tsx
│   └── api/
│       ├── og/[type]/route.tsx     # dynamic OG
│       ├── revalidate/route.ts     # backend webhook (HMAC)
│       ├── contact/route.ts        # form proxy → backend
│       └── careers/apply/route.ts  # multipart proxy with resume file
├── src/
│   ├── components/
│   │   ├── site-nav.tsx            # composes ui/blocks/Nav + theme toggle
│   │   ├── site-footer.tsx         # composes ui/blocks/Footer + LocalBusiness JSON-LD
│   │   ├── theme-toggle.tsx        # next-themes sun/moon
│   │   └── providers.tsx           # ThemeProvider + PostHogProvider + QueryProvider
│   ├── lib/
│   │   ├── env.ts                  # validated env via zod (NEXT_PUBLIC_*)
│   │   └── seo.ts                  # page-level wrappers around @rootline/seo
│   └── _stubs/                     # DELETE once Phase 5 lands
│       ├── seo.ts                  # buildMetadata/jsonld stubs
│       ├── api-client.ts           # fetch wrappers returning [] / null
│       ├── analytics.ts            # PostHog no-op
│       └── ui-blocks.ts            # re-export from @rootline/ui if exists, else basic divs
├── public/
│   ├── favicon.ico
│   ├── og-default.png
│   └── logo.svg
├── next.config.mjs                 # transpilePackages: @rootline/*
├── tailwind.config.ts              # extends @rootline/config-tailwind
├── tsconfig.json                   # extends @rootline/tsconfig/nextjs
├── .env.example
└── package.json                    # @rootline/client
```

## Route Specs

### `/` Landing
- Blocks: `Hero` (display headline + sub + dual CTA), `LogoCloud` (trusted-by placeholder), `FeatureGrid` (services preview 3-up), `StatsRow`, `Testimonial`, `CTA` (book consultation).
- JSON-LD: `Organization` + `WebSite` + `BreadcrumbList`.
- OG: static `/og-default.png` fallback; dynamic `/api/og/landing`.

### `/about`
- Blocks: `PageHeader`, prose section (mission/vision), `StatsRow`, **Team grid** (uses `@rootline/api-client` `useTeamList()`, renders Avatar + name + role + social links).
- JSON-LD: `Organization` (with `employee` array if team published) + `BreadcrumbList`.

### `/services`
- Single page, 3 anchor sections: `#vapt`, `#mobile-flutter`, `#web-apps`.
- Each section = `SectionHeading` + prose + sub-feature list + per-section CTA.
- Sticky in-page nav for jumping between sections.
- JSON-LD: `Service` for each (3 Service entities) + `BreadcrumbList`.

### `/careers`
- List of jobs from `useJobList()`. Card per job: title, dept, location, type badge, "Apply" link.
- Empty state when no open roles.
- JSON-LD: `BreadcrumbList`.

### `/careers/[slug]`
- Job detail: title, dept/location/type, body (RichTextRenderer), salary range, posted date.
- Apply form below: firstName, lastName, email, phone, coverNote, resume (PDF). Form via `<FormField>` (rhf+zod), schema from `@rootline/validators` `jobApplicationContract`.
- Submit → POST `/api/careers/apply` → multipart relay to backend `POST /api/v1/applications` (resume uploaded first to `/api/v1/upload`, filename attached).
- JSON-LD: `JobPosting` with all required fields (datePosted, validThrough, hiringOrganization, jobLocation, employmentType, baseSalary if present).
- `generateStaticParams()` from job slugs; revalidate on backend webhook.

### `/contact`
- Form: name, email, subject (enum select: `SERVICES_INQUIRY/CAREERS/OTHER/GENERAL`), message. Schema from `@rootline/validators` `contactContract`.
- Submit → POST `/api/contact` → backend `POST /api/v1/contacts`.
- Success state replaces form.
- JSON-LD: `BreadcrumbList` + `LocalBusiness` (also rendered in footer globally).

### `/blog`
- Cursor-paginated list via `useInfiniteBlogList()` (from `@rootline/api-client`).
- Card per post: cover image, title, excerpt, date, reading time, tags.
- "Load more" button (no infinite scroll).
- JSON-LD: `BreadcrumbList`.

### `/blog/[slug]`
- Article: cover, title, author, date, tags, RichTextRenderer for Tiptap JSON body.
- TOC sidebar (desktop) generated from headings in body.
- Related posts (3) at bottom.
- JSON-LD: `Article` + `BreadcrumbList` + `FAQPage` if body contains FAQ block.
- `generateStaticParams()` from blog slugs; revalidate on backend webhook.
- Dynamic OG: `/api/og/blog?slug=...` renders cover with title overlay.

## Critical Files

### `app/layout.tsx`
```tsx
// pseudo — implementer fills
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@rootline/seo";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-display" });

export const metadata = { /* default site metadata via @rootline/seo */ };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <body>
        <Providers>
          <SiteNav />
          {children}
          <SiteFooter />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([buildOrganizationJsonLd(), buildWebSiteJsonLd()]) }} />
      </body>
    </html>
  );
}
```

### `app/sitemap.ts`
```ts
import type { MetadataRoute } from "next";
import { listAllBlogSlugs, listAllJobSlugs } from "@rootline/api-client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const staticRoutes = ["", "/about", "/services", "/careers", "/contact", "/blog"];
  const [blogs, jobs] = await Promise.all([listAllBlogSlugs(), listAllJobSlugs()]);
  return [
    ...staticRoutes.map(p => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...blogs.map(s => ({ url: `${base}/blog/${s.slug}`, lastModified: s.updatedAt })),
    ...jobs.map(s => ({ url: `${base}/careers/${s.slug}`, lastModified: s.updatedAt })),
  ];
}
```

### `app/robots.ts`
Allow `/`, disallow `/api/`.

### `app/api/og/[type]/route.tsx`
Uses `next/og` `ImageResponse`. Switch on `type`: `landing | blog | service | job`. Reads query params for title/subtitle/cover. Edge runtime.

### `app/api/revalidate/route.ts`
Reads `?secret=...&tag=...&path=...`. HMAC compares against `REVALIDATE_SECRET` env. Calls `revalidateTag` and/or `revalidatePath`. Returns `{ revalidated: true, now: Date.now() }`.

### `app/api/contact/route.ts`
POST. Parses body, validates via `contactContract` (from `@rootline/validators`), forwards to `${API_URL}/api/v1/contacts`. Returns `{ ok }`. No auth — public.

### `app/api/careers/apply/route.ts`
POST multipart. Pulls `resume` file from `formData`. First uploads to `${API_URL}/api/v1/upload` (multipart relay). Receives `{ filename }`. Then POSTs JSON `{ jobId, firstName, ..., resumeFile: filename }` to `${API_URL}/api/v1/applications`. Returns `{ ok }`.

### `src/lib/env.ts`
Validates: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `REVALIDATE_SECRET`, `GEO_LAT?`, `GEO_LNG?`, `COMPANY_ADDRESS?`. Throws at boot if required missing.

### `src/components/providers.tsx`
Wraps `ThemeProvider` (next-themes, `attribute="class"`, `defaultTheme="system"`) + PostHog client (init only if key present) + React Query `QueryClientProvider`.

### `src/components/site-nav.tsx`
Composes `@rootline/ui/blocks/Nav`. Items: Home, About, Services, Careers, Blog, Contact (CTA pill). Theme toggle right-side. Mobile sheet menu.

### `src/components/site-footer.tsx`
Composes `@rootline/ui/blocks/Footer`. Columns: brand+blurb, links, contact, social. Emits `LocalBusiness` JSON-LD using `GEO_LAT`/`GEO_LNG`/`COMPANY_ADDRESS` env.

## Reused Existing Code

- `@rootline/ui/blocks/*` (Phase 4 done): `Hero`, `SectionHeading`, `CTA`, `FAQ`, `StatsRow`, `FeatureGrid`, `LogoCloud`, `Testimonial`, `Footer`, `Nav`, `BreadcrumbBar`, `PageHeader`.
- `@rootline/ui/components/*` (Phase 4 done): `Button`, `Card`, `Badge`, `Avatar`, `Skeleton`, `Sheet`, `Separator`.
- `@rootline/ui/data/EmptyState`, `Pagination` (Phase 4 done).
- `@rootline/ui/forms/FormField`, `FormSection`, `FormActions` (Phase 4 done).
- `@rootline/ui/editor/RichTextRenderer` (Phase 4 done — for blog body rendering).
- `@rootline/config-tailwind/tokens.css` (Phase 4 done).
- `apps/user/app/api/revalidate/route.ts` skeleton (Phase 3 done — verify HMAC logic complete).
- `apps/user/app/layout.tsx` skeleton with fonts (Phase 3 done — extend with providers + JSON-LD).
- `apps/user/app/sitemap.ts` + `robots.ts` skeletons (Phase 3 done — wire to API).

## Env Vars

`.env.example` additions:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
REVALIDATE_SECRET=devsecret
GEO_LAT=27.7172
GEO_LNG=85.3240
COMPANY_ADDRESS=Kathmandu, Nepal
```

## Phase 5 Stub Contracts (delete after Phase 5)

If `@rootline/*` packages missing, implementer creates these in `src/_stubs/`:

```ts
// _stubs/seo.ts
export const buildMetadata = (i: any) => ({ title: i.title, description: i.description });
export const buildOrganizationJsonLd = () => ({ "@context": "https://schema.org", "@type": "Organization", name: "Rootline Technology" });
export const buildWebSiteJsonLd = () => ({ "@context": "https://schema.org", "@type": "WebSite", url: process.env.NEXT_PUBLIC_SITE_URL });
export const buildArticleJsonLd = (_: any) => ({});
export const buildServiceJsonLd = (_: any) => ({});
export const buildJobPostingJsonLd = (_: any) => ({});
export const buildBreadcrumbJsonLd = (_: any[]) => ({});
export const buildLocalBusinessJsonLd = () => ({});
export const buildFAQPageJsonLd = (_: any[]) => ({});

// _stubs/api-client.ts
export const listAllBlogSlugs = async () => [];
export const listAllJobSlugs = async () => [];
export const useTeamList = () => ({ data: [], isLoading: false });
export const useJobList = () => ({ data: [], isLoading: false });
export const useInfiniteBlogList = () => ({ data: { pages: [] }, fetchNextPage: () => {}, hasNextPage: false });

// _stubs/analytics.ts
export const capture = (_: string, __?: any) => {};
export const PostHogProvider = ({ children }: any) => children;
```

Implementer **must** swap stub imports for real `@rootline/*` once Phase 5 lands. Search-and-replace by import path; no other code change needed if contracts honored.

## Implementation Order

1. Wire `globals.css` + tokens import + verify theme toggle.
2. `providers.tsx` (ThemeProvider + QueryProvider + PostHog).
3. `site-nav.tsx` + `site-footer.tsx`.
4. Extend `layout.tsx` with providers + nav + footer + default JSON-LD.
5. `/` Landing — compose blocks, placeholder copy.
6. `/about` — page + team grid (uses stub list).
7. `/services` — sectioned page with anchor nav.
8. `/contact` — form + API proxy.
9. `/careers` list + `/careers/[slug]` detail + apply form + multipart proxy.
10. `/blog` list + `/blog/[slug]` detail.
11. `sitemap.ts` wired to API.
12. `app/api/og/[type]/route.tsx`.
13. `not-found.tsx` + `error.tsx`.

## Verification

Per route:
- Page renders both light + dark, no theme flash.
- View source: `<title>`, `<meta name="description">`, OG tags, `application/ld+json` script present.
- `curl localhost:3000/sitemap.xml` → all 6 static routes + dynamic slugs.
- `curl localhost:3000/robots.txt` → allows `/`, disallows `/api/`.
- `curl localhost:3000/api/og/landing` → returns PNG.
- `curl -X POST localhost:3000/api/revalidate?secret=devsecret&tag=blog` with valid HMAC → `{ revalidated: true }`. Invalid HMAC → 401.
- Submit contact form → row in backend `Contact` table.
- Submit career application with PDF → row in `JobApplication`, file in `apps/api/public/uploads/`, filename matches DB row.
- Lighthouse on `/` and `/blog/[slug]` (with seeded post): SEO ≥ 95, A11y ≥ 95.
- `pnpm -F @rootline/client typecheck lint` passes.
- `pnpm -F @rootline/client build` produces `.next/` with no errors.

## Open Items

- Confirm `subject` enum values for contact form match backend `ContactSubject` enum (`SERVICES_INQUIRY/CAREERS/OTHER/GENERAL`).
- Decide TOC generation: from headings in Tiptap JSON or rendered DOM. Recommend Tiptap JSON traversal (deterministic, SSR-friendly).
- Confirm sticky in-page nav design for `/services` — pill bar or sidebar.
- Confirm reading-time computation: stored in DB on post create, or computed at render. Recommend DB column (set in backend `blog.service.ts`).
