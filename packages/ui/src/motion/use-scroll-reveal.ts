"use client";
import { useEffect, useRef, type RefObject } from "react";

type RevealOpts = {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  once?: boolean;
  selector?: string;
};

export function useScrollReveal<T extends HTMLElement>(opts: RevealOpts = {}): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const targets = opts.selector ? el.querySelectorAll<HTMLElement>(opts.selector) : [el];
      const tween = gsap.from(targets, {
        y: opts.y ?? 32,
        x: opts.x ?? 0,
        opacity: opts.opacity ?? 0,
        duration: opts.duration ?? 0.8,
        delay: opts.delay ?? 0,
        stagger: opts.stagger ?? 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: opts.start ?? "top 80%",
          end: opts.end ?? "bottom 20%",
          scrub: opts.scrub,
          toggleActions: opts.once === false ? "play reverse play reverse" : "play none none none",
        },
      });

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    })();

    return () => cleanup?.();
  }, [opts]);

  return ref;
}
