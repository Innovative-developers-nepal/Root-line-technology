---
name: crud-module
description: Scaffold complete CRUD for a Prisma model — backend (schema+service+controller+route+zod+RBAC guard) plus admin frontend (DataTable list, FormField create/edit, AlertDialog delete) and public render. Reuses existing patterns from blog.* files. Trigger when user says "add CRUD for X", "scaffold admin module", "/crud X".
---

# CRUD Module Skill

## When to trigger

- `/crud <Model>` command
- "scaffold CRUD for <Model>"
- "add admin pages for <Model>"

## Backend portion (delegate to `backend-engineer` agent)

Pattern: copy `blog.*` files verbatim, find-replace `Blog` → `<Model>`, adjust fields.

Files to create:
- `apps/api/src/schemas/<model>.schema.ts` — `create<Model>Schema`, `update<Model>Schema`, `<model>ListQuerySchema` (cursor + filters)
- `apps/api/src/services/<model>.service.ts` — `create`, `findById`, `findBySlug` (if slugged), `list` (cursor), `update`, `remove`
- `apps/api/src/controllers/<model>.controller.ts` — thin handlers calling service
- `apps/api/src/routes/<model>.routes.ts` — express router with RBAC guards
- Register in `src/routes/index.ts` + `src/index.ts`
- Re-export schema from `src/schemas/index.ts`

RBAC defaults:
- `list`, `findBySlug` — public (no guard) if `published=true` filter; admin reads use `permissionsGuard({ resource, action: 'read' })`
- `create` — `permissionsGuard({ resource, action: 'create' })`
- `update` — `permissionsGuard({ resource, action: 'update' })`
- `delete` — `permissionsGuard({ resource, action: 'delete' })` + min `ADMIN` role
- `publish` — `permissionsGuard({ resource, action: 'publish' })`

After write success: call `revalidateService.notify(['<model>-list', '<model>-<id>'])`.

## Frontend admin portion

Files to create under `apps/admin/app/(dashboard)/<model>/`:

- `page.tsx` — list using `<DataTable variant="comfortable">` with cursor pagination
- `new/page.tsx` — create form
- `[id]/edit/page.tsx` — edit form (same `<<Model>Form>` component, prefilled)
- `_components/<Model>Form.tsx` — rhf+zod form composed of `<FormField>`s
- `_components/<Model>Columns.tsx` — column defs for DataTable
- `_components/Delete<Model>Dialog.tsx` — AlertDialog confirm

All forms validate via `@rootline/validators` (same schema as backend).

## Frontend client portion (if public)

Files to create under `apps/user/app/(marketing)/<model-plural>/`:
- `page.tsx` — list with cursor pagination, blocks from `@rootline/ui/blocks`
- `[slug]/page.tsx` — detail with `generateMetadata` + JSON-LD via `@rootline/seo`

## API-client hooks

Add to `packages/api-client/src/<model>.ts`:
- `use<Model>List(filters, cursor)` — useInfiniteQuery
- `use<Model>(slug | id)` — useQuery
- `useCreate<Model>()` — useMutation
- `useUpdate<Model>()` — useMutation
- `useDelete<Model>()` — useMutation

Invalidate `['<model>']` on mutations.

## Verification

- `pnpm -w turbo run typecheck lint`
- Manual smoke: create → list → edit → delete in admin
- Public list/detail renders if applicable
- Revalidate hits on writes
