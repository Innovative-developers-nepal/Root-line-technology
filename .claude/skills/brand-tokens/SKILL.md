---
name: brand-tokens
description: Enforce Rootline brand design tokens. Audits files for raw hex colors, inline px radii, hardcoded font names, or magic spacing that bypass the CSS variable system. Auto-fixes where unambiguous. Trigger when user says "audit tokens", "check brand compliance", or commits to a UI file in this repo.
---

# Brand Tokens Skill

## When to trigger

- User explicitly: "audit brand tokens", "check tokens", "fix raw hex"
- Auto-trigger when editing files matching `apps/**/*.tsx`, `packages/ui/**/*.tsx`, `packages/ui/**/*.css`

## What to enforce

Source of truth: `packages/config-tailwind/preset.ts` + `packages/ui/src/styles/globals.css`.

### Banned

- Raw hex colors: `#xxxxxx` outside `globals.css` or `preset.ts`
- `rgb(...)` / `rgba(...)` literals outside token files
- Inline radius: `rounded-[Xpx]`, `border-radius: Xpx` — use `rounded-sm/md/lg` mapped to `--radius`
- Inline font-family declarations — use `font-display` / `font-sans` utilities
- Magic spacing: any literal `gap-[Xpx]`, `p-[Xpx]` if a token (`gap-4`, `p-6`, …) covers it
- Inline `style={{ color: '...' }}` for brand colors

### Allowed

- Tailwind utility classes mapping to vars (`bg-primary`, `text-foreground`, `border-border`)
- `cn()` composition
- cva variants
- Brand-token CSS vars (`hsl(var(--primary))`)

## Audit procedure

1. Glob target files.
2. Grep for banned patterns:
   - `#[0-9a-fA-F]{3,8}\b` excluding `globals.css` + `preset.ts`
   - `rounded-\[`
   - `rgba?\(`
   - `style=\{\{[^}]*color:`
3. Report each finding: `path:line: <problem> → <suggested replacement>`
4. If auto-fix safe (unambiguous mapping): offer Edit; otherwise leave to user.

## Common replacements

| Found | Replace with |
|---|---|
| `text-[#2D5A3D]` | `text-primary` |
| `bg-[#6B4423]` | `bg-accent` |
| `rounded-[6px]` | `rounded-md` |
| `rounded-[4px]` | `rounded-sm` |
| `font-family: 'Inter'` | `font-sans` (Tailwind utility) |
| `font-family: 'Instrument Serif'` | `font-display` |
