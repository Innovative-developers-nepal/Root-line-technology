"use client";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Container } from "@rootline/ui/components";
import { Aurora, GridBackground, usePrefersReducedMotion } from "@rootline/ui/motion";
import { LandingLogos } from "./landing-logos";

const STACK = ["Next.js", "Flutter", "Postgres", "Stripe", "OWASP", "Vercel"];

export function LandingHero() {
  const reduced = usePrefersReducedMotion();
  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className="relative md:min-h-screen isolate overflow-hidden">
      <GridBackground />
      <Aurora intensity="subtle" />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-130 w-275 -translate-x-1/2 rounded-full bg-linear-to-r from-emerald-500/15 via-primary/20 to-violet-500/15 blur-3xl"
      />

      <Container className="relative">
        <div className="flex flex-col items-center py-28 text-center md:py-40 lg:py-48">

          <motion.h1
            {...reveal(0.1)}
            className="mt-7 max-w-5xl font-display text-5xl leading-[1.02] tracking-tight md:text-7xl lg:text-[5.5rem]"
          >
            Roots that hold.
            <br />
            <span className="relative inline-block">
              <span className="bg-linear-to-br from-primary via-accent to-primary/70 bg-clip-text text-transparent">
                Branches that scale.
              </span>
            </span>
          </motion.h1>

          <motion.p
            {...reveal(0.2)}
            className="mt-7 max-w-2xl text-base leading-[1.65] text-muted-foreground md:text-lg"
          >
            Engineering studio for secure web, mobile, and AI products. Manual-led VAPT, Flutter
            mobile, Next.js platforms — shipped under NDA.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
