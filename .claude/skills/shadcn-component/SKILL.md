---
name: shadcn-component
description: Scaffold a Shadcn-based component in packages/ui with cva variants, cn(), brand tokens, and strict TS. Always emits cva block even for single-variant components. Trigger when user says "add component", "scaffold X component", "new Shadcn primitive", or when /component runs.
---

# Shadcn Component Skill

## When to trigger

- `/component` command
- "scaffold a <Name> component"
- "add Shadcn <name>"
- "create a new primitive"

## Procedure

1. **Check registry:** if it's a Shadcn registry component (button, input, dialog, …):
   ```bash
   cd packages/ui && npx shadcn@latest add <name>
   ```
2. **Wrap in cva** — even if the original install doesn't. Pattern below.
3. **Move to `packages/ui/src/components/<name>.tsx`** (Shadcn defaults to `components/ui/` — relocate).
4. **Update imports** to use `@rootline/ui/lib/cn`.
5. **Export** from `packages/ui/src/components/index.ts`.
6. **Typecheck**: `pnpm -F @rootline/ui typecheck`.

## Standard template

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@rootline/ui/lib/cn"

const <name>Styles = cva(
  // base classes (no colors yet — use tokens)
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-background hover:bg-muted",
        ghost: "hover:bg-muted hover:text-foreground",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
)

export interface <Name>Props
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof <name>Styles> {
  asChild?: boolean
}

export const <Name> = React.forwardRef<HTMLElement, <Name>Props>(
  ({ className, variant, size, ...props }, ref) => (
    <element ref={ref} className={cn(<name>Styles({ variant, size }), className)} {...props} />
  ),
)
<Name>.displayName = "<Name>"
```

## Rules

- Use forwardRef when component wraps a native element
- Use Radix primitive if applicable (DropdownMenu, Dialog, etc.) — wrap, don't reinvent
- Never inline brand colors — only `bg-primary`, `text-foreground`, etc.
- Default radius via `rounded-md` (maps to `--radius`)
- Export type `<Name>Props` alongside component
- Single default export discouraged — use named export

## Anti-patterns

- ❌ Raw `<input>` outside `packages/ui/forms/`
- ❌ Hex colors anywhere
- ❌ Hardcoded `px` radii
- ❌ Skipping cva "because there's only one variant"
- ❌ Forgetting to update `index.ts` barrel
