# Phase 5 — Shared Frontend Packages

**Status:** planning only. To be implemented by Sonnet/Haiku via `/implement phase-5-shared-packages`.

## Context

`packages/ui` ships. Now build the remaining shared packages so user + admin can wire data, auth, validation, SEO, analytics, and uploads without duplication. All packages live under `packages/` and use the `@rootline/*` scope.

## Packages to build (8)

Build in this order — later packages depend on earlier ones.

### 1. `@rootline/utils`

Pure helpers — no React, no I/O.

**Location:** `packages/utils/`

**Files:**
- `src/index.ts` — barrel
- `src/format/date.ts` — `formatDate(d, "short"|"long"|"relative")`, `formatDateRange`, `toISODate`
- `src/format/string.ts` — `slugify`, `truncate`, `pluralize`, `titleCase`, `initials(name)`
- `src/format/number.ts` — `formatNumber`, `formatCurrency`, `formatBytes`
- `src/array.ts` — `groupBy`, `partition`, `unique`, `chunk`
- `src/object.ts` — `pick`, `omit`, `deepEqual`, `safeJSON.parse`, `safeJSON.stringify`
- `src/guards.ts` — `isString`, `isNonEmpty`, `isRecord`, `assertNever(x)`
- `src/url.ts` — `joinUrl`, `withQuery(url, params)`, `parseQuery`

**No deps** beyond `date-fns` (peer) for date formatting. Tree-shakeable named exports.

**Test pattern:** unit tests on every util, snapshot-free.

### 2. `@rootline/hooks`

Reusable React hooks. Client-only — every file marked `"use client"`.

**Location:** `packages/hooks/`

**Files:**
- `src/index.ts`
- `src/use-debounce.ts` — `useDebounce<T>(value, ms)`
- `src/use-media-query.ts` — `useMediaQuery(query)`, helpers `useIsMobile`, `useIsDesktop`
- `src/use-local-storage.ts` — `useLocalStorage<T>(key, initial)` SSR-safe
- `src/use-intersection.ts` — `useIntersection(ref, opts)`, returns `{ entry, isIntersecting }`
- `src/use-copy-to-clipboard.ts` — `useCopyToClipboard()` → `[copied, copy]`
- `src/use-prefers-reduced-motion.ts` — boolean
- `src/use-mounted.ts` — SSR-safe mounted flag
- `src/use-controllable-state.ts` — Radix-style controlled/uncontrolled pattern
- `src/use-toggle.ts` — `[on, toggle, set]`

**Deps:** none. React + types as peer.

### 3. `@rootline/validators`

**Single source of truth for zod schemas.** Regular workspace package mirroring api schemas.

**Location:** `packages/validators/`



### 4. `@rootline/api-client`

Typed fetch wrapper + React Query hooks for every server endpoint.

**Location:** `packages/api-client/`

**Deps:** `@tanstack/react-query`, `zod` (peer), `@rootline/validators` (workspace), `@rootline/utils` (workspace).

**Files:**

```
src/
├── index.ts                  ← barrel
├── client.ts                 ← base fetcher (createApiClient)
├── error.ts                  ← ApiError class
├── query-keys.ts             ← centralized React Query key factory
├── provider.tsx              ← <ApiProvider> wrapping QueryClientProvider
└── resources/
    ├── blog.ts               ← useBlogList(), useBlog(slug), useCreateBlog(), useUpdateBlog(), useDeleteBlog()
    ├── caseStudy.ts
    ├── contact.ts            ← useSubmitContact(), useContacts() (admin)
    ├── service.ts
    ├── team.ts
    ├── job.ts
    ├── application.ts        ← useSubmitApplication(), useApplications() (admin)
    ├── upload.ts             ← uploadFile()
    └── auth.ts               ← (Phase 5b — slim until Better-Auth lands)
```

**Base fetcher contract** (`client.ts`):
```ts
type FetchOpts = {
  method?: "GET"|"POST"|"PATCH"|"PUT"|"DELETE";
  body?: unknown;
  query?: Record<string, string|number|boolean|undefined>;
  signal?: AbortSignal;
  schema?: z.ZodTypeAny;   // optional response validation
};

export function createApiClient(baseUrl: string) {
  return {
    request<T>(path: string, opts?: FetchOpts): Promise<T>
  }
}

export const api = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
```

