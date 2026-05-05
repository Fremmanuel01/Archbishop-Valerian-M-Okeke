"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number; // ms — preserved for backwards compat
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  once?: boolean;
};

const SPRING = { type: "spring", stiffness: 90, damping: 22, mass: 0.7 } as const;

export function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tag = as as any;
    return <Tag className={className}>{children}</Tag>;
  }

  // motion factory keyed by tag name: motion.div, motion.section, etc.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = ((motion as any)[as] ?? motion.div) as React.ElementType;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ ...SPRING, delay: delay / 1000 }}
    >
      {children}
    </Component>
  );
}
