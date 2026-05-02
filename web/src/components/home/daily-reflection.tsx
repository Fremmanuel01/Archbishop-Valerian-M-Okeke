import { Roman } from "@/components/editorial";
import { getHomepage } from "@/lib/homepage";

const TIMEZONE = "Africa/Lagos";

function todayInLagos() {
  const now = new Date();
  const dayMonth = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: TIMEZONE,
  }).format(now);
  const iso = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIMEZONE,
  }).format(now);
  return { dayMonth, iso };
}

export async function DailyReflection() {
  const { dayMonth, iso } = todayInLagos();
  const { dailyReflectionQuote } = await getHomepage();
  return (
    <section
      id="reflections"
      aria-label="Daily reflection"
      className="border-y border-[color:var(--rule)] bg-bone-deep px-14 py-12 max-lg:px-8 max-md:px-6 max-md:py-10"
    >
      <div className="mx-auto grid max-w-[1240px] grid-cols-[200px_1fr_200px] items-center gap-14 max-lg:grid-cols-1 max-lg:gap-7 max-lg:text-center">
        <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
          Reflection for the day
          <strong className="mt-1.5 block font-[family-name:var(--font-display)] text-[26px] font-medium italic normal-case tracking-normal text-ink">
            <time dateTime={iso}>{dayMonth}</time>
          </strong>
        </p>
        <blockquote className="text-center font-[family-name:var(--font-display)] text-[30px] italic leading-[1.4] text-ink max-lg:text-[22px]">
          &ldquo;{dailyReflectionQuote}&rdquo;
          <span className="mt-4 block font-[family-name:var(--font-ui)] text-[11px] font-semibold not-italic uppercase tracking-[2px] text-gold">
            Pentecost Homily · <Roman year={2020} />
          </span>
        </blockquote>
        <a
          href="#reflections"
          className="inline-block justify-self-end border-b border-gold pb-1.5 text-right font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink max-lg:justify-self-center max-lg:text-center"
        >
          Full Reflection →
        </a>
      </div>
    </section>
  );
}
