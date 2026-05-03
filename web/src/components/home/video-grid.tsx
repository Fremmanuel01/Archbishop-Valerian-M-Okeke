"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import type { PastoralVideo } from "@/lib/featured-videos";

function thumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// Default columns at the desktop (lg) breakpoint. Smaller breakpoints fall
// back via Tailwind responsive classes below — we never try to render a
// 3-column layout on a phone.
function desktopCols(count: number) {
  if (count <= 1) return 1;
  if (count <= 3) return count;
  if (count === 4) return 2;
  return 3;
}

function trackValues(
  total: number,
  hoveredIndex: number,
  large: number,
  small: number,
) {
  return Array.from({ length: total }, (_, i) =>
    i === hoveredIndex ? `${large}fr` : `${small}fr`,
  ).join(" ");
}

// Literal class names so Tailwind's JIT can pick them up at build time.
function responsiveColsClass(count: number): string {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  if (count === 4) return "grid-cols-1 sm:grid-cols-2";
  // 5-9: 2 cols on mobile/tablet, 3 cols on desktop.
  return "grid-cols-2 lg:grid-cols-3";
}

export function VideoGrid({ videos }: { videos: PastoralVideo[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setCanHover(hover.matches);
    setReducedMotion(motion.matches);
    const onHover = (e: MediaQueryListEvent) => setCanHover(e.matches);
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    hover.addEventListener("change", onHover);
    motion.addEventListener("change", onMotion);
    return () => {
      hover.removeEventListener("change", onHover);
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  const count = videos.length;
  const cols = desktopCols(count);
  const expandable = canHover && !reducedMotion && count >= 4;

  // Inline grid-template-columns override fires only on desktop with a
  // hover-capable pointer AND when there are enough tiles to make the expand
  // feel intentional. We deliberately DO NOT interpolate grid-template-rows
  // — animating both axes at once felt jittery and made the hovered cell
  // dominate the layout. Columns-only keeps the row rhythm steady; the
  // hovered tile gets wider, neighbours get narrower, every tile stays the
  // same height.
  const expandStyle: CSSProperties | undefined =
    expandable && hovered !== null
      ? {
          gridTemplateColumns: trackValues(
            cols,
            hovered % cols,
            4,
            3,
          ),
          transition:
            "grid-template-columns 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        }
      : undefined;

  return (
    <div
      className={`mt-16 grid w-full gap-3 max-md:gap-2 max-lg:mt-12 ${responsiveColsClass(count)}`}
      style={expandStyle}
    >
      {videos.map((video, idx) => (
        <Tile
          key={`${video.id}-${idx}`}
          video={video}
          isActive={activeId === video.id}
          onActivate={() => setActiveId(video.id)}
          onHover={canHover ? () => setHovered(idx) : undefined}
          onLeave={canHover ? () => setHovered(null) : undefined}
        />
      ))}
    </div>
  );
}

function Tile({
  video,
  isActive,
  onActivate,
  onHover,
  onLeave,
}: {
  video: PastoralVideo;
  isActive: boolean;
  onActivate: () => void;
  onHover?: () => void;
  onLeave?: () => void;
}) {
  return (
    <figure
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative aspect-video overflow-hidden border border-[color:var(--rule)] bg-ink"
    >
      {/* Gold L-brackets in opposite corners — echoes the hero/diary cards.
          Static size; we want the visual rhythm without contending with the
          grid-template-columns transition for paint cycles. */}
      <span
        aria-hidden
        className="absolute -left-px -top-px z-20 h-5 w-5 border-l-2 border-t-2 border-gold max-md:h-4 max-md:w-4"
      />
      <span
        aria-hidden
        className="absolute -bottom-px -right-px z-20 h-5 w-5 border-b-2 border-r-2 border-gold max-md:h-4 max-md:w-4"
      />

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
          <Image
            src={thumb(video.id)}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 420px, 480px"
            className="object-cover transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.03]"
          />
          {/* Static gradient — no hover transition, so the GPU can spend the
              hover-expand interpolation budget on the grid track sizes
              instead of fighting opacity changes underneath. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent"
          />
          {/* Play button — single property transitions on hover. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-gold/70 bg-ink/50 text-gold backdrop-blur-sm transition-transform duration-400 ease-out motion-reduce:transition-none group-hover:scale-110 max-md:h-11 max-md:w-11"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="ml-1 h-6 w-6 max-md:h-4 max-md:w-4"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          {video.duration ? (
            <span className="absolute bottom-3 right-3 z-10 bg-ink/80 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold tracking-[1.5px] text-bone max-md:bottom-2 max-md:right-2 max-md:text-[9px]">
              {video.duration}
            </span>
          ) : null}
        </button>
      )}

      {/* Caption — sits in the dark band of the gradient. Title gets
          line-clamp-2 so a long YouTube title doesn't push the eyebrow and
          date off-tile on a narrow phone. The eyebrow drops out on the
          tightest viewports where space matters most. */}
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
    </figure>
  );
}
