---
description: Scaffold a single Express endpoint in server with zod + RBAC + service layer.
argument-hint: <resource> <action> (e.g. "blog publish")
---

Spawn `backend-engineer` agent.

Add endpoint: **$ARGUMENTS**

Steps:
1. Add/extend zod schema in `apps/api/src/schemas/<resource>.schema.ts`
2. Add service function in `apps/api/src/services/<resource>.service.ts`
3. Add controller method in `apps/api/src/controllers/<resource>.controller.ts`
4. Add route in `apps/api/src/routes/<resource>.routes.ts` with appropriate `rolesGuard` / `permissionsGuard`
5. Use `responseHandler` for response, throw `CustomError` on failure
6. If new resource: register route in `src/index.ts`

Done: curl test passes, typecheck green, zod schema exported.
