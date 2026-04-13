"use client";

import { useEffect, useState } from "react";

/**
 * A 2px gold bar at the top of the viewport that fills as the user scrolls
 * the given target element. Defaults to the document body.
 */
export function ReadingProgress({ targetId }: { targetId?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const target = targetId ? document.getElementById(targetId) : null;
      const el = target ?? document.documentElement;
      const top = target ? target.getBoundingClientRect().top : 0;
      const height = target
        ? target.scrollHeight - window.innerHeight + top
        : el.scrollHeight - window.innerHeight;
      const scrolled = target
        ? Math.max(0, -top)
        : window.scrollY;
      const pct =
        height > 0 ? Math.min(1, Math.max(0, scrolled / height)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-gold transition-[width] duration-100 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
