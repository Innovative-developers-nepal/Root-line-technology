"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { Button, Container, Dialog, DropdownMenu } from "@rootline/ui/components";
import { cn } from "@rootline/ui/lib/cn";
import { ThemeToggle } from "./theme-toggle";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const FALLBACK_SERVICE_LINKS: { label: string; href: string }[] = [
  { label: "Overview", href: "/services" },
  { label: "VAPT", href: "/services/vapt" },
  { label: "Mobile (Flutter)", href: "/services/mobile-flutter" },
  { label: "Web platforms", href: "/services/web-apps" },
];

function BrandMark() {
  return (
    <Link
      href="/"
      aria-label="Rootline Technology — home"
      className="group inline-flex shrink-0 items-center gap-2.5"
    >
      <span className="grid size-8 place-items-center rounded-md border border-primary/25 bg-primary/5 text-primary transition-colors duration-200 group-hover:border-primary/50 group-hover:bg-primary/10">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-18px">
          <path
            d="M12 5 6 18M12 5l6 9"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="12" cy="5" r="2.4" fill="currentColor" />
          <circle cx="6" cy="18" r="1.9" fill="currentColor" />
          <circle cx="18" cy="14" r="1.9" fill="currentColor" />
        </svg>
      </span>
      <span className="font-display text-xl leading-none tracking-[-0.02em] text-foreground">
        Rootline
      </span>
    </Link>
  );
}

export function SiteNav({ serviceLinks }: { serviceLinks?: { label: string; href: string }[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = useMemo((): NavLink[] => {
    const children = serviceLinks ?? FALLBACK_SERVICE_LINKS;
    return [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Solutions", href: "/services", children },
      { label: "Research", href: "/blog", children: [{ label: "Blog", href: "/blog" }] },
    ];
  }, [serviceLinks]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        "hover:border-border/5 hover:bg-background/8 hover:backdrop-blur-lg hover:backdrop-saturate-150",
        scrolled
          ? "backdrop-blur-lg backdrop-saturate-150 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          : "border-transparent bg-transparent",
      )}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
          "h-21",
          )}
        >
          <div className="flex flex-1 items-center">
            <BrandMark />
          </div>

          {/* Desktop nav — centered */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              if (link.children) {
                return (
                  <DropdownMenu.Root key={link.label}>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        )}
                      >
                        {link.label}
                        <ChevronDown className="mt-0.5 h-3.5 w-3.5" aria-hidden />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="z-50 min-w-180px origin-(--radix-dropdown-menu-content-transform-origin) rounded-xl border border-border/60 bg-background/80 p-1.5 shadow-lg backdrop-blur-xl `data-[state=open]:animate-[rl-dropdown-in_180ms_cubic-bezier(0.22,1,0.36,1)]"
                        sideOffset={8}
                      >
                        {link.children.map((child) => (
                          <DropdownMenu.Item asChild key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "block cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors outline-none",
                                pathname === child.href
                                  ? "bg-primary/10 font-medium text-primary"
                                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                              )}
                            >
                              {child.label}
                            </Link>
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              variant="dark"
              className="hidden rounded-full pl-3 pr-4 md:inline-flex"
            >
              <Link href="/contact">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                Contact
              </Link>
            </Button>

            {/* Mobile hamburger */}
            <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <Dialog.Trigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay
                  className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                  onClick={() => setMobileOpen(false)}
                />
                <Dialog.Content
                  className="fixed inset-x-4 top-20 z-50 rounded-2xl border border-border/60 bg-background/80 p-6 shadow-xl backdrop-blur-xl"
                >
                  <nav className="flex flex-col gap-0.5">
                    {navLinks.map((link) => {
                      const isActive =
                        pathname === link.href ||
                        (link.href !== "/" && pathname.startsWith(link.href));

                      if (link.children) {
                        return (
                          <div key={link.label} className="flex flex-col gap-0.5">
                            <span className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                              {link.label}
                            </span>
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                                  pathname === child.href
                                    ? "bg-primary/10 font-medium text-primary"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                )}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                    <div className="mt-3 border-t border-border/50 pt-3">
                      <Button asChild size="sm" className="w-full">
                        <Link href="/contact" onClick={() => setMobileOpen(false)}>
                          Contact
                        </Link>
                      </Button>
                    </div>
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </Container>
    </header>
  );
}
