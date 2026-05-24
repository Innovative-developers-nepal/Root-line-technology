import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const sectionStyles = cva("w-full", {
  variants: {
    spacing: {
      none: "",
      sm:   "py-12",
      md:   "py-16 md:py-20",
      lg:   "py-24 md:py-32",
      xl:   "py-32 md:py-40",
    },
    tone: {
      default:   "",
      muted:     "bg-muted/40",
      contrast:  "bg-foreground text-background",
      primary:   "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: { spacing: "lg", tone: "default" },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionStyles> {}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, tone, ...props }, ref) => (
    <section ref={ref} className={cn(sectionStyles({ spacing, tone }), className)} {...props} />
  ),
);
Section.displayName = "Section";
