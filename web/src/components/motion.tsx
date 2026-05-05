"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const SPRING = { type: "spring", stiffness: 90, damping: 22, mass: 0.7 } as const;

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SPRING },
};

const STAGGER_PARENT: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const STAGGER_CHILD: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: SPRING },
};

type FadeProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number; // viewport visibility threshold (0-1)
  once?: boolean;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  amount = 0.2,
  once = true,
}: FadeProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={FADE_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
  once?: boolean;
  /** Override the default 0.08s gap between children. */
  gap?: number;
};

/** Wrap a list/grid; each direct child of <Stagger.Item> animates in sequence. */
export function Stagger({
  children,
  className,
  amount = 0.15,
  once = true,
  gap,
}: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const parent: Variants = gap
    ? {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: gap, delayChildren: 0.05 },
        },
      }
    : STAGGER_PARENT;
  return (
    <motion.div
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

Stagger.Item = function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={STAGGER_CHILD}>
      {children}
    </motion.div>
  );
};
