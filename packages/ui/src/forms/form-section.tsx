import * as React from "react";
import { cn } from "../lib/cn";

export interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function FormSection({
  title,
  description,
  className,
  children,
  ...props
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "grid gap-6 border-b border-border pb-8 last:border-b-0 last:pb-0 md:grid-cols-[1fr_2fr]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">
        {title && <h3 className="font-display text-lg tracking-tight">{title}</h3>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
