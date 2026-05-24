import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const gridStyles = cva("grid gap-8", {
  variants: {
    cols: {
      "2": "md:grid-cols-2",
      "3": "md:grid-cols-2 lg:grid-cols-3",
      "4": "md:grid-cols-2 lg:grid-cols-4",
    },
    bordered: {
      true:  "divide-y divide-border md:divide-y-0 md:divide-x",
      false: "",
    },
  },
  defaultVariants: { cols: "3", bordered: false },
});

export interface Feature {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}

export interface FeatureGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridStyles> {
  features: Feature[];
}

export function FeatureGrid({ features, cols, bordered, className, ...props }: FeatureGridProps) {
  return (
    <div className={cn(gridStyles({ cols, bordered }), className)} {...props}>
      {features.map((f, i) => (
        <div key={i} className={cn("flex flex-col gap-3", bordered && "px-6 first:pl-0 last:pr-0")}>
          {f.icon && <div className="text-primary">{f.icon}</div>}
          <h3 className="font-display text-xl tracking-tight">{f.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
        </div>
      ))}
    </div>
  );
}
