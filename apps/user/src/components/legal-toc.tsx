"use client";

import { useEffect, useState } from "react";
import { cn } from "@rootline/ui/lib/cn";

export type TocSection = { id: string; title: string };

export function LegalTOC({ sections }: { sections: TocSection[] }) {
  const [activeId, setActiveId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground lg:hidden"
        aria-expanded={mobileOpen}
      >
        On this page
        <svg
          className={cn("size-4 transition-transform", mobileOpen && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {mobileOpen && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4 lg:hidden">
          <ul className="space-y-1">
            {sections.map(({ id, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={cn(
                    "block rounded px-3 py-1.5 text-sm transition-colors",
                    activeId === id
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Desktop sidebar */}
      <nav className="sticky top-32 hidden lg:block" aria-label="Table of contents">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          On this page
        </h3>
        <ul className="space-y-0.5">
          {sections.map(({ id, title }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn(
                  "block border-l-2 py-1.5 pl-3 text-sm leading-snug transition-colors",
                  activeId === id
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
