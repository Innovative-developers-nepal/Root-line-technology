import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const containerStyles = cva("mx-auto w-full px-6 sm:px-8 lg:px-12 xl:px-16", {
  variants: {
    size: {
      sm: "max-w-[48rem]",
      md: "max-w-[64rem]",
      lg: "max-w-[72rem]",
      xl: "max-w-[80rem]",
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
