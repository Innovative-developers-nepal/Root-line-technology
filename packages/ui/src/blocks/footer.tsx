import * as React from "react";
import { cn } from "../lib/cn";
import { Container } from "../components/container";

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  columns: FooterColumn[];
  legal?: React.ReactNode;
}

export function Footer({ brand, columns, legal, className, ...props }: FooterProps) {
  return (
    <footer
      className={cn("w-full border-t border-border bg-muted/30", className)}
      {...props}
    >
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1.5fr_2fr]">
          <div className="flex flex-col gap-4">{brand}</div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="text-sm text-foreground transition-colors hover:text-primary"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {legal && (
          <div className="flex flex-col items-start justify-between gap-4 border-t border-border py-6 text-xs text-muted-foreground md:flex-row md:items-center">
            {legal}
          </div>
        )}
      </Container>
    </footer>
  );
}
