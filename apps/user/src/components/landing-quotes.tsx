"use client";
import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";
import { Container } from "@rootline/ui/components";
import { usePrefersReducedMotion } from "@rootline/ui/motion";

// NOTE: placeholder testimonials — swap for real client quotes before launch.
const TESTIMONIALS = [
  {
    quote:
      "Rootline's audit surfaced a token-handling flaw two other firms had signed off on. They don't check boxes — they think like attackers.",
    name: "Priya Nair",
    role: "VP Engineering",
    company: "Northwind Logistics",
    initials: "PN",
  },
  {
    quote:
      "We rebuilt payments on the architecture they designed and haven't had a single security incident in 18 months. That's the whole story.",
    name: "Daniel Osei",
    role: "CTO",
    company: "Lumen Health",
    initials: "DO",
  },
  {
    quote:
      "The most thorough VAPT engagement we've run. Clear reporting, real remediation guidance, zero fluff. Our board finally understood our risk.",
    name: "Sara Kim",
    role: "Head of Security",
    company: "Meridian Bank",
    initials: "SK",
  },
  {
    quote:
      "They treat our codebase like it's their own. It's rare to find a partner this invested in getting the hard parts right.",
    name: "Marcus Feld",
    role: "Founder",
    company: "Cartwheel",
    initials: "MF",
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

      const items = el.querySelectorAll<HTMLElement>("[data-card]");
      const tween = gsap.from(items, {
        opacity: 0,
        y: 28,
        filter: "blur(6px)",
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      });

      cleanups.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    })();

    return () => cleanups.forEach((c) => c());
  }, [reduced]);

  return (
    <section className="relative w-full overflow-hidden  py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_5%,transparent),transparent_70%)]"
      />
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/70">
            <span aria-hidden className="h-px w-8 bg-primary/60" />
            Proof, not promises
            <span aria-hidden className="h-px w-8 bg-primary/60" />
          </div>
          <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            Trusted with what teams can&rsquo;t afford to lose
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Security, infrastructure, and platform work for organizations where
            failure isn&rsquo;t an option.
          </p>
        </div>

        <div
          ref={containerRef}
          className="mx-auto mt-16 grid max-w-5xl gap-5 md:mt-20 md:grid-cols-2 md:gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              data-card
              className="group relative flex flex-col gap-6 rounded-lg border border-border/60 bg-card/40 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-primary/30 md:p-8"
            >
              <Quote
                aria-hidden
                className="size-7 text-primary/30 transition-colors duration-300 group-hover:text-primary/50"
                strokeWidth={1.5}
              />
              <blockquote className="font-display text-xl leading-snug tracking-tight text-foreground/90 md:text-2xl">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3.5 pt-2">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 font-display text-sm text-primary"
                >
                  {t.initials}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {t.role} · {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
