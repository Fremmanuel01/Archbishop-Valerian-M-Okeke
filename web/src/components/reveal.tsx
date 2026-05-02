"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  once?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // Start visible so SSR markup is paintable immediately and slow-JS
  // devices don't see an empty page header. Only hide-then-animate when we
  // know the element is below the fold and the browser supports IO.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = node.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return; // already visible — leave it; no animation needed.

    setHidden(true);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHidden(false);
            if (once) observer.disconnect();
          } else if (!once) {
            setHidden(true);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const style: React.CSSProperties = {
    opacity: hidden ? 0 : 1,
    transform: hidden ? "translateY(14px)" : "translateY(0)",
    transition:
      "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${delay}ms`,
    willChange: "opacity, transform",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;
  return (
    <Component ref={ref} className={className} style={style}>
      {children}
    </Component>
  );
}
