---
name: motion-recipe
description: Add a GSAP ScrollTrigger or Framer Motion animation with prefers-reduced-motion guard. Pulls from a small library of vetted Rootline motion recipes (fade-up, stagger-text, parallax, scroll-pin). Trigger when user wants new motion on a marketing section.
---

# Motion Recipe Skill

## When to trigger

- "animate this section"
- "add scroll reveal"
- "make the hero text split"

## Hard rule

**Every motion must check `usePrefersReducedMotion()` from `@rootline/hooks` and skip animations when true.**

```tsx
import { usePrefersReducedMotion } from "@rootline/hooks"

const reduced = usePrefersReducedMotion()
if (reduced) return // no animation
```

## Recipes

### 1. Fade-up on scroll (GSAP)

```tsx
"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePrefersReducedMotion } from "@rootline/hooks"

gsap.registerPlugin(ScrollTrigger)

export function FadeUpOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current!.children, {
        y: 32, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [reduced])

  return <div ref={ref}>{children}</div>
}
```

### 2. Hero text split (GSAP SplitText alternative — manual split)

Split words/chars manually, animate each with stagger. Avoid SplitText (paid plugin).

### 3. Page transitions (Framer Motion)

Use `AnimatePresence` + `motion.div` with `initial/animate/exit`. Keep durations short (<0.3s).

### 4. Hover micro (Framer Motion)

`whileHover={{ y: -2 }}` on cards, button lifts.

## Where to put motion components

- Reusable wrappers → `packages/ui/src/motion/*`
- Page-specific → `apps/user/app/<route>/_components/*`

## Performance

- Prefer CSS transitions for hover effects
- GSAP only for scroll-driven sequences
- Lazy-import GSAP (`const gsap = await import("gsap")`) on routes that need it, not in layout
- Wrap in `requestAnimationFrame` to avoid layout thrash

## Done definition

- Animation runs on first scroll into view
- `prefers-reduced-motion: reduce` disables animation (test with DevTools rendering tab)
- No CLS introduced
- Lighthouse Performance ≥ 90 still
