"use client";
import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { usePrefersReducedMotion } from "./hooks";

export interface FadeUpProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "variants"> {
  delay?: number;
  distance?: number;
  duration?: number;
  once?: boolean;
  whenInView?: boolean;
}

export function FadeUp({
  delay = 0,
  distance = 24,
  duration = 0.6,
  once = true,
  whenInView = true,
  children,
  ...props
}: FadeUpProps) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    const { className, style, id } = props as React.HTMLAttributes<HTMLDivElement>;
    return (
      <div className={className} style={style} id={id}>
        {children as React.ReactNode}
      </div>
    );
  }

  const initial = { opacity: 0, y: distance };
  const animate = { opacity: 1, y: 0 };
  const transition = { delay, duration, ease: [0.22, 1, 0.36, 1] as const };

  if (whenInView) {
    return (
      <motion.div
        initial={initial}
        whileInView={animate}
        viewport={{ once, margin: "-10% 0px -10% 0px" }}
        transition={transition}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div initial={initial} animate={animate} transition={transition} {...props}>
      {children}
    </motion.div>
  );
}
