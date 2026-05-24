---
description: Scaffold a Shadcn-based component in packages/ui with cva variants + brand tokens.
argument-hint: <ComponentName> [variants...]
---

Spawn `ui-builder` agent with `subagent_type: ui-builder`.

Task: scaffold component **$ARGUMENTS** in `packages/ui/src/components/`.

Requirements:
- Install via Shadcn CLI if it's a registry component
- Wrap with `cva()` even if only one variant
- Use `cn()` from `@rootline/ui/lib/cn`
- Brand tokens only — no raw hex / inline radii
- Export from `packages/ui/src/components/index.ts`
- TS strict

After scaffold: type-check + show usage example.
