import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const inputStyles = cva(
  "flex w-full rounded-md border border-input bg-background text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-9 px-3 py-1",
        md: "h-10 px-3 py-2",
        lg: "h-11 px-4 py-2",
      },
      invalid: {
        true:  "border-destructive focus-visible:ring-destructive",
        false: "",
      },
    },
    defaultVariants: { size: "md", invalid: false },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputStyles> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, invalid, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(inputStyles({ size, invalid }), className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { inputStyles };
