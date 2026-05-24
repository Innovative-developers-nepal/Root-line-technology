---
description: Scaffold a Next route in apps/user or apps/admin with metadata + JSON-LD + sitemap entry.
argument-hint: <client|admin> <route-path>
---

Spawn `implementer` (or `ui-builder` if purely compositional).

Scaffold a new page at: **$ARGUMENTS**

Required output:
- `app/<path>/page.tsx` composing blocks from `@rootline/ui/blocks`
- `generateMetadata` via `@rootline/seo/buildMetadata`
- JSON-LD via `@rootline/seo/jsonld` (type appropriate to route)
- Sitemap entry added if route is dynamic
- Loading + error boundaries
- A11y: semantic landmarks, heading hierarchy

After scaffold: run `seo-auditor` on the new route.