**Rules for resource files:**
- Each cursor-paginated list returns infinite query: `useBlogList(filters?)` → `useInfiniteQuery({ queryKey, queryFn, getNextPageParam })`.
- Each single fetch: `useBlog(slug, { enabled })` → `useQuery`.
- Each mutation invalidates relevant `queryKey` after `onSuccess`.
- Server-side fetches expose plain `fetchBlogList()` (no hook wrapper) for use in RSC.
- All requests include `credentials: "include"` for Better-Auth cookies.

**Response envelope** matches server's `responseHandler`:
```ts
{ success: boolean, data: T, message?: string, meta?: { pagination: {...} } }
```
Fetcher unwraps `data` automatically. Errors throw `ApiError(status, code, message)`.

### 5. `@rootline/auth-client`

Better-Auth client wrapper. Sits on top of `better-auth/client`.

**Location:** `packages/auth-client/`

**Status note:** Server's Better-Auth mount is Phase 2 follow-up (scaffolded, not wired). This package can be built now against the planned mount at `/api/v1/auth`. Until server wires it, hooks return a static "signed out" state.

**Deps:** `better-auth` (peer or direct), `@rootline/utils`.

**Files:**
- `src/client.ts` — `createAuthClient({ baseURL })` from `better-auth/client`
- `src/hooks.ts` — `useSession()`, `useUser()`, `useSignIn()`, `useSignOut()`, `useSignUp()`
- `src/rbac.ts` — `can(user, resource, action)`, `requireRole(min: RoleName)`, `hasMinHierarchy(user, min)`
- `src/middleware.ts` — server-side helper `getSessionFromHeaders(headers)` for Next middleware + RSC layouts
- `src/types.ts` — `Session`, `User`, `RoleName`, `Permission` types (mirrors server)
- `src/index.ts`

**RBAC contract:**
```ts
type RoleName = "SUPER_ADMIN" | "ADMIN" | "BUSINESS_OWNER" | "MANAGER" | "ANALYST" | "MEMBER";

const HIERARCHY: Record<RoleName, number> = {
  SUPER_ADMIN: 1, ADMIN: 2, BUSINESS_OWNER: 3,
  MANAGER: 4, ANALYST: 5, MEMBER: 6,
};

export function hasMinRole(user: User | null, min: RoleName): boolean
export function can(user: User | null, resource: string, action: string): boolean
```

Permissions arrive on session as `{ resource, action }[]`. `can()` checks membership.

### 6. `@rootline/storage`

Thin client wrapping server's `/api/v1/upload`.

**Location:** `packages/storage/`

**Files:**
- `src/index.ts`
- `src/upload.ts` — `upload(file: File, opts?): Promise<{ filename: string, url: string }>` posts multipart, returns `{ filename, url }`
- `src/url.ts` — `getUrl(filename: string): string` → `${API_BASE}/uploads/${filename}`
- `src/remove.ts` — `remove(filename: string): Promise<void>` (admin only)
- `src/hooks.ts` — `useUpload()` → `{ mutate, isPending, progress }` wrapping a useMutation that posts via XHR for progress events

**Contract:** Frontend never touches disk. Returns relative filename only. URL constructed via `getUrl()` for `next/image`.

### 7. `@rootline/seo`

Metadata + JSON-LD + dynamic OG helpers.

**Location:** `packages/seo/`

**Files:**
- `src/index.ts`
- `src/metadata.ts` — `buildMetadata({ title, description, path, image?, type? }): Metadata` returning Next 15 `Metadata` with canonical, OG, Twitter card
- `src/jsonld.ts` — typed builders per schema.org type:
  - `organization(opts)`
  - `website(opts)`
  - `breadcrumbList(crumbs)`
  - `article(post)`
  - `service(service)`
  - `jobPosting(job)`
  - `localBusiness(opts)` — uses env `GEO_LAT`/`GEO_LNG`
  - `faqPage(items)`
- `src/og.tsx` — `<OGTemplate />` React component used by `apps/user/app/api/og/[type]/route.tsx` for `next/og` ImageResponse rendering. Variants per type (blog/service/job/page).
- `src/site.ts` — central site metadata constants (name, description, urls, contact)

**Contract:** every public route in `apps/user` must call `buildMetadata()` in `generateMetadata` and inject at least one JSON-LD type via `<script type="application/ld+json">`. See `.claude/docs/seo-checklist.md`.

### 8. `@rootline/analytics`

PostHog wrapper for both apps.

**Location:** `packages/analytics/`

**Files:**
- `src/index.ts`
- `src/client.tsx` — `<PostHogProvider>` (client component) initializing posthog-js with `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST`
- `src/events.ts` — typed event names + payloads:
  - `contact_submitted`, `application_submitted`, `blog_read`, `service_section_viewed`, `cta_clicked`, `nav_clicked`
