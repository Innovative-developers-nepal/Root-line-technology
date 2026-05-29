"use client";
import { motion } from "framer-motion";
import { Container, Button } from "@rootline/ui/components";
import { Spotlight, SystemGraph } from "@rootline/ui/blocks";
import { usePrefersReducedMotion } from "@rootline/hooks";

export function LandingHero() {
  const reduced = usePrefersReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className="relative isolate -mt-32 flex min-h-svh flex-col justify-center overflow-hidden pt-24">
      <Spotlight position="top-left" hue="moss" />
      <Spotlight position="center" hue="soil" className="opacity-60" />

      <Container className="relative py-16 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-10">
          {/* Left — content */}
          <div className="flex flex-col items-start">
            <motion.h1
              {...rise(0.1)}
              className="mt-8 font-display text-6xl leading-[0.95] tracking-[-0.04em] text-foreground md:text-7xl lg:text-8xl"
            >
              Roots that hold.
              <br />
              <span className="text-foreground/55">Branches that scale.</span>
            </motion.h1>

            <motion.p
              {...rise(0.25)}
              className="mt-8 max-w-md text-base leading-relaxed text-foreground/80 md:text-lg"
            >
              Resilient digital systems engineered for security, scale, and
              operational longevity.
            </motion.p>

            <motion.div {...rise(0.4)} className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" size="lg">
                <a href="/work">Explore work</a>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href="/philosophy">Our philosophy</a>
              </Button>
            </motion.div>
          </div>

          {/* Right — single hero visual */}
          <motion.div
            {...rise(0.2)}
            className="relative hidden h-144 w-full items-center justify-center lg:flex xl:h-160"
          >
            <SystemGraph className="h-full w-full" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
