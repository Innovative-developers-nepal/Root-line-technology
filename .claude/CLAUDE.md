# Rootline Technology — Project Memory

Single monorepo for **Rootline Technology Private Limited** — company portfolio + admin CMS.

## Layout

**Single workspace at root level.**

```
rootline/                              ← workspace root
├── apps/
│   ├── api/                           Express 5 + Prisma 7 + SQLite (port 5000)
│   ├── user/                          Next 15 marketing site (port 3000) — @rootline/user
│   └── admin/                         Next 15 CMS dashboard (port 3001) — @rootline/admin
├── packages/                          Shared @rootline/* packages
│   ├── ui/                            Shadcn + cva primitives, blocks, data, forms, editor
│   ├── validators/                    Zod schemas shared across api + frontends
│   ├── utils/ hooks/ api-client/ auth-client/ storage/ seo/ analytics/
│   └── config-tailwind/
├── tooling/
│   └── typescript/                    Shared tsconfig presets
├── db/
│   ├── dev.db                         SQLite database file
│   └── migrations/                    Prisma migrations
├── pnpm-workspace.yaml               Single workspace for everything
├── package.json
└── turbo.json
```

**Single install:** `pnpm install` at root. Cross-boundary sharing via workspace packages (`@rootline/validators` at `packages/validators/`).

## Brand

- Company: Rootline Technology Pvt Ltd
- Identity: leaf + root — green primary `#2D5A3D`, brown accent `#6B4423`
- Premium feel, low border-radius (6px), generous whitespace, soft shadows
- Typography: Instrument Serif (display) + Inter (body)
- Dark + light modes via `next-themes`

## Stack (locked)

- pnpm + Turborepo
- Next.js 15 (App Router) + React 19 + TS strict
- Tailwind CSS v4 + Shadcn UI + Radix
- Server: Express 5 + Prisma 7 + SQLite (at `./apps/api/`)
- Auth: **Better-Auth** (replaces server's JWT)
- RBAC: 6-level (`SUPER_ADMIN/ADMIN/BUSINESS_OWNER/MANAGER/ANALYST/MEMBER`) via existing Role+Permission tables
- Rich text: Tiptap (JSON in DB)
- Motion: GSAP+ScrollTrigger (landing+services), Framer Motion (micro)
- Analytics: PostHog
- Forms: react-hook-form + zod
- OG: `@vercel/og` (next/og)
- Sitemap: dynamic from DB

## Rules (project-wide)

1. **TS strict.** No `any`. No `@ts-ignore`. Use `unknown` + narrowing.
2. **DRY via cva.** Every UI primitive declared with `class-variance-authority`. New design = add variant, not new component.
3. **`cn()` everywhere.** Conditional classes via `clsx` + `tailwind-merge`. Never string-concat.
4. **No raw `<input>` outside `packages/ui/forms/`.** Use `<FormField>` (rhf+zod).
5. **All metadata** via `@rootline/seo`. Never inline `<Head>` tags.
6. **All file uploads** via `@rootline/storage`. Never fetch `/upload` directly.
7. **All auth-gated routes** check via `@rootline/auth-client` `requireRole()` / `can()`.
8. **All admin tables** use `<DataTable variant="...">` — never custom-table-from-scratch.
9. **Marketing pages compose from `@rootline/ui/blocks/*`.** No hand-coded `<section>` markup.
10. **No raw hex colors / px radii.** Use CSS variables from `@rootline/config-tailwind`.
11. **Server actions preferred** over route handlers, except for `/api/og`, `/api/revalidate`.
12. **Frontend never imports Prisma.** All data via `@rootline/api-client`.
13. **Validators shared.** Backend zod schemas re-exported from `@rootline/validators`.
14. **Cursor pagination** on lists. Offset only for admin if explicitly justified.
15. **Respect `prefers-reduced-motion`.** Motion always guarded.

## Workflow

- **Opus**: planning + clarifying questions + ADRs. Writes plans to `.claude/plans/`. No code.
- **Sonnet**: feature implementation. Reads plan, executes. Defers ambiguities back to Opus.
- **Haiku**: repetitive UI scaffolds, Shadcn component installs, page layouts.

Ask before assuming. Caveman mode often active — code/commits/security still normal English.

## Pointers

- Design tokens: [.claude/docs/design-tokens.md](./docs/design-tokens.md)
- Conventions: [.claude/docs/conventions.md](./docs/conventions.md)
- SEO checklist: [.claude/docs/seo-checklist.md](./docs/seo-checklist.md)
- RBAC matrix: [.claude/docs/rbac-matrix.md](./docs/rbac-matrix.md)
- Architecture overview: [.claude/docs/architecture.md](./docs/architecture.md)
- Full project plan: `C:\Users\ACER\.claude\plans\full-starry-wigderson.md`
