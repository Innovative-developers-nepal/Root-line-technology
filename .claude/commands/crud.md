---
description: Scaffold an admin CRUD module + public render for a Prisma model.
argument-hint: <ModelName>
---

Spawn `implementer` agent.

Model: **$ARGUMENTS**

Generate full CRUD:

**Backend (delegate to `backend-engineer`):**
- Zod schema in `apps/api/src/schemas/<model>.schema.ts` (create/update/list/cursor)
- Service in `apps/api/src/services/<model>.service.ts`
- Controller in `apps/api/src/controllers/<model>.controller.ts`
- Routes in `apps/api/src/routes/<model>.routes.ts` with RBAC guards
- Register in `src/routes/index.ts` + `src/index.ts`
- Re-export schemas from `src/schemas/index.ts`

**Frontend admin (`apps/admin`):**
- List page: `<DataTable>` with cursor pagination + `<FilterBar>` + `<EmptyState>`
- Create form: `<FormField>`s via rhf+zod, validators from `@rootline/validators`
- Edit form: prefilled, same component as create
- Delete: `<AlertDialog>` confirm
- Page metadata + breadcrumbs

**Frontend user (`apps/user`):** if public-facing
- List route with cursor pagination
- Detail route `[slug]/page.tsx` with metadata + JSON-LD

Every form input → `<FormField>`. Every list → `<DataTable variant="comfortable">`. No raw markup.

After scaffold: revalidate webhook wired, typecheck green, smoke test create→read→update→delete in admin.
