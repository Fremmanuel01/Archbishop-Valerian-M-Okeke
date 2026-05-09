"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Candle,
  Chalice,
  ChiRho,
  Crozier,
  Dove,
  Keys,
  Lamb,
  Mitre,
} from "@/components/icons";
import { getDict, type Lang } from "@/lib/i18n";

export type LetterPreview = {
  id: number;
  title: string;
  year: number | null;
  slug: string;
  cover: string | null;
};

export type HomilyPreview = {
  id: number;
  title: string;
  year: number | null;
  occasion: string | null;
  slug: string;
};

type IconCmp = (p: { className?: string; size?: number }) => React.ReactElement;

type PanelKind = "about" | "library" | "reflections" | "connect" | null;

type NavItem = {
  /** Tailwind-`xl`-and-up label (full). */
  labelKey: keyof ReturnType<typeof getDict>["nav"];
  /** Optional shorter label between lg and xl. */
  shortLabelKey?: keyof ReturnType<typeof getDict>["nav"];
  href: string;
  panel: PanelKind;
};

const NAV: NavItem[] = [
  { labelKey: "aboutHisGrace", shortLabelKey: "aboutHisGraceShort", href: "/biography", panel: "about" },
  { labelKey: "pastoralLetters", shortLabelKey: "pastoralLettersShort", href: "/pastoral-letters", panel: "library" },
  { labelKey: "reflections", href: "/reflections", panel: "reflections" },
  { labelKey: "diary", href: "/diary", panel: null },
  { labelKey: "appointments", shortLabelKey: "appointmentsShort", href: "/appointments", panel: null },
  { labelKey: "connect", href: "/connect", panel: "connect" },
];

type Dict = ReturnType<typeof getDict>;

type NavSubItem = {
  labelKey: keyof Dict["nav"];
  href: string;
  description: { en: string; ig: string };
  Icon: IconCmp;
};

const ABOUT_ITEMS: NavSubItem[] = [
  {
    labelKey: "biography",
    href: "/biography",
    description: {
      en: "The life and ministry of His Grace, from Umudioka to the Metropolitan See.",
      ig: "Ndụ na ọrụ Ọdaa, site n'Umudioka ruo Ocheeze Mmetropolitan.",
    },
    Icon: Crozier,
  },
  {
    labelKey: "hisEpiscopacy",
    href: "/his-episcopacy",
    description: {
      en: "The missionary apostolate: education, prison ministry, riverine evangelisation.",
      ig: "Ọrụ ozi ọma: mmụta, ozi mkpọrọ, izisa ozi ọma n'akụkụ osimiri.",
    },
    Icon: Mitre,
  },
  {
    labelKey: "coatOfArms",
    href: "/coat-of-arms",
    description: {
      en: "The Good Shepherd and the episcopal motto, Ut Vitam Habeant.",
      ig: "Ezi Onye Ọzụzụ Atụrụ na okwu ọchịchị bishọp, Ut Vitam Habeant.",
    },
    Icon: Lamb,
  },
  {
    labelKey: "photoGallery",
    href: "/photo-gallery",
    description: {
      en: "A pastoral archive: feasts, visitations, and the daily life of the See.",
      ig: "Akwụkwọ akụkọ ọchịchị: ememme, nleta, na ndụ kwa ụbọchị nke Ocheeze.",
    },
    Icon: Dove,
  },
  {
    labelKey: "pastoralDiary",
    href: "/diary",
    description: {
      en: "Masses, visits, ordinations, and the liturgical year of the Archdiocese.",
      ig: "Mass, nleta, ịchụaja, na afọ ụka nke Archdiocese.",
    },
    Icon: Candle,
  },
];

const CONNECT_ITEMS: NavSubItem[] = [
  {
    labelKey: "appointments",
    href: "/appointments",
    description: {
      en: "Book a meeting with His Grace. Tuesdays for laity, Wednesdays for clergy.",
      ig: "Họrọ oge ka i kpọtụrụ Ọdaa. Tuesday maka ndị otu, Wednesday maka ndị ụkọchukwu.",
    },
    Icon: Mitre,
  },
  {
    labelKey: "prayerRequests",
    href: "/connect/prayer-requests",
    description: {
      en: "Submit an intention to be remembered at the cathedral altar.",
      ig: "Zipu arịrịọ ekpere ka e kpebata ya n'ebe ịchụ aja Cathedral.",
    },
    Icon: Chalice,
  },
  {
    labelKey: "contact",
    href: "/connect/contact",
    description: {
      en: "Write to the Office of His Grace for correspondence and inquiries.",
      ig: "Dee leta na Ụlọ Ọrụ Ọdaa: edemede na ajụjụ.",
    },
    Icon: Dove,
  },
  {
    labelKey: "newsletter",
    href: "/connect/newsletter",
    description: {
      en: "Pastoral letters and reflections delivered to your inbox.",
      ig: "Akwụkwọ ozi ọchịchị na ntụgharị uche n'ebe nnata ozi gị.",
    },
    Icon: ChiRho,
  },
];

