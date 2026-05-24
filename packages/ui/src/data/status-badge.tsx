import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const statusStyles = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        new:       "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        active:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        pending:   "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        review:    "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
        interview: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
        rejected:  "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        hired:     "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        resolved:  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        spam:      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        published: "bg-primary/10 text-primary",
        draft:     "bg-muted text-muted-foreground",
        closed:    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
      },
    },
    defaultVariants: { status: "new" },
  },
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusStyles> {
  label?: React.ReactNode;
}

export function StatusBadge({ status, label, className, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusStyles({ status }), className)} {...props}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label ?? children ?? status}
    </span>
  );
}
