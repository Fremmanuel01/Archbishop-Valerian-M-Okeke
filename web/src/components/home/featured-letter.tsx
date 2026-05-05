import Link from "next/link";
import { Roman, SectionLabel } from "@/components/editorial";
import { plainExcerpt } from "@/components/prose";
import { Stagger } from "@/components/motion";
import { MagneticBook } from "@/components/home/magnetic-book";
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
        {cover ? (
          <MagneticBook
            href={`/pastoral-letters/${slug}`}
            src={cover}
            alt={`Cover of ${latest.title}`}
            ariaLabel={`Read ${latest.title}`}
          />
        ) : null}
        <Stagger className="flex flex-col" amount={0.2}>
          <Stagger.Item>
            <SectionLabel>
              Latest Pastoral Letter
              {year ? (
                <>
                  {" · "}
                  <Roman year={year} />
                </>
              ) : null}
            </SectionLabel>
          </Stagger.Item>
          <Stagger.Item>
            <h2
              id="featured-letter-title"
              className="mb-4 mt-6 font-[family-name:var(--font-display)] text-[clamp(40px,4.5vw,72px)] font-medium leading-[1.05] tracking-[-0.015em]"
            >
              {latest.title}
            </h2>
          </Stagger.Item>
          <Stagger.Item>
            <hr className="my-7 h-px w-[60px] border-0 bg-gold" />
          </Stagger.Item>
          {latest.key_quote ? (
            <Stagger.Item>
              <blockquote className="my-8 border-l-2 border-gold pl-7 font-[family-name:var(--font-display)] text-[32px] italic leading-[1.4] text-ink max-md:text-2xl">
                &ldquo;{latest.key_quote}&rdquo;
              </blockquote>
            </Stagger.Item>
          ) : null}
          {latest.description ? (
            <Stagger.Item>
              <p className="mb-9 text-ink-soft">
                {plainExcerpt(latest.description, 280)}
              </p>
            </Stagger.Item>
          ) : null}
          <Stagger.Item>
            <Link
              href={`/pastoral-letters/${slug}`}
              style={{ ["--sweep-color" as string]: "#c9a664" }}
              className="btn-ink btn-sweep"
            >
              Read in Full →
            </Link>
          </Stagger.Item>
        </Stagger>
      </div>
    </section>
  );
}
