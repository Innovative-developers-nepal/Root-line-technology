import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const wrapperStyles = cva("flex flex-col gap-3", {
  variants: {
    align: {
      left:   "items-start text-left",
      center: "items-center text-center",
    },
  },
  defaultVariants: { align: "left" },
});

const titleStyles = cva("font-display tracking-tight", {
  variants: {
    size: {
      sm: "text-3xl",
      md: "text-4xl md:text-5xl",
      lg: "text-5xl md:text-6xl",
    },
  },
  defaultVariants: { size: "md" },
});

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof wrapperStyles>,
    VariantProps<typeof titleStyles> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align,
  size,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn(wrapperStyles({ align }), className)} {...props}>
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className={titleStyles({ size })}>{title}</h2>
      {description && (
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
