import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Container } from "../components/container";

const heroStyles = cva("relative w-full overflow-hidden", {
  variants: {
    spacing: {
      md: "py-20 md:py-28",
      lg: "py-28 md:py-36",
      xl: "py-36 md:py-44",
    },
    tone: {
      default: "bg-background",
      muted:   "bg-muted/30",
      dark:    "bg-foreground text-background",
    },
  },
  defaultVariants: { spacing: "lg", tone: "default" },
});

export interface HeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    VariantProps<typeof heroStyles> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  visual?: React.ReactNode;
}

export function Hero({
  eyebrow,
  title,
  description,
  actions,
  visual,
  spacing,
  tone,
  className,
  ...props
}: HeroProps) {
  return (
    <section className={cn(heroStyles({ spacing, tone }), className)} {...props}>
      <Container>
        <div className={cn("grid items-center gap-12", visual && "lg:grid-cols-[1.2fr_1fr]")}>
          <div className="flex flex-col gap-6">
            {eyebrow && (
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
              {title}
            </h1>
            {description && (
              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                {description}
              </p>
            )}
            {actions && <div className="mt-2 flex flex-wrap gap-4">{actions}</div>}
          </div>
          {visual && <div className="relative">{visual}</div>}
        </div>
      </Container>
    </section>
  );
}