const OTHER_LIBRARY: Array<{
  labelKey: keyof Dict["nav"];
  href: string;
  Icon: IconCmp;
}> = [
  { labelKey: "reflectionsAndHomilies", href: "/reflections", Icon: Dove },
  { labelKey: "easterAndChristmasMessages", href: "/messages", Icon: Candle },
  { labelKey: "otherTeachings", href: "/other-teachings", Icon: Keys },
];

export function MegaNav({
  letters,
  homilies,
  variant = "light",
  lang = "en",
}: {
  letters: LetterPreview[];
  homilies: HomilyPreview[];
  variant?: "light" | "dark";
  lang?: Lang;
}) {
  const pathname = usePathname();
  const t = getDict(lang);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : (pathname?.startsWith(href) ?? false);

  const linkBase =
    variant === "dark"
      ? "link-underline opacity-90 hover:opacity-100 hover:text-gold-soft"
      : "link-underline text-ink/85 hover:text-gold-text";
  const linkActive =
    variant === "dark"
      ? "link-underline text-gold-soft"
      : "link-underline text-gold-text";

  return (
    <nav
      aria-label={t.primaryNav}
      className="flex flex-1 items-stretch justify-center gap-4 font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[1.1px] max-lg:hidden lg:gap-5 xl:gap-9 xl:text-[12px] xl:tracking-[1.4px]"
    >
      {NAV.map((item) => {
        const active = isActive(item.href);
        const hasPanel = item.panel !== null;
        const fullLabel = t.nav[item.labelKey];
        const shortLabel = item.shortLabelKey ? t.nav[item.shortLabelKey] : undefined;
        return (
          <div
            key={item.href}
            className={
              hasPanel
                ? "mega-item flex items-center"
                : "flex items-center"
            }
          >
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              data-active={active ? "true" : undefined}
              className={`whitespace-nowrap py-5 ${active ? linkActive : linkBase}`}
            >
              {shortLabel ? (
                <>
                  <span className="xl:hidden">{shortLabel}</span>
                  <span className="hidden xl:inline">{fullLabel}</span>
                </>
              ) : (
                fullLabel
              )}
            </Link>

            {hasPanel ? (
              <div className="mega-panel absolute left-1/2 top-full z-40 w-screen -translate-x-1/2 pt-2">
                <div className="border-y border-[color:var(--rule)] bg-bone-deep shadow-[0_30px_60px_-20px_rgba(10,27,51,0.18)]">
                  <div className="mx-auto grid max-w-[1240px] gap-10 px-8 py-10 lg:px-10 xl:gap-14 xl:px-14 xl:py-14">
                    {item.panel === "about" ? <AboutPanel t={t} lang={lang} /> : null}
                    {item.panel === "library" ? (
                      <LibraryPanel letters={letters} t={t} lang={lang} />
                    ) : null}
                    {item.panel === "reflections" ? (
                      <ReflectionsPanel homilies={homilies} t={t} />
                    ) : null}
                    {item.panel === "connect" ? <ConnectPanel t={t} lang={lang} /> : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

// ───────────────────────── Panels ─────────────────────────────

function PanelHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-4 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text">
        <span aria-hidden className="block h-px w-9 bg-gold" />
        {eyebrow}
      </p>
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-[26px] font-medium leading-[1.1] text-ink xl:text-[32px]">
        {title}
      </h3>
      <p className="mt-3 font-[family-name:var(--font-display)] text-[15px] italic leading-[1.5] text-ink-soft xl:text-[17px]">
        {lead}
      </p>
    </div>
  );
}

function AboutPanel({ t, lang }: { t: Dict; lang: Lang }) {
  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_2fr] xl:gap-14">
      <PanelHeading
        eyebrow={t.panel.aboutEyebrow}
        title={t.panel.aboutTitle}
        lead={t.panel.aboutLead}
      />
      <ul className="grid grid-cols-2 gap-x-8 gap-y-5 xl:gap-x-10 xl:gap-y-6">
        {ABOUT_ITEMS.map((item) => {
          const Icon = item.Icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-start gap-4 border-t border-[color:var(--rule)] pt-5 transition-colors hover:border-gold"
              >
                <Icon
                  className="mt-1 h-5 w-5 flex-shrink-0 text-gold-text"
                  size={20}
                />
                <div>
                  <p className="font-[family-name:var(--font-display)] text-[19px] font-medium leading-[1.2] text-ink transition-colors group-hover:text-gold-text xl:text-[22px]">
                    {t.nav[item.labelKey]}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.5] text-ink-soft normal-case tracking-normal xl:text-[14px]">
                    {item.description[lang]}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LibraryPanel({ letters, t, lang }: { letters: LetterPreview[]; t: Dict; lang: Lang }) {
  const recent = letters.slice(0, 3);
  void lang; // reserved for future per-letter title localisation
  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_2fr] xl:gap-14">
      <div>
        <PanelHeading
          eyebrow={t.panel.libraryEyebrow}
          title={t.panel.libraryTitle}
          lead={t.panel.libraryLead}
        />
        <div className="mt-8 space-y-4">
          <Link
            href="/pastoral-letters"
            className="link-underline inline-flex font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
          >
            {t.panel.libraryBrowse}
          </Link>
          <div className="flex flex-col gap-3 border-t border-[color:var(--rule)] pt-4">
            {OTHER_LIBRARY.map((item) => {
              const Icon = item.Icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3"
                >
                  <Icon
                    className="h-4 w-4 text-gold-text opacity-70 group-hover:opacity-100"
                    size={16}
                  />
                  <span className="font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[1.8px] text-ink group-hover:text-gold-text">
                    {t.nav[item.labelKey]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <ul className="grid grid-cols-3 gap-6 max-md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {recent.map((letter) => (
          <li key={letter.id}>
            <Link
              href={`/pastoral-letters/${letter.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone">
                {letter.cover ? (
                  <Image
                    src={letter.cover}
                    alt={letter.title}
                    fill
                    sizes="(max-width: 1280px) 30vw, 200px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>
              {letter.year ? (
                <p className="mt-4 font-[family-name:var(--font-ui)] text-[9px] font-semibold uppercase tracking-[2px] text-gold-text">
                  {t.panel.libraryTitle} · {letter.year}
                </p>
              ) : null}
              <p className="mt-2 font-[family-name:var(--font-display)] text-[16px] font-medium normal-case tracking-normal leading-[1.2] text-ink transition-colors group-hover:text-gold-text xl:text-[18px]">
                {letter.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReflectionsPanel({ homilies, t }: { homilies: HomilyPreview[]; t: Dict }) {
  const recent = homilies.slice(0, 4);
  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_2fr] xl:gap-14">
      <div>
        <PanelHeading
          eyebrow={t.panel.reflectionsEyebrow}
          title={t.panel.reflectionsTitle}
          lead={t.panel.reflectionsLead}
        />
        <Link
          href="/reflections"
          className="link-underline mt-8 inline-flex font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
        >
          {t.panel.reflectionsBrowse}
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-x-8 gap-y-5 xl:gap-x-10 xl:gap-y-6">
        {recent.map((h) => (
          <li key={h.id}>
            <Link
              href={`/reflections/${h.slug}`}
              className="group block border-t border-[color:var(--rule)] pt-5"
            >
              {h.occasion ? (
                <p className="font-[family-name:var(--font-ui)] text-[9px] font-semibold uppercase tracking-[2px] text-gold-text">
                  {h.occasion}
                </p>
              ) : null}
              <p className="mt-2 font-[family-name:var(--font-display)] text-[16px] font-medium normal-case tracking-normal leading-[1.2] text-ink transition-colors group-hover:text-gold-text xl:text-[18px]">
                {h.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConnectPanel({ t, lang }: { t: Dict; lang: Lang }) {
  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_2fr] xl:gap-14">
      <PanelHeading
        eyebrow={t.panel.connectEyebrow}
        title={t.panel.connectTitle}
        lead={t.panel.connectLead}
      />
      <ul className="grid grid-cols-2 gap-6 max-md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 xl:gap-8">
        {CONNECT_ITEMS.map((item) => {
          const Icon = item.Icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group block border-t border-[color:var(--rule)] pt-5 transition-colors hover:border-gold"
              >
                <Icon className="h-6 w-6 text-gold-text" size={24} />
                <p className="mt-4 font-[family-name:var(--font-display)] text-[19px] font-medium leading-[1.2] text-ink transition-colors group-hover:text-gold-text xl:text-[22px]">
                  {t.nav[item.labelKey]}
                </p>
                <p className="mt-2 text-[13px] leading-[1.5] text-ink-soft normal-case tracking-normal xl:text-[14px]">
                  {item.description[lang]}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
