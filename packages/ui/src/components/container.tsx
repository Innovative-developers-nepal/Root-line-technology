import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const containerStyles = cva("mx-auto w-full px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-none",
    },
  },
  defaultVariants: { size: "lg" },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerStyles> {
  as?: "div" | "section" | "article" | "header" | "footer" | "main" | "nav";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, as: As = "div", ...props }, ref) => (
    <As ref={ref as never} className={cn(containerStyles({ size }), className)} {...props} />
  ),
);
Container.displayName = "Container";
