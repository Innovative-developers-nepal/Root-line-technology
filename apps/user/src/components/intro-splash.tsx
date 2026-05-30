"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@rootline/hooks";
import { cn } from "@rootline/ui/lib/cn";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SESSION_KEY = "rootline:intro-shown";
const READY_EVENT = "rootline:intro-done";
type Phase = "idle" | "loading" | "playing" | "fading" | "done";

/**
 * Returns true once the intro splash is over (or was skipped). Use this in
 * client components to delay any on-mount entrance animations so they don't
 * fire while hidden behind the splash.
 */
export function useIntroReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Skip cases: already shown this session, or user prefers reduced motion.
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setReady(true);
        return;
      }
    } catch {
      /* ignore */
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }

    const handler = () => setReady(true);
    window.addEventListener(READY_EVENT, handler);
    return () => window.removeEventListener(READY_EVENT, handler);
  }, []);

  return ready;
}

export function IntroSplash() {
  // Start "idle" so initial SSR/client render emits nothing (no flash on
  // navigation). After mount, decide whether to actually play.
  const [phase, setPhase] = useState<Phase>("idle");
  const [data, setData] = useState<unknown>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }

    let cancelled = false;
    setPhase("loading");
    fetch("/animations/1.json")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setPhase("playing");
      })
      .catch(() => {
        // Fetch failed — release the pre-overlay and signal ready so the
        // page isn't trapped behind it.
        document.documentElement.classList.remove("intro-pending");
        window.dispatchEvent(new Event(READY_EVENT));
        setPhase("done");
      });

    return () => {
      cancelled = true;
    };
  }, [reduced]);

  // lock body scroll while splash is visible
  useEffect(() => {
    if (phase === "loading" || phase === "playing" || phase === "fading") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [phase]);

  const finish = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    document.documentElement.classList.remove("intro-pending");
    setPhase("fading");
    window.dispatchEvent(new Event(READY_EVENT));
    window.setTimeout(() => setPhase("done"), 450);
  };

  if (phase === "idle" || phase === "done") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500",
        phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      {!!data && (phase === "playing" || phase === "fading") && (
        <Lottie
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          animationData={data as any}
          loop={false}
          onComplete={finish}
          className="h-56 w-56 md:h-72 md:w-72"
        />
      )}
    </div>
  );
}
