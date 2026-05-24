"use client";
import * as React from "react";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "./hooks";

export interface StaggerProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "variants"> {
  gap?: number;
  delay?: number;
  once?: boolean;
}

const container = (gap: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function Stagger({
  gap = 0.08,
  delay = 0,
  once = true,
  children,
  ...props
}: StaggerProps) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    const { className, style, id } = props as React.HTMLAttributes<HTMLDivElement>;
    return (
      <div className={className} style={style} id={id}>
        {children as React.ReactNode}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      variants={container(gap, delay)}
      {...props}
    >
      {React.Children.map(children as React.ReactNode, (child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
