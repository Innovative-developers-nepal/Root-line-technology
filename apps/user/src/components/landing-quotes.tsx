"use client";
import { useEffect, useRef } from "react";
import { Container } from "@rootline/ui/components";
import { usePrefersReducedMotion } from "@rootline/ui/motion";

const QUOTES = [
  {
    n: "01",
    text: "Security is not a feature. It is the soil.",
    author: "Rootline principle",
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    n: "02",
    text: "Ship slow. Ship right. Roots take time.",
    author: "Rootline principle",
    accent: "from-sky-500/15 to-sky-500/0",
  },
  {
    n: "03",
    text: "Every line of code is a vow to the people who run it at 3am.",
    author: "Rootline principle",
    accent: "from-violet-500/15 to-violet-500/0",
  },
  {
    n: "04",
    text: "Premium is not polish. It is restraint.",
    author: "Rootline principle",
    accent: "from-amber-500/15 to-amber-500/0",
  },
];

export function LandingQuotes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduced) return;

    const cleanups: Array<() => void> = [];

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const items = el.querySelectorAll<HTMLElement>("[data-quote]");

      items.forEach((item) => {
        const lines = item.querySelectorAll<HTMLElement>("[data-line]");
        const tween = gsap.fromTo(
          lines,
          { opacity: 0.12, y: 30, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              end: "top 30%",
              scrub: 0.8,
            },
          },
        );
        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      });

    })();

    return () => cleanups.forEach((c) => c());
  }, [reduced]);

  return (
    <section className="relative w-full overflow-hidden py-32 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(0,0,0,0.04),transparent_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]"
      />
      <Container>
      <div ref={containerRef} className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-28 md:gap-36">
            {QUOTES.map((q) => (
              <figure
                key={q.n}
                data-quote
                className="group relative grid gap-6 md:grid-cols-[auto_1fr] md:gap-10"
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -left-6 -top-12 -z-10 font-display text-[10rem] leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b ${q.accent} select-none md:text-[14rem]`}
                >
                  {q.n}
                </span>

                <div
                  data-line
                  className="flex items-start gap-3 md:flex-col md:items-end md:gap-2 md:pr-2"
                >
                  <span className="font-mono text-xs font-medium tracking-[0.18em] text-primary">
                    {q.n}
                  </span>
                  <span
                    aria-hidden
                    className="mt-1.5 hidden h-px w-10 bg-linear-to-r from-primary/60 to-primary/0 md:block"
                  />
                </div>

                <div className="flex flex-col gap-5">
                  <blockquote
                    data-line
                    className="font-display text-3xl leading-[1.12] tracking-tight md:text-5xl"
                  >
                    &ldquo;{q.text}&rdquo;
                  </blockquote>
                  <figcaption
                    data-line
                    className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
                  >
                    — {q.author}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
