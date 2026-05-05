import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { EmptyState, Roman } from "@/components/editorial";
import { getMessages, slugify, yearOf, formatLongDate } from "@/lib/cms";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Easter & Christmas Messages",
  description:
    "Seasonal messages of His Grace Most Rev. Valerian Maduka Okeke — Easter and Christmas addresses to the faithful of the Archdiocese of Onitsha.",
};

export const revalidate = 3600;

export default async function MessagesPage() {
  const [messages, lang] = await Promise.all([getMessages(), getLang()]);
  const t = getDict(lang);
  const sorted = [...messages].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : -1;
  });

  return (
    <PageShell
      eyebrow={t.pages.messages.eyebrow}
      title={t.pages.messages.title}
      titleAccent={t.pages.messages.titleAccent}
      lead={t.pages.messages.lead}
    >
      <PageSection>
        {sorted.length === 0 ? (
          <EmptyState
            title={t.empty.messagesTitle}
            body={t.empty.messagesBody}
          />
        ) : (
          <ul className="grid grid-cols-2 gap-10 max-md:grid-cols-1">
            {sorted.map((m) => {
              const year = yearOf(m.date);
              const isChristmas = m.title.toLowerCase().includes("christmas");
              const slug = `${m.id}-${slugify(m.title)}`;
              const cleanTitle = m.title.replace(
                /^\d{4}\s+(Easter|Christmas)\s+Message:\s*/i,
                "",
              );
              return (
                <li key={m.id}>
                  <Link
                    href={`/messages/${slug}`}
                    className="group relative flex h-full flex-col border border-[color:var(--rule)] bg-bone p-10 transition-colors hover:border-gold max-md:p-7"
                  >
                    {m.cover_photo_url ? (
                      <div className="relative mb-8 aspect-[3/2] w-full overflow-hidden bg-stone">
                        <Image
                          src={m.cover_photo_url}
                          alt={m.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                    <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
                      {isChristmas ? "Christmas" : "Easter"}
                      {year ? (
                        <>
                          {" · "}
                          <Roman year={year} />
                        </>
                      ) : null}
                    </p>
                    <h2 className="mt-4 font-[family-name:var(--font-display)] text-[26px] font-medium leading-[1.2] text-ink transition-colors group-hover:text-gold-text max-md:text-[22px]">
                      {cleanTitle}
                    </h2>
                    {m.occasion ? (
                      <p className="mt-2 font-[family-name:var(--font-display)] text-[16px] italic leading-[1.4] text-ink-soft">
                        {m.occasion}
                      </p>
                    ) : null}
                    {m.date ? (
                      <p className="mt-auto pt-6 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft">
                        <time dateTime={m.date}>{formatLongDate(m.date)}</time>
                      </p>
                    ) : null}
                    <span className="mt-4 inline-flex w-fit border-b border-gold pb-1.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink">
                      Read →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </PageSection>
    </PageShell>
  );
}
