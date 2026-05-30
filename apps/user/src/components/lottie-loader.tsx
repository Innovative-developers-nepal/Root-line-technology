"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@rootline/ui/lib/cn";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Size = "sm" | "md" | "lg";

const SIZE_CLS: Record<Size, string> = {
  sm: "h-20 w-20",
  md: "h-40 w-40",
  lg: "h-64 w-64",
};

export function LottieLoader({
  className,
  size = "md",
  label = "Loading",
}: {
  className?: string;
  size?: Size;
  label?: string;
}) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/animations/1.json")
      .then((r) => r.json())
      .then((d: Record<string, unknown>) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        /* fallback shape stays */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center justify-center", className)}
    >
      {data ? (
        <Lottie
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          animationData={data as any}
          loop
          className={SIZE_CLS[size]}
        />
      ) : (
        <div className={cn("animate-pulse rounded-full bg-muted", SIZE_CLS[size])} />
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}
