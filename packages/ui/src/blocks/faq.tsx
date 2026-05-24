"use client";
import * as React from "react";
import { cn } from "../lib/cn";

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export interface FAQProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FAQItem[];
}

export function FAQ({ items, className, ...props }: FAQProps) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className={cn("divide-y divide-border border-y border-border", className)} {...props}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="py-6">
            <button
              type="button"
              className="flex w-full items-start justify-between gap-6 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-display text-xl tracking-tight">{item.question}</span>
              <span
                aria-hidden
                className={cn(
                  "mt-1 inline-block text-2xl leading-none text-muted-foreground transition-transform",
                  isOpen && "rotate-45",
                )}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
