"use client";
import { motion } from "framer-motion";
import { Container } from "@rootline/ui/components";
import { cn } from "@rootline/ui/lib/cn";
import { useTheme } from "next-themes";
import { useMounted } from "@rootline/hooks";
import dynamic from "next/dynamic";

const NeuralNetwork = dynamic(() => import("@/components/neural-network").then((m) => ({ default: m.NeuralNetwork })), {
  ssr: false,
});

export function LandingHero() {
  const { theme } = useTheme();
  const mounted = useMounted();
  const isDark = !mounted || theme === "dark";

  return (
    <section className="relative isolate md:min-h-screen overflow-hidden bg-background">
      {/* Gradient base — soil to canopy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            isDark
              ? "radial-gradient(ellipse at top, hsl(var(--color-primary) / 0.08), transparent 60%), radial-gradient(ellipse at bottom, hsl(var(--color-accent) / 0.05), transparent 50%)"
              : "radial-gradient(ellipse at top, hsl(var(--color-primary) / 0.04), transparent 60%)",
        }}
      />

      {/* Neural network background */}
      <NeuralNetwork />

      {/* Vignette — edge darkness */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            isDark
              ? "radial-gradient(ellipse at center, transparent 50%, hsl(20 14% 8% / 0.4) 100%)"
              : "radial-gradient(ellipse at center, transparent 55%, hsl(0 0% 100% / 0.3) 100%)",
        }}
      />

      <Container className="relative flex min-h-dvh flex-col items-center justify-center">
        <div className="flex flex-col items-center py-28 text-center md:py-32 lg:py-40">

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "max-w-5xl font-display text-5xl leading-[1.02] tracking-tight md:text-7xl lg:text-[6rem]",
              isDark ? "text-white" : "text-foreground",
            )}
          >
            <span className="font-[425]">Roots that hold.</span>
            <br />
            <motion.span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, hsl(var(--color-primary)), hsl(var(--color-primary) / 0.6), hsl(var(--color-accent)))",
                backgroundSize: "200% 100%",
                backgroundPosition: "0% 50%",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              Branches that scale.
            </motion.span>
          </motion.h1>

          {/* Decorative rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 h-px w-24 origin-center"
            style={{
              background: "linear-gradient(to right, transparent, hsl(var(--color-primary) / 0.5), transparent)",
            }}
          />

          {/* Principle line */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mt-5 font-display text-lg italic leading-snug tracking-tight md:text-xl",
              isDark ? "text-white/60" : "text-muted-foreground",
            )}
          >
            &ldquo;Security is not a feature. It is the soil.&rdquo;
          </motion.p>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mt-5 max-w-2xl text-base leading-[1.65] md:text-lg",
              isDark ? "text-white/50" : "text-muted-foreground",
            )}
          >
            Resilient digital systems engineered for security, scale, and operational longevity.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
