"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button, Container } from "@rootline/ui/components";
import { FadeUp } from "@rootline/ui/motion";

export function LandingCTA() {
  return (
    <section className="w-full py-24 md:py-32">
      <Container>
        <FadeUp>
          <div className="relative isolate overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-card via-card to-card shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(0,0,0,0.18)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_at_center,black_45%,transparent_75%)] dark:opacity-30 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-linear-to-r from-emerald-500/20 via-primary/25 to-violet-500/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-20 -z-10 h-[360px] w-[520px] rounded-full bg-linear-to-tr from-amber-400/15 via-rose-400/15 to-transparent blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent"
            />

            <div className="relative grid items-center gap-10 p-10 md:grid-cols-[1.6fr_1fr] md:p-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 text-primary" strokeWidth={2} aria-hidden />
                  Taking 2 new engagements this quarter
                </div>
                <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
                  Have an idea worth{" "}
                  <span className="relative inline-block">
                    <span className="bg-linear-to-br from-primary via-accent to-primary/70 bg-clip-text text-transparent">
                      rooting?
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-x-1 -bottom-1 h-[3px] rounded-full bg-linear-to-r from-primary/0 via-primary/60 to-primary/0"
                    />
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-[0.9375rem] leading-[1.65] text-muted-foreground">
                  Tell us about it. NDA-first call, fixed-scope proposal, response within one
                  business day.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button asChild size="xl" className="group/btn min-w-[180px] rounded-full px-6 shadow-sm">
                    <Link href="/contact">
                      Start a conversation
                      <ArrowRight
                        className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </Link>
                  </Button>
                  <Button asChild size="xl" variant="ghost" className="min-w-[180px] rounded-full px-6">
                    <Link href="/services">See services</Link>
                  </Button>
                </div>
              </div>

              <div className="hidden md:block">
                <ul className="grid gap-3 text-sm">
                  {[
                    ["NDA-first", "Signed before scope shared"],
                    ["Fixed scope", "No retainer creep"],
                    ["Human reply", "One business day"],
                  ].map(([k, v]) => (
                    <li
                      key={k}
                      className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3 backdrop-blur-sm transition-colors hover:border-foreground/15"
                    >
                      <span className="font-medium text-foreground">{k}</span>
                      <span className="text-xs text-muted-foreground">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
