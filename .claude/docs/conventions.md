# Code Conventions — Rootline

## TypeScript

- `strict: true` everywhere. No `any`, no `@ts-ignore`, no `@ts-nocheck`.
- Use `unknown` + narrowing or `as const` instead of `any`.
- Non-null assertion `!` requires comment justifying invariant.
- Prefer `type` over `interface` except for declaration merging.
- Discriminated unions for state.

## File naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `kebab-case.ts` or `camelCase.ts`
- Pages: Next App Router (`page.tsx`, `layout.tsx`, etc.)
- Tests: `*.test.ts(x)`

## Module layout

```
packages/<name>/
├── src/
│   ├── index.ts          # barrel — public API only
│   ├── lib/              # internal helpers
│   ├── components/ ...   # depends on package type
│   └── types.ts          # shared types
├── package.json
└── tsconfig.json         # extends @rootline/tsconfig/<preset>.json
```

Barrel exports only public symbols. Internal helpers stay non-barreled.

## React

- Server components by default. Mark client with `"use client"` only when needed (state, effects, browser APIs).
- Data fetching: server components fetch via `@rootline/api-client` server-fetch helper; client components use React Query hooks.
- No `useEffect` for derived state. Use computation in render.
- No `useState` for form state. Use `react-hook-form`.
- All forms = `<FormField>` from `packages/ui/forms` wrapping rhf+zod.

## Styling

- Tailwind only. No CSS modules, no styled-components, no emotion.
- `cn()` for conditional classes (clsx + tailwind-merge).
- `cva()` for variants — required on every component in `packages/ui`.
- Brand tokens only — no raw hex, no inline `px` radii. See `design-tokens.md`.

## Imports

Order (enforced by ESLint):
1. Node built-ins
2. External packages
3. `@rootline/*` workspace packages
4. Relative imports (`./`, `../`)
5. Type-only imports last (or inline with `type` keyword)

Use absolute paths from workspace root where possible.

## Error handling

### Frontend
- Throw typed errors from `@rootline/api-client`.
- Catch at boundary (error.tsx or React Query `onError`).
- User-facing message via Toast (`@rootline/ui`).

### Backend
- Throw `CustomError(message, statusCode)` from `apps/api/src/utils/customError.ts`.
- Caught by `global_error_handler` middleware.
- Never raw `res.status().json()`. Always `responseHandler`.

## Async

- Prefer `async/await` over `.then` chains.
- Top-level await in server entry points OK.
- Promise.all for parallel independent fetches.
- Wrap server handlers in `asyncHandler` for error propagation.

## Comments

- Default: no comments. Code + types should self-document.
- Only comment WHY when non-obvious (constraint, workaround, surprising invariant).
- Never describe WHAT the code does — naming should cover it.
- No PR/issue references in comments — they rot.

## Tests

- (To be defined when test stack chosen.)
- Critical paths: auth flow, RBAC guards, contact submit, application submit.

## Commits

- Conventional Commits format: `feat(scope): subject`, `fix(scope): subject`, etc.
- Scopes: `user`, `admin`, `api`, `ui`, `seo`, `auth`, `db`, `infra`.
- Body explains the WHY when it's non-obvious.

## Server routes

- `/api/health/*` — public
- `/api/v1/auth/*` — Better-Auth handler
- `/api/v1/<resource>` — REST endpoints, RBAC-gated where needed
- `/uploads/<filename>` — static, served by Express

## Frontend routes

### User (`apps/user`)
- `/` Landing
- `/about`
- `/services`
- `/careers`, `/careers/[slug]`
- `/contact`
- `/blog`, `/blog/[slug]`
- `/api/og/[type]` (dynamic OG)
- `/api/revalidate` (webhook)

### Admin (`apps/admin`)
- `/login`
- `/` (dashboard overview)
- `/services`, `/services/new`, `/services/[id]/edit`
- `/team`, `/team/new`, `/team/[id]/edit`
- `/careers/jobs`, `/careers/applicants`
- `/blog`, `/blog/new`, `/blog/[id]/edit`
- `/contacts`
- `/users` (SUPER_ADMIN only)

## Environment variables

| Var | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | api | SQLite connection (file:../db/dev.db) |
| `BETTER_AUTH_SECRET` | server | 32+ chars |
| `BETTER_AUTH_URL` | server, frontends | full origin |
| `CORS_ORIGIN` | server | comma-separated allowlist |
| `NEXT_PUBLIC_API_URL` | user, admin | `http://localhost:5000` dev |
| `NEXT_PUBLIC_SITE_URL` | user | canonical base |
| `NEXT_PUBLIC_POSTHOG_KEY` | user, admin | |
| `NEXT_PUBLIC_POSTHOG_HOST` | user, admin | |
| `REVALIDATE_SECRET` | api, user | shared HMAC secret |
| `GEO_LAT` / `GEO_LNG` | user | for LocalBusiness JSON-LD |
| `MAIL_HOST` / `MAIL_PORT` / `MAIL_USER` / `MAIL_PASS` / `MAIL_FROM` | api | nodemailer |

`.env.example` at monorepo root + `apps/*/.env.example` per app.
