"use client";
import * as React from "react";
import { useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: string;
}

export function SpotlightCard({ glow, className, children, ...props }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn(
        "group relative overflow-hidden rounded-md border border-border bg-card transition-colors",
        "hover:border-primary/40",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${pos.x}% ${pos.y}%, ${
            glow ?? "var(--color-primary)"
          }, transparent 40%)`,
          opacity: active ? 0.15 : 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
