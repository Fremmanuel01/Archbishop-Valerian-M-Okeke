"use client";

import { useEffect, useRef, useState } from "react";

// Auto-resizing iframe for the newsletter archive. The srcDoc is our own
// HTML (server-generated email markup), so we don't sandbox — that lets us
// read the document height from the parent and grow the iframe to fit. No
// scrollbar, no fold inside the page.

export function NewsletterIframe({
  html,
  title,
}: {
  html: string;
  title: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(800);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    const resize = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      const next = Math.max(
        doc.body.scrollHeight,
        doc.documentElement.scrollHeight,
      );
      if (next > 0) setHeight(next + 40);
    };

    iframe.addEventListener("load", resize);
    let observer: ResizeObserver | null = null;
    const onLoad = () => {
      resize();
      const doc = iframe.contentDocument;
      if (doc && "ResizeObserver" in window) {
        observer = new ResizeObserver(() => resize());
        observer.observe(doc.body);
      }
    };
    iframe.addEventListener("load", onLoad);
    // If srcDoc was already loaded before effect ran:
    if (iframe.contentDocument?.readyState === "complete") onLoad();

    return () => {
      iframe.removeEventListener("load", resize);
      iframe.removeEventListener("load", onLoad);
      observer?.disconnect();
    };
  }, [html]);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={html}
      style={{ height: `${height}px` }}
      className="w-full border border-[color:var(--rule)] bg-bone"
      loading="lazy"
    />
  );
}
