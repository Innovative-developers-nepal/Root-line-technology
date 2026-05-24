import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Skeleton } from "../components/skeleton";

const gridStyles = cva("grid gap-6", {
  variants: {
    cols: {
      "1": "grid-cols-1",
      "2": "md:grid-cols-2",
      "3": "md:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: { cols: "2" },
});

export interface CardListSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridStyles> {
  count?: number;
  itemClassName?: string;
}

export function CardListSkeleton({
  cols,
  count = 4,
  className,
  itemClassName,
  ...props
}: CardListSkeletonProps) {
  return (
    <div className={cn(gridStyles({ cols }), className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("flex flex-col gap-3 rounded-md border border-border bg-card p-6", itemClassName)}
        >
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-2 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}
