import Image from "next/image";
import Link from "next/link";
import { Roman, SectionLabel } from "@/components/editorial";
import { getPastoralLetters, slugify, yearOf } from "@/lib/cms";

export async function FeaturedLetter() {
  const letters = await getPastoralLetters();
  const latest = [...letters].sort((a, b) => {
    const ya = yearOf(a.date) ?? 0;
    const yb = yearOf(b.date) ?? 0;
    return yb - ya;
  })[0];

  if (!latest) return null;

  const slug = `${latest.id}-${slugify(latest.title)}`;
  const year = yearOf(latest.date);
  const cover = latest.cover_photo_url ?? latest.thumbnail_url;

  return (
    <section
      id="pastoral-letters"
      aria-labelledby="featured-letter-title"
      className="relative overflow-hidden bg-bone px-14 py-[140px] max-lg:px-8 max-md:px-6 max-md:py-24"
    >
      {year ? (
        <span
          aria-hidden
          className="pointer-events-none absolute right-[-30px] top-20 font-[family-name:var(--font-display)] text-[280px] font-semibold leading-none tracking-[-0.04em] text-gold opacity-[0.06] max-md:hidden"
        >
          {year}
        </span>
      ) : null}

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-[1.1fr_1fr] items-center gap-[100px] max-lg:grid-cols-1 max-lg:gap-14">
        <Link
          href={`/pastoral-letters/${slug}`}
          className="group flex justify-center focus:outline-none"
          aria-label={`Read ${latest.title}`}
        >
          {cover ? (
            <Image
              src={cover}
              alt={`Cover of ${latest.title}`}
              width={1200}
              height={1500}
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="book-tilt h-auto w-full max-w-[520px] [filter:drop-shadow(0_30px_80px_rgba(10,27,51,0.25))_drop-shadow(0_8px_24px_rgba(10,27,51,0.12))]"
            />
          ) : null}
        </Link>
        <div>
          <SectionLabel>
            Latest Pastoral Letter
            {year ? (
              <>
                {" · "}
                <Roman year={year} />
              </>
            ) : null}
          </SectionLabel>
          <h2
            id="featured-letter-title"
            className="mb-4 mt-6 font-[family-name:var(--font-display)] text-[clamp(40px,4.5vw,72px)] font-medium leading-[1.05] tracking-[-0.015em]"
          >
            {latest.title}
          </h2>
          <hr className="my-7 h-px w-[60px] border-0 bg-gold" />
          {latest.key_quote ? (
            <blockquote className="my-8 border-l-2 border-gold pl-7 font-[family-name:var(--font-display)] text-[32px] italic leading-[1.4] text-ink max-md:text-2xl">
              &ldquo;{latest.key_quote}&rdquo;
            </blockquote>
          ) : null}
          {latest.description ? (
            <p className="mb-9 text-ink-soft">{latest.description}</p>
          ) : null}
          <Link
            href={`/pastoral-letters/${slug}`}
            style={{ ["--sweep-color" as string]: "#c9a664" }}
            className="btn-ink btn-sweep"
          >
            Read in Full →
          </Link>
        </div>
      </div>
    </section>
  );
}