- `src/track.ts` — `track(event, props)` wrapper. Type-safe — only events from `events.ts` allowed.
- `src/identify.ts` — `identify(user)` for logged-in admin sessions
- `src/server.ts` — server-side `captureServerEvent` for RSC + route handlers (uses PostHog Node SDK, optional)
- `src/page-view.tsx` — `<PageViewTracker />` listens to Next router events, auto-tracks pageviews with referrer + UTM

**Privacy:** respect `NEXT_PUBLIC_POSTHOG_KEY` absence → noop. Never track admin app pageviews (separate project key if used).

## Package skeleton template (use for each)

```
packages/<name>/
├── package.json
├── tsconfig.json              extends @rootline/tsconfig/react-library.json (or base.json for utils)
└── src/
    ├── index.ts               barrel — only public API
    └── ...
```

**package.json shape:**
```json
{
  "name": "@rootline/<name>",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "echo 'lint not configured' && exit 0",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": { "react": "^19.0.0" },          ← omit for utils
  "devDependencies": {
    "@rootline/typescript": "workspace:*",
    "typescript": "^5.9.3"
  }
}
```

## Workspace wiring

After building, add to `apps/user/package.json` + `apps/admin/package.json` dependencies:

```json
{
  "dependencies": {
    "@rootline/utils":        "workspace:*",
    "@rootline/hooks":        "workspace:*",
    "@rootline/validators":   "workspace:*",
    "@rootline/api-client":   "workspace:*",
    "@rootline/auth-client":  "workspace:*",
    "@rootline/storage":      "workspace:*",
    "@rootline/seo":          "workspace:*",
    "@rootline/analytics":    "workspace:*"
  }
}
```

Update `next.config.mjs` of both apps:

```js
transpilePackages: [
  "@rootline/ui",
  "@rootline/config-tailwind",
  "@rootline/utils",
  "@rootline/hooks",
  "@rootline/validators",
  "@rootline/api-client",
  "@rootline/auth-client",
  "@rootline/storage",
  "@rootline/seo",
  "@rootline/analytics",
]
```

## Implementation rules (apply to every package)

1. **TS strict** — no `any`, no `@ts-ignore`. Honor `.claude/CLAUDE.md`.
2. **Tree-shakeable barrels** — named exports only, no default exports from package root.
3. **Server-safe by default** — mark `"use client"` only where browser APIs / state used.
4. **No CSS** in these packages (all visuals in `@rootline/ui`). Exception: `@rootline/seo/src/og.tsx` uses inline styles for `next/og`.
5. **Side-effect-free** — `"sideEffects": false` in package.json unless CSS shipped.
6. **Each package** must `pnpm typecheck` clean before moving to the next.
7. **Document each public export** with a single-line JSDoc `@summary` for IDE autocomplete.

## Verification per package

| Package | Smoke test |
|---|---|
| utils | Import `slugify("Hello World")` → `"hello-world"` in a Next page |
| hooks | Use `useDebounce` in admin search input |
| validators | `import { createBlogPostContract } from "@rootline/validators"` typechecks against server schema |
| api-client | `useBlogList()` returns paginated blog from server's `/api/v1/blog` |
| auth-client | `useSession()` returns `null` until logged in; `can(user, "blog", "publish")` returns boolean |
| storage | `upload(file)` posts to server, returns `{ filename, url }` |
| seo | Landing route's `generateMetadata` returns canonical + OG + Twitter |
| analytics | PostHog fires `pageview` on route change in client app |

## Out of scope (later phases)

  - Phase 6 wires these into user routes (Landing, About+Team, Services, Careers, Contact, Blog)
- Phase 7 wires `auth-client` into admin middleware + login flow
- Phase 8 wires `api-client` resource hooks into admin CRUD pages
- Phase 10 wires `analytics` dashboard cards
- Tiptap editor + RichTextRenderer in `@rootline/ui/editor` lands Phase 8 (blog CRUD)

## Build order summary

1. utils         (zero deps)
2. hooks         (depends on react)
3. validators    (zero deps beyond zod, re-exports server schemas)
4. seo           (depends on Next types only)
5. analytics     (depends on posthog-js)
6. storage       (depends on api-client base fetcher → build after step 7)
7. api-client    (depends on utils, validators)
8. auth-client   (depends on utils, better-auth)
9. storage       (depends on api-client) — move to step 9
10. Wire deps + transpilePackages in user + admin

Adjusted order: 1, 2, 3, 4, 5, 7, 8, 6 (or 9), then wire.
