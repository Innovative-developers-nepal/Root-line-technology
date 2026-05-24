import * as React from "react";
import { cn } from "../lib/cn";
import { Container } from "../components/container";

export interface CTAProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function CTA({ title, description, actions, className, ...props }: CTAProps) {
  return (
    <section className={cn("w-full py-24", className)} {...props}>
      <Container>
        <div className="rounded-md border border-border bg-card p-10 md:p-16">
          <div className="grid items-center gap-8 md:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight">{title}</h2>
              {description && (
                <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-4 md:justify-end">{actions}</div>}
          </div>
        </div>
      </Container>
    </section>
  );
}
