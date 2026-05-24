# Rootline Architecture (distilled)

## Topology

Single monorepo. One deployable backend + two frontends in one workspace.

```
┌─────────────┐       ┌──────────────────┐      ┌──────────────┐
│  apps/user  │ ────► │     apps/api     │◄──── │  apps/admin  │
│  Next 15    │ HTTPS │  Express 5       │HTTPS │  Next 15     │
│  marketing  │       │  /api/v1/*       │      │  CMS         │
│ (port 3000) │       │  (port 5000)     │      │ (port 3001)  │
└─────────────┘       │  Prisma 7        │      └──────────────┘
        │              │  SQLite          │             │
        │              │  Better-Auth     │             │
        │              └──────────────────┘             │
        │                                               │
        │ Workspace -- shared @rootline/* packages       │
        ▼                                               ▼
        └─── api-client / auth-client / ui / seo / analytics
             storage / utils / hooks / validators
```

**Deploy model:**
- `apps/api/` ships to a VPS. Owns the SQLite file at `db/dev.db`.
- `apps/user` + `apps/admin` build as static + edge functions, deploy to Vercel / Cloudflare Pages / self-host. Talk to api over HTTPS via `NEXT_PUBLIC_API_URL`.
- Cookies (`Session`) scoped to `.rootline.tech` so admin + user + api share session under one parent domain.

## Request flow (admin write)

1. Admin user fills form → rhf+zod validates against `@rootline/validators`
2. `@rootline/api-client` mutation → `fetch(POST /api/v1/<resource>, credentials: 'include')`
3. Api route → `authMiddleware` → `permissionsGuard` → `validate(schema)` → `controller` → `service` → Prisma
4. Service emits revalidation hook → `POST {CLIENT_URL}/api/revalidate?secret=...&tag=<resource>-list`
5. User `app/api/revalidate/route.ts` → `revalidateTag(tag)` → ISR refreshes
6. Public user `/blog` next request sees fresh data

## Auth flow

1. Admin → `/login` → `signIn.email({ email, password })` (better-auth client)
2. Better-Auth handler at `/api/v1/auth/sign-in/email` (api) → validates, issues session cookie
3. Cookie scoped to `.rootline.tech` so user + admin share session
4. Subsequent requests: middleware reads session → loads `user.role` + `role.permissions` → attaches to `req.user`
5. Frontend: `useSession()` → `{ user, role, permissions }`; `can(resource, action)` for UI gating

## RBAC

6-level role hierarchy in DB:
| Hierarchy | Role | Use |
|---|---|---|
| 1 | SUPER_ADMIN | System admin, user/role mgmt |
| 2 | ADMIN | Full CMS access, content publish |
| 3 | BUSINESS_OWNER | (legacy from AEORanker — may drop) |
| 4 | MANAGER | (legacy) |
| 5 | ANALYST | Read-only dashboard |
| 6 | MEMBER | Author own content |

Permissions: `(resource, action)` rows. Examples:
- `(blog, create)` → AUTHOR + above
- `(blog, publish)` → ADMIN + above
- `(user, delete)` → SUPER_ADMIN only

## Data

- All persistent state in SQLite via Prisma (api-side only).
- Frontend never imports Prisma. All access via `@rootline/api-client`.
- File uploads → multer → `public/uploads/<filename>` → served at `${API}/uploads/<filename>`.
- Tiptap rich text stored as JSON string in SQLite.

## Performance/SEO

- Marketing pages static-by-default with ISR (`revalidate: 60`).
- Blog list + detail use ISR with on-demand revalidation via webhook.
- OG images generated at request time via `next/og` ImageResponse.
- Sitemap built from DB query in `app/sitemap.ts`.

## See also

- [design-tokens.md](./design-tokens.md)
- [conventions.md](./conventions.md)
- [seo-checklist.md](./seo-checklist.md)
- [rbac-matrix.md](./rbac-matrix.md)
