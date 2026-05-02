"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { PastoralVideo } from "@/lib/featured-videos";

function thumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function gridShape(count: number) {
  if (count <= 1) return { cols: 1, rows: 1 };
  if (count <= 3) return { cols: count, rows: 1 };
  if (count <= 6) return { cols: 3, rows: 2 };
  return { cols: 3, rows: 3 };
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

export function VideoGrid({ videos }: { videos: PastoralVideo[] }) {
  const { cols, rows } = gridShape(videos.length);
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const expandable = videos.length >= 4;
  const hoveredCol = hovered === null ? null : hovered % cols;
  const hoveredRow = hovered === null ? null : Math.floor(hovered / cols);

  const gridStyle: CSSProperties = expandable
    ? {
        gridTemplateColumns: trackValues(cols, hoveredCol ?? -1, 5, 3),
        gridTemplateRows: trackValues(rows, hoveredRow ?? -1, 5, 3),
        transition:
          "grid-template-columns 420ms ease, grid-template-rows 420ms ease",
      }
    : {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      };

  return (
    <div
      className="mt-20 grid w-full gap-3 max-lg:mt-14 max-lg:gap-2"
      style={{
        ...gridStyle,
        height: rows === 1 ? "min(58vw, 620px)" : "min(80vw, 720px)",
      }}
    >
      {videos.map((video, idx) => (
        <Tile
          key={`${video.id}-${idx}`}
          video={video}
          isActive={activeId === video.id}
          onActivate={() => setActiveId(video.id)}
          onHover={() => setHovered(idx)}
          onLeave={() => setHovered(null)}
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
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <figure
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative h-full min-h-[260px] overflow-hidden border border-[color:var(--rule)] bg-ink"
    >
      <span
        aria-hidden
        className="absolute -left-px -top-px z-20 h-6 w-6 border-l-2 border-t-2 border-gold"
      />
      <span
        aria-hidden
        className="absolute -bottom-px -right-px z-20 h-6 w-6 border-b-2 border-r-2 border-gold"
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
          className="absolute inset-0 z-10 block h-full w-full cursor-pointer"
        >
          <Image
            src={thumb(video.id)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1240px) 50vw, 420px"
            className="object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.04] group-hover:brightness-110"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition-opacity duration-500 group-hover:from-ink/70"
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-gold/70 bg-ink/45 text-gold backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 max-md:h-12 max-md:w-12"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="ml-1 h-6 w-6 max-md:h-5 max-md:w-5"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          {video.duration ? (
            <span className="absolute bottom-3 right-3 z-10 bg-ink/80 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold tracking-[1.5px] text-bone">
              {video.duration}
            </span>
          ) : null}
        </button>
      )}

      <figcaption className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex flex-col gap-1 text-bone">
        {video.occasion ? (
          <span className="font-[family-name:var(--font-ui)] text-[9px] font-semibold uppercase tracking-[2px] text-gold-soft max-md:text-[8px]">
            {video.occasion}
          </span>
        ) : null}
        <h3 className="font-[family-name:var(--font-display)] text-[20px] font-medium leading-[1.2] text-bone drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] max-md:text-[16px]">
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
    </figure>
  );
}
