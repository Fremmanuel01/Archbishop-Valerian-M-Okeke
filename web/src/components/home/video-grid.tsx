"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import type { PastoralVideo } from "@/lib/featured-videos";

function thumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// Literal class names so Tailwind's JIT can pick them up at build time.
function responsiveColsClass(count: number): string {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-3";
  if (count === 4) return "grid-cols-2";
  return "grid-cols-2 lg:grid-cols-3";
}

const SPRING = { type: "spring", stiffness: 240, damping: 30, mass: 0.9 } as const;

export function VideoGrid({ videos }: { videos: PastoralVideo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (min-width: 1024px)");
    const motionPref = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Defer initial setState by a microtask so this effect doesn't
    // trigger a sync re-render from inside itself.
    queueMicrotask(() => {
      setCanHover(hover.matches);
      setReducedMotion(motionPref.matches);
    });
    const onHover = (e: MediaQueryListEvent) => setCanHover(e.matches);
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    hover.addEventListener("change", onHover);
    motionPref.addEventListener("change", onMotion);
    return () => {
      hover.removeEventListener("change", onHover);
      motionPref.removeEventListener("change", onMotion);
    };
  }, []);

  const count = videos.length;
  // Expansion is desktop-with-pointer only and only when we have at least 4
  // tiles for the layout shift to read as intentional. On phones / tablets /
  // touch devices, the grid is a clean static mosaic.
  const canExpand = canHover && count >= 4;
  const expandedId = canExpand ? activeId ?? hoveredId : activeId;

  return (
    <LayoutGroup>
      <div
        className={`mt-16 grid w-full max-lg:mt-12 ${responsiveColsClass(count)}`}
        // Containment hint helps the browser optimise the FLIP animation.
        style={{ contain: "layout paint" }}
      >
        {videos.map((video) => (
          <Tile
            key={video.id}
            video={video}
            isActive={activeId === video.id}
            isExpanded={expandedId === video.id}
            canExpand={canExpand}
            reducedMotion={reducedMotion}
            onActivate={() =>
              setActiveId((id) => (id === video.id ? null : video.id))
            }
            onHoverStart={() => setHoveredId(video.id)}
            onHoverEnd={() => setHoveredId(null)}
          />
        ))}
      </div>
    </LayoutGroup>
  );
}

function Tile({
  video,
  isActive,
  isExpanded,
  canExpand,
  reducedMotion,
  onActivate,
  onHoverStart,
  onHoverEnd,
}: {
  video: PastoralVideo;
  isActive: boolean;
  isExpanded: boolean;
  canExpand: boolean;
  reducedMotion: boolean;
  onActivate: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  // The expanded tile spans 2 columns AND 2 rows so it forms a clean 2×2
  // square inside the mosaic. Non-expanded neighbours flow naturally around
  // it, and Framer Motion's `layout` prop runs a FLIP animation that's
  // smoother than any CSS-grid track interpolation could be.
  const spanClass = isExpanded ? "col-span-2 row-span-2 z-20" : "z-0";

  const transition = reducedMotion
    ? { duration: 0 }
    : SPRING;

  return (
    <motion.figure
      layout
      transition={transition}
      onHoverStart={canExpand ? onHoverStart : undefined}
      onHoverEnd={canExpand ? onHoverEnd : undefined}
      className={`group relative aspect-video overflow-hidden bg-ink ring-1 ring-[color:var(--rule)] ${spanClass}`}
      style={{ willChange: "transform" }}
    >
      {isActive ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 z-10 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={onActivate}
          aria-label={`Play video: ${video.title}`}
          className="absolute inset-0 z-10 block h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
        >
          {/* Wrap in motion.div so the image can scale alongside the layout
              animation without compounding CSS transitions. */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isExpanded ? 1.02 : 1 }}
            transition={transition}
          >
            <Image
              src={thumb(video.id)}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 480px"
              className="object-cover"
            />
          </motion.div>
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent"
          />
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-16 w-16 items-center justify-center border border-gold/70 bg-ink/45 text-gold backdrop-blur-sm max-md:h-11 max-md:w-11"
            style={{ x: "-50%", y: "-50%" }}
            animate={{ scale: isExpanded ? 1.18 : 1 }}
            transition={transition}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="ml-1 h-6 w-6 max-md:h-4 max-md:w-4"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.span>
          {video.duration ? (
            <span className="absolute bottom-3 right-3 z-10 bg-ink/80 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold tracking-[1.5px] text-bone max-md:bottom-2 max-md:right-2 max-md:text-[9px]">
              {video.duration}
            </span>
          ) : null}
        </button>
      )}

      {!isActive ? (
        <figcaption className="pointer-events-none absolute inset-x-4 bottom-3 z-10 flex flex-col gap-1 text-bone max-md:inset-x-3 max-md:bottom-2">
          {video.occasion ? (
            <span className="font-[family-name:var(--font-ui)] text-[9px] font-semibold uppercase tracking-[2px] text-gold-soft max-md:hidden">
              {video.occasion}
            </span>
          ) : null}
          <h3 className="font-[family-name:var(--font-display)] text-[clamp(15px,1.5vw,22px)] font-medium leading-[1.2] text-bone line-clamp-2 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] max-md:text-[13px] max-md:leading-[1.15]">
            {video.title}
          </h3>
          {video.date ? (
            <time
              dateTime={video.iso ?? ""}
              className="font-[family-name:var(--font-ui)] text-[10px] tracking-[1.5px] text-bone/80 max-md:text-[9px]"
            >
              {video.date}
            </time>
          ) : null}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}
