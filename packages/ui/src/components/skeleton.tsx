import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const skeletonStyles = cva("animate-pulse rounded-md", {
  variants: {
    tone: {
      default: "bg-muted",
      strong:  "bg-muted-foreground/10",
    },
  },
  defaultVariants: { tone: "default" },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonStyles> {}

export function Skeleton({ className, tone, ...props }: SkeletonProps) {
  return <div className={cn(skeletonStyles({ tone }), className)} {...props} />;
}
