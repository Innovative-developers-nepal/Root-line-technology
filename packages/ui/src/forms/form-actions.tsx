import * as React from "react";
import { cn } from "../lib/cn";

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right" | "between";
}

export function FormActions({ align = "right", className, ...props }: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-t border-border pt-6",
        align === "right" && "justify-end",
        align === "left" && "justify-start",
        align === "between" && "justify-between",
        className,
      )}
      {...props}
    />
  );
}
