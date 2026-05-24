import * as React from "react";
import { cn } from "../lib/cn";
import { Container } from "../components/container";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  links: NavLink[];
  actions?: React.ReactNode;
}

export function Nav({ brand, links, actions, className, ...props }: NavProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur",
        className,
      )}
      {...props}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-8">
          <div className="flex items-center gap-3">{brand}</div>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">{actions}</div>
        </div>
      </Container>
    </header>
  );
}
