"use client";

import Image from "next/image";
import { useState } from "react";
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
  // 5-9: 2 cols on mobile, 3 cols on desktop. Tiles touch (no gap).
  return "grid-cols-2 lg:grid-cols-3";
}

export function VideoGrid({ videos }: { videos: PastoralVideo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const count = videos.length;

  return (
    <div
      className={`mt-16 grid w-full max-lg:mt-12 ${responsiveColsClass(count)}`}
    >
      {videos.map((video, idx) => (
        <Tile
          key={`${video.id}-${idx}`}
          video={video}
          isActive={activeId === video.id}
          onActivate={() => setActiveId(video.id)}
        />
      ))}
    </div>
  );
}

function Tile({
  video,
  isActive,
  onActivate,
}: {
  video: PastoralVideo;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <figure className="group relative aspect-video overflow-hidden bg-ink ring-1 ring-[color:var(--rule)]">
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
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 420px"
            className="object-cover transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.04]"
          />
          {/* Static gradient — no transitions, so the hover state is just the
              image's transform. Sleek and smooth. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent"
          />
          {/* Play button — single transform on hover, GPU-only. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-gold/70 bg-ink/45 text-gold backdrop-blur-sm transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-110 max-md:h-11 max-md:w-11"
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
