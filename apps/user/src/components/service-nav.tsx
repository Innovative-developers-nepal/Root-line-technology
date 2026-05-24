"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@rootline/ui/lib/cn";

export function ServiceNav({ items }: { items: { slug: string; title: string }[] }) {
  const [active, setActive] = useState<string>(items[0]?.slug ?? "");

  useEffect(() => {
    const observers = items.map((it) => {
      const el = document.getElementById(it.slug);
      if (!el) return null;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setActive(it.slug);
          }
        },
        { rootMargin: "-40% 0px -50% 0px" },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [items]);

  return (
    <nav aria-label="Service sections" className="mt-8 flex flex-wrap gap-2">
      {items.map((s) => {
        const isActive = active === s.slug;
        return (
          <a
            key={s.slug}
            href={`#${s.slug}`}
            className={cn(
              "relative rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
              isActive && "border-primary/40 text-primary",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="service-nav-pill"
                className="absolute inset-0 -z-10 rounded-md bg-primary/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            {s.title}
          </a>
        );
      })}
    </nav>
  );
}
