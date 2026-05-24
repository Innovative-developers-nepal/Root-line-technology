# Design Tokens — Rootline

Source of truth: `packages/config-tailwind/preset.ts` + `packages/ui/src/styles/globals.css`.

**Never** use raw values in components. Always reference tokens.

## Colors (HSL, defined as CSS variables)

### Light theme
| Token | Value (HSL) | Hex equivalent | Use |
|---|---|---|---|
| `--background` | `0 0% 100%` | #FFFFFF | page bg |
| `--foreground` | `20 14% 12%` | #221E1A | body text |
| `--primary` | `145 35% 26%` | #2D5A3D | brand green (leaf) |
| `--primary-foreground` | `60 30% 96%` | #F7F6EE | text on primary |
| `--accent` | `27 51% 28%` | #6B4423 | brand brown (root) |
| `--accent-foreground` | `60 30% 96%` | — | text on accent |
| `--muted` | `30 8% 95%` | #F2F0EE | subtle backgrounds |
| `--muted-foreground` | `30 8% 40%` | #6B665F | secondary text |
| `--border` | `30 10% 88%` | #E2DED8 | borders |
| `--input` | `30 10% 88%` | — | form input border |
| `--ring` | `145 35% 26%` | — | focus ring |
| `--destructive` | `0 70% 45%` | #C0211E | destructive actions |
| `--destructive-foreground` | `0 0% 100%` | — | |
| `--card` | `0 0% 100%` | — | card bg |
| `--card-foreground` | `20 14% 12%` | — | |
| `--popover` | `0 0% 100%` | — | popover bg |
| `--popover-foreground` | `20 14% 12%` | — | |

### Dark theme
| Token | Value (HSL) |
|---|---|
| `--background` | `20 14% 8%` (warm near-black) |
| `--foreground` | `60 20% 94%` |
| `--primary` | `145 40% 55%` (lighter forest) |
| `--primary-foreground` | `145 50% 8%` |
| `--accent` | `27 45% 55%` (lighter bark) |
| `--accent-foreground` | `27 50% 8%` |
| `--muted` | `20 10% 16%` |
| `--muted-foreground` | `30 8% 65%` |
| `--border` | `20 10% 20%` |
| `--input` | `20 10% 20%` |
| `--ring` | `145 40% 55%` |
| `--card` | `20 14% 10%` |
| `--popover` | `20 14% 10%` |

## Typography

| Token | Font | Use |
|---|---|---|
| `font-display` | Instrument Serif (via next/font) | hero headings, page titles, blockquotes |
| `font-sans` | Inter Variable (via next/font) | body, UI text |

```tsx
// apps/*/app/layout.tsx
import { Instrument_Serif, Inter } from "next/font/google"

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display" })
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" })

// <html className={`${display.variable} ${sans.variable}`}>
```

Tailwind:
```ts
fontFamily: {
  display: ["var(--font-display)", "serif"],
  sans: ["var(--font-sans)", "system-ui", "sans-serif"],
}
```

### Type scale (suggested)

| Class | Size | Use |
|---|---|---|
| `text-xs` | 0.75rem | small labels |
| `text-sm` | 0.875rem | secondary body, buttons |
| `text-base` | 1rem | body |
| `text-lg` | 1.125rem | lead paragraphs |
| `text-xl` | 1.25rem | small headings |
| `text-2xl` | 1.5rem | H4 |
| `text-3xl` | 1.875rem | H3 |
| `text-4xl` | 2.25rem | H2 |
| `text-5xl` | 3rem | H1 |
| `text-6xl` | 3.75rem | hero |
| `text-7xl` | 4.5rem | hero, display |

Headings use `font-display` + `tracking-tight`. Body uses `font-sans` + `leading-relaxed`.

## Radius

`--radius: 0.375rem` (6px). Maps to Tailwind:
- `rounded-sm` → `calc(var(--radius) - 2px)` = 4px
- `rounded-md` → `var(--radius)` = 6px ← default for buttons/inputs/cards
- `rounded-lg` → `calc(var(--radius) + 2px)` = 8px
- `rounded-xl` → `calc(var(--radius) + 4px)` = 10px
- `rounded-full` → only badges/avatars

## Spacing

Use Tailwind scale. Section padding:
- Mobile: `py-16` (64px)
- md+: `py-24` (96px) to `py-32` (128px) for hero/marketing

Container: `max-w-6xl mx-auto px-6 lg:px-8`.

## Shadows

| Class | Use |
|---|---|
| `shadow-sm` | cards, dropdowns |
| `shadow` | popovers, hover states |
| `shadow-md` | dialogs, modals |
| (avoid `shadow-lg`+ unless purposeful — premium feel = restrained shadows) |

## Motion

- Standard duration: `duration-200` (200ms)
- Easing: `ease-out` for entrances, `ease-in-out` for state changes
- Hover effects: `transition-colors` or `transition-transform`
- Page-level motion via GSAP, micro via Framer Motion
- Always guard with `usePrefersReducedMotion()`

## Z-index scale

| Layer | z |
|---|---|
| dropdown | 20 |
| sticky header | 30 |
| sheet | 40 |
| dialog backdrop | 50 |
| dialog | 51 |
| toast | 60 |
| popover | 70 |
