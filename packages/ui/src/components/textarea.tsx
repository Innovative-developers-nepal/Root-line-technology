import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const textareaStyles = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "min-h-[80px]",
        md: "min-h-[120px]",
        lg: "min-h-[200px]",
      },
      invalid: {
        true:  "border-destructive focus-visible:ring-destructive",
        false: "",
      },
    },
    defaultVariants: { size: "md", invalid: false },
  },
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaStyles> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(textareaStyles({ size, invalid }), className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { textareaStyles };
