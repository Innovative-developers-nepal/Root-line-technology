# Rootline Technology

Unified monorepo for **Rootline Technology Private Limited** — company portfolio site + admin CMS.


```
rootline/
├── apps/
│   ├── api/              Express 5 + Prisma 7 + SQLite (port 5000)
│   ├── user/             Next 15 marketing site (port 3000)
│   └── admin/            Next 15 CMS dashboard (port 3001)
├── packages/
│   ├── ui/               Shadcn + cva primitives, blocks, data, forms, editor
│   ├── config-tailwind/  Tailwind CSS v4 preset with brand tokens
│   ├── validators/       Zod schemas shared between api + frontend
│   ├── api-client/       Typed fetch wrapper for backend API
│   ├── auth-client/      Better-Auth client helpers
│   ├── utils/            Shared utilities
│   ├── hooks/            Shared React hooks
│   ├── seo/              Metadata builder + JSON-LD helpers
│   ├── analytics/        PostHog wrapper
│   └── storage/          File upload abstraction
├── db/
│   ├── dev.db            SQLite database (local dev)
│   └── migrations/       Prisma migration files
├── tooling/
│   └── typescript/       Shared TS config presets
└── .claude/              Agentic workflow (plans + agents + skills + docs)
```

**Single install, single deploy-orchestration:** `pnpm install` at root.

## Setup

```bash
pnpm install                           # install all dependencies
pnpm db:generate                       # generate Prisma client
pnpm db:migrate                        # apply migrations
pnpm db:seed -- --demo                 # seed demo data
pnpm dev                               # turbo: all 3 apps in parallel

# or individually
pnpm dev:api                           # http://localhost:5000
pnpm dev:user                          # http://localhost:3000
pnpm dev:admin                         # http://localhost:3001
```

## Stack

- **Backend:** Express 5, Prisma 7, SQLite (via Turso/libSQL), Better-Auth
- **Frontend:** Next 15 App Router, React 19, TS strict, Tailwind v4, Shadcn UI, Tiptap, GSAP, PostHog
- **Brand:** leaf-green `#2D5A3D` + root-brown `#6B4423`, Instrument Serif + Inter, 6px radius

## Workflow

`.claude/` houses agents + commands + skills + docs. Use:
- `/plan <feature>` — architect plans
- `/implement <plan>` — implementer executes
- `/component <name>` `/page <route>` `/crud <model>` `/endpoint <name>` `/seo-check <route>`

See `.claude/CLAUDE.md` + `.claude/docs/` for full conventions.
