# RBAC Matrix — Rootline

Backend uses 6-level role hierarchy + per-resource permissions. Roles seeded in `apps/api/prisma/seed/`.

## Role hierarchy (lower number = more powerful)

| # | RoleName | Display | Notes |
|---|---|---|---|
| 1 | `SUPER_ADMIN` | Super Admin | System-level. User + role management. Cannot be deleted. |
| 2 | `ADMIN` | Admin | Full CMS access. Publish content. Manage non-admin users. |
| 3 | `BUSINESS_OWNER` | Business Owner | (legacy from AEORanker — repurpose or drop) |
| 4 | `MANAGER` | Manager | (legacy — repurpose or drop) |
| 5 | `ANALYST` | Analyst | Read-only dashboard + analytics. |
| 6 | `MEMBER` | Member | Author own blog posts. Read-only elsewhere. |

For portfolio: primary roles in use = `SUPER_ADMIN`, `ADMIN`, `MEMBER` (Author), `ANALYST` (Viewer). Others stay in schema for compatibility but may be unused.

## Permission seed (resource × action)

Seeded into `Permission` table on `prisma db seed`.

| Resource | Actions |
|---|---|
| `user` | create, read, update, delete, suspend |
| `role` | read, assign |
| `service` | create, read, update, delete, publish |
| `team` | create, read, update, delete, publish |
| `job` | create, read, update, delete, publish |
| `application` | read, update, delete |
| `blog` | create, read, update, delete, publish |
| `caseStudy` | create, read, update, delete, publish |
| `contact` | read, update, delete |
| `analytics` | read |
| `upload` | create, delete |

## Role → Permission map (defaults seeded)

### SUPER_ADMIN — all permissions

### ADMIN — all except `user.delete`, `role.assign` (above their own hierarchy)

### MEMBER (Author)
- `blog`: create, read, update (own posts only — enforced at service level), delete (own), no publish
- `upload`: create
- `analytics`: read (own)

### ANALYST (Viewer)
- `*.read` only
- `analytics.read`

## Enforcement points

### Server
- **Route level**: `rolesGuard([RoleName.ADMIN, RoleName.SUPER_ADMIN])` for fast role checks
- **Action level**: `permissionsGuard({ resource: "blog", action: "publish" })` for fine-grained
- **Row level**: services check `req.user.id === resource.authorId` for own-only operations

### Frontend
- **Route middleware** (`apps/admin/middleware.ts`): redirect non-`ADMIN`+ to `/login`
- **Page-level**: `requireRole("ADMIN")` server-side check in layout
- **UI conditional**: `{can("blog", "publish") && <PublishButton />}`

## Adding a new permission

1. Add row to `apps/api/src/config/permissions.ts` seed array
2. Run `cd apps/api && pnpm db:seed`
3. Manually assign to roles in seed (or via admin UI later)
4. Reference in backend `permissionsGuard` + frontend `can()`

## Notes

- Better-Auth handles session/account/verification. Roles + permissions are Rootline-layer on top.
- Auth middleware loads `role` + permissions into `req.user` on every request.
- Permission denial returns 403 via `responseHandler` from server. Frontend toasts a generic "Not allowed" + logs detail to console.
