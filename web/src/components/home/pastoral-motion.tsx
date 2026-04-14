"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionLabel, Latin } from "@/components/editorial";
import {
  FEATURED_VIDEO,
  QUEUED_VIDEOS,
  type PastoralVideo,
} from "@/lib/featured-videos";

function thumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function PastoralMotion() {
  const all = [FEATURED_VIDEO, ...QUEUED_VIDEOS];
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const active = all[activeIndex];
  const queue = all.filter((_, i) => i !== activeIndex);

  const selectVideo = (video: PastoralVideo) => {
    const idx = all.findIndex((v) => v === video);
    if (idx !== -1) {
      setActiveIndex(idx);
      setPlaying(false);
    }
  };

  return (
    <section
      id="motion"
      aria-labelledby="motion-title"
      className="bg-bone px-14 py-[140px] max-lg:px-8 max-md:px-6 max-md:py-24"
    >
      <div className="mx-auto max-w-[1240px]">
        <SectionLabel>
          <Latin>In Actu Pastorali</Latin>
        </SectionLabel>
        <h2
          id="motion-title"
          className="mb-4 mt-6 font-[family-name:var(--font-display)] text-[clamp(40px,4.5vw,72px)] font-medium leading-[1.05] tracking-[-0.015em]"
        >
          Pastoral Activities in <em className="italic text-gold">Motion</em>
        </h2>
        <p className="max-w-[680px] font-[family-name:var(--font-display)] text-[22px] italic leading-[1.55] text-ink-soft">
          Selected homilies, pastoral visits, and sacred liturgies — recorded as
          they unfolded across the Archdiocese.
        </p>

        <div className="mt-20 grid grid-cols-[1.7fr_1fr] gap-12 max-lg:grid-cols-1 max-lg:gap-10 max-lg:mt-14">
          <div>
            <div className="relative border border-[color:var(--rule)] bg-bone-deep p-[14px]">
              <span
                aria-hidden
                className="absolute -left-px -top-px h-7 w-7 border-l-2 border-t-2 border-gold"
              />
              <span
                aria-hidden
                className="absolute -bottom-px -right-px h-7 w-7 border-b-2 border-r-2 border-gold"
              />
              <div className="relative aspect-video w-full bg-ink">
                {playing ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
                    title={active.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label={`Play video: ${active.title}`}
                    className="group absolute inset-0 block cursor-pointer"
                  >
                    <Image
                      key={active.id + activeIndex}
                      src={thumb(active.id)}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 760px"
                      className="object-cover transition-opacity duration-500 group-hover:opacity-90"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
                    />
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-gold/70 bg-ink/40 text-gold backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.06]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-1 h-7 w-7"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className="absolute bottom-5 right-5 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-bone">
                      {active.duration}
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-3 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
                <time dateTime={active.iso}>{active.date}</time>
                <span className="mx-2 opacity-40">·</span>
                {active.occasion}
              </p>
              <h3 className="font-[family-name:var(--font-display)] text-[32px] font-medium leading-[1.2] text-ink">
                {active.title}
              </h3>
            </div>
          </div>

          <aside aria-label="Queued videos">
            <p className="mb-5 flex items-center gap-3 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
              <span aria-hidden className="block h-px w-6 bg-gold" />
              Up Next
            </p>
            <ul className="space-y-5">
              {queue.map((video) => (
                <li key={`${video.id}-${video.iso}`}>
                  <button
                    type="button"
                    onClick={() => selectVideo(video)}
                    className="group flex w-full gap-4 border-b border-stone pb-5 text-left transition-opacity hover:opacity-95"
                  >
                    <span className="relative block aspect-video w-[132px] flex-shrink-0 bg-ink">
                      <Image
                        src={thumb(video.id)}
                        alt=""
                        fill
                        sizes="132px"
                        className="object-cover"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-ink/20 transition-colors duration-300 group-hover:bg-ink/10"
                      />
                      <span className="absolute bottom-1 right-1 bg-ink/80 px-1.5 py-px font-[family-name:var(--font-ui)] text-[9px] font-semibold tracking-[1px] text-bone">
                        {video.duration}
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="mb-1 font-[family-name:var(--font-ui)] text-[9px] font-semibold uppercase tracking-[1.5px] text-gold-text">
                        {video.occasion}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[17px] font-medium leading-[1.3] text-ink transition-colors group-hover:text-gold-text">
                        {video.title}
                      </span>
                      <span className="mt-1 font-[family-name:var(--font-ui)] text-[10px] tracking-[1px] text-ink-soft opacity-70">
                        <time dateTime={video.iso}>{video.date}</time>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
