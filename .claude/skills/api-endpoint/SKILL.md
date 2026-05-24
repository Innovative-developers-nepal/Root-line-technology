---
name: api-endpoint
description: Scaffold an Express endpoint in apps/api with zod schema, service function, controller, route registration, and RBAC guard. Mirrors existing blog/contact patterns. Trigger when user says "add endpoint", "new API route", or "/endpoint".
---

# API Endpoint Skill

## When to trigger

- `/endpoint` command
- "add endpoint for X"
- "new POST/GET/PATCH at /api/v1/..."

## File structure

For resource `<resource>`:

```
apps/api/src/
├── schemas/<resource>.schema.ts      # zod input + output
├── services/<resource>.service.ts    # business logic, prisma calls
├── controllers/<resource>.controller.ts  # req/res handlers, thin
├── routes/<resource>.routes.ts       # express router
├── routes/index.ts                   # barrel export
└── index.ts                          # app.use("/api/v1/<resource>", router)
```

## Templates

### Schema (`schemas/<resource>.schema.ts`)

```ts
import { z } from "zod"

export const create<Resource>Schema = z.object({
  // fields
})

export const update<Resource>Schema = create<Resource>Schema.partial()

export const <resource>ListQuerySchema = z.object({
  cursor: z.string().optional(),
  take: z.coerce.number().int().min(1).max(50).default(20),
  // filters
})

export type Create<Resource>Input = z.infer<typeof create<Resource>Schema>
export type Update<Resource>Input = z.infer<typeof update<Resource>Schema>
```

Also export from `src/schemas/index.ts`.

### Service (`services/<resource>.service.ts`)

```ts
import prisma from "../config/prisma"
import { CustomError } from "../utils/customError"
import { paginate } from "../utils/paginator"
import type { Create<Resource>Input, Update<Resource>Input } from "../schemas/<resource>.schema"

export const <resource>Service = {
  async create(data: Create<Resource>Input) {
    return prisma.<resource>.create({ data })
  },

  async findById(id: string) {
    const item = await prisma.<resource>.findUnique({ where: { id } })
    if (!item) throw new CustomError("Not found", 404)
    return item
  },

  async list({ cursor, take, ...filters }: ListQuery) {
    return paginate({ model: prisma.<resource>, take, cursor, where: filters, orderBy: [{ createdAt: "desc" }, { id: "desc" }] })
  },

  async update(id: string, data: Update<Resource>Input) {
    return prisma.<resource>.update({ where: { id }, data })
  },

  async remove(id: string) {
    return prisma.<resource>.delete({ where: { id } })
  },
}
```

### Controller (`controllers/<resource>.controller.ts`)

```ts
import { asyncHandler } from "../utils/asyncHandler"
import { responseHandler } from "../utils/responseHandler"
import { <resource>Service } from "../services/<resource>.service"
import { revalidate } from "../services/revalidate.service"

export const <resource>Controller = {
  create: asyncHandler(async (req, res) => {
    const item = await <resource>Service.create(req.body)
    await revalidate(["<resource>-list"])
    responseHandler(res, 201, "Created", item)
  }),
  // ... list, getById, update, remove
}
```

### Route (`routes/<resource>.routes.ts`)

```ts
import { Router } from "express"
import { <resource>Controller } from "../controllers/<resource>.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { permissionsGuard } from "../guards/permissions.guard"
import { validate } from "../utils/validate"
import { create<Resource>Schema, update<Resource>Schema, <resource>ListQuerySchema } from "../schemas/<resource>.schema"

const router = Router()

router.get("/", validate(<resource>ListQuerySchema, "query"), <resource>Controller.list)
router.get("/:id", <resource>Controller.getById)

router.post(
  "/",
  authMiddleware,
  permissionsGuard({ resource: "<resource>", action: "create" }),
  validate(create<Resource>Schema),
  <resource>Controller.create,
)

router.patch(
  "/:id",
  authMiddleware,
  permissionsGuard({ resource: "<resource>", action: "update" }),
  validate(update<Resource>Schema),
  <resource>Controller.update,
)

router.delete(
  "/:id",
  authMiddleware,
  permissionsGuard({ resource: "<resource>", action: "delete" }),
  <resource>Controller.remove,
)

export default router
```

Register in `apps/api/src/index.ts`:
```ts
import <resource>Routes from "./routes/<resource>.routes"
app.use("/api/v1/<resource>", <resource>Routes)
```

## RBAC permissions to seed

Add to `apps/api/src/config/permissions.ts` seed:
```ts
{ resource: "<resource>", action: "create" },
{ resource: "<resource>", action: "read" },
{ resource: "<resource>", action: "update" },
{ resource: "<resource>", action: "delete" },
// optionally: publish
```

## Verification

- `npx prisma migrate dev` if Prisma model changed
- Curl test the endpoints
- Typecheck: `cd apps/api && pnpm typecheck`
