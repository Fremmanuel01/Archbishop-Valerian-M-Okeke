"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { MouseEvent } from "react";
import { useRef } from "react";

const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };
const MAX_TILT = 9; // degrees

export function MagneticBook({
  href,
  src,
  alt,
  ariaLabel,
}: {
  href: string;
  src: string;
  alt: string;
  ariaLabel: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  // Raw -1..1 from cursor position relative to centre, then spring-smoothed.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  const rotateY = useTransform(sx, [-1, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [-1, 1], [MAX_TILT, -MAX_TILT]);
  const lift = useTransform(sy, [-1, 1], [4, -4]); // tiny y-shift

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    x.set(cx / (rect.width / 2));
    y.set(cy / (rect.height / 2));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <Link
      href={href}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={ariaLabel}
      className="group flex justify-center focus:outline-none"
      style={{ perspective: 1200 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 0.8 }}
        style={{
          rotateX,
          rotateY,
          y: lift,
          transformStyle: "preserve-3d",
        }}
        className="will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1500}
          priority
          sizes="(max-width: 1024px) 100vw, 520px"
          className="h-auto w-full max-w-[520px] [filter:drop-shadow(0_30px_80px_rgba(10,27,51,0.25))_drop-shadow(0_8px_24px_rgba(10,27,51,0.12))]"
        />
      </motion.div>
    </Link>
  );
}
