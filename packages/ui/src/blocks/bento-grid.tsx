import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const bentoStyles = cva("grid auto-rows-[minmax(160px,auto)]", {
  variants: {
    cols: {
      "2": "md:grid-cols-2",
      "3": "md:grid-cols-3",
      "4": "md:grid-cols-4",
    },
    gap: {
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: { cols: "3", gap: "md" },
});

export interface BentoGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoStyles> {}

export function BentoGrid({ cols, gap, className, ...props }: BentoGridProps) {
  return <div className={cn(bentoStyles({ cols, gap }), className)} {...props} />;
}

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: "1" | "2" | "3";
  rowSpan?: "1" | "2";
}

export function BentoCard({ span = "1", rowSpan = "1", className, ...props }: BentoCardProps) {
  const colSpanMap = { "1": "", "2": "md:col-span-2", "3": "md:col-span-3" };
  const rowSpanMap = { "1": "", "2": "md:row-span-2" };
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-md border border-border bg-card p-6 transition-all",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm",
        colSpanMap[span],
        rowSpanMap[rowSpan],
        className,
      )}
      {...props}
    />
  );
}
