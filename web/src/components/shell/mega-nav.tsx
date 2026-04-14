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
  label: string;
  href: string;
  panel: PanelKind;
};

const NAV: NavItem[] = [
  { label: "About His Grace", href: "/biography", panel: "about" },
  { label: "Pastoral Letters", href: "/pastoral-letters", panel: "library" },
  { label: "Reflections", href: "/reflections", panel: "reflections" },
  { label: "Diary", href: "/diary", panel: null },
  { label: "Connect", href: "/connect", panel: "connect" },
];

const ABOUT_ITEMS: Array<{
  label: string;
  href: string;
  description: string;
  Icon: IconCmp;
}> = [
  {
    label: "Biography",
    href: "/biography",
    description:
      "The life and ministry of His Grace — from Amesi to the Metropolitan See.",
    Icon: Crozier,
  },
  {
    label: "His Episcopacy",
    href: "/his-episcopacy",
    description:
      "The missionary apostolate: education, prison ministry, riverine evangelisation.",
    Icon: Mitre,
  },
  {
    label: "Coat of Arms",
    href: "/coat-of-arms",
    description: "The Good Shepherd and the episcopal motto — Ut Vitam Habeant.",
    Icon: Lamb,
  },
  {
    label: "Photo Gallery",
    href: "/photo-gallery",
    description:
      "A pastoral archive — feasts, visitations, and the daily life of the See.",
    Icon: Dove,
  },
  {
    label: "Pastoral Diary",
    href: "/diary",
    description:
      "Masses, visits, ordinations, and the liturgical year of the Archdiocese.",
    Icon: Candle,
  },
];

const CONNECT_ITEMS: Array<{
  label: string;
  href: string;
  description: string;
  Icon: IconCmp;
}> = [
  {
    label: "Prayer Requests",
    href: "/connect/prayer-requests",
    description: "Submit an intention to be remembered at the cathedral altar.",
    Icon: Chalice,
  },
  {
    label: "Contact",
    href: "/connect/contact",
    description: "Write to the Office of His Grace — correspondence and inquiries.",
    Icon: Dove,
  },
  {
    label: "Newsletter",
    href: "/connect/newsletter",
    description: "Pastoral letters and reflections delivered to your inbox.",
    Icon: ChiRho,
  },
];

const OTHER_LIBRARY: Array<{
  label: string;
  href: string;
  Icon: IconCmp;
}> = [
  { label: "Reflections & Homilies", href: "/reflections", Icon: Dove },
  { label: "Easter & Christmas Messages", href: "/messages", Icon: Candle },
  { label: "Other Teachings", href: "/other-teachings", Icon: Keys },
];

export function MegaNav({
  letters,
  homilies,
  variant = "light",
}: {
  letters: LetterPreview[];
  homilies: HomilyPreview[];
  variant?: "light" | "dark";
}) {
  const pathname = usePathname();
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
      aria-label="Primary"
      className="flex flex-1 items-stretch justify-center gap-9 font-[family-name:var(--font-ui)] text-[12px] font-medium uppercase tracking-[1.4px] max-xl:hidden"
    >
      {NAV.map((item) => {
        const active = isActive(item.href);
        const hasPanel = item.panel !== null;
        return (
          <div
            key={item.href}
            className={
              hasPanel
                ? "mega-item relative flex items-center"
                : "relative flex items-center"
            }
          >
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              data-active={active ? "true" : undefined}
              className={`py-5 ${active ? linkActive : linkBase}`}
            >
              {item.label}
            </Link>

            {hasPanel ? (
              <div className="mega-panel absolute left-1/2 top-full z-40 w-screen -translate-x-1/2 pt-2">
                <div className="border-y border-[color:var(--rule)] bg-bone-deep shadow-[0_30px_60px_-20px_rgba(10,27,51,0.18)]">
                  <div className="mx-auto grid max-w-[1240px] gap-14 px-14 py-14 max-lg:px-8">
                    {item.panel === "about" ? <AboutPanel /> : null}
                    {item.panel === "library" ? (
                      <LibraryPanel letters={letters} />
                    ) : null}
                    {item.panel === "reflections" ? (
                      <ReflectionsPanel homilies={homilies} />
                    ) : null}
                    {item.panel === "connect" ? <ConnectPanel /> : null}
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
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-[32px] font-medium leading-[1.1] text-ink">
        {title}
      </h3>
      <p className="mt-3 font-[family-name:var(--font-display)] text-[17px] italic leading-[1.5] text-ink-soft">
        {lead}
      </p>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-14 max-lg:grid-cols-1">
      <PanelHeading
        eyebrow="About His Grace"
        title="A Life in the Lord's Vineyard"
        lead="Shepherd, teacher, and servant of the Church of Onitsha."
      />
      <ul className="grid grid-cols-2 gap-x-10 gap-y-6">
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
                  <p className="font-[family-name:var(--font-display)] text-[22px] font-medium leading-[1.2] text-ink transition-colors group-hover:text-gold-text">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[14px] leading-[1.5] text-ink-soft normal-case tracking-normal">
                    {item.description}
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

function LibraryPanel({ letters }: { letters: LetterPreview[] }) {
  const recent = letters.slice(0, 3);
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-14 max-lg:grid-cols-1">
      <div>
        <PanelHeading
          eyebrow="The Library"
          title="Pastoral Letters"
          lead="Twenty-four years of teaching — the annual letters of His Grace."
        />
        <div className="mt-8 space-y-4">
          <Link
            href="/pastoral-letters"
            className="link-underline inline-flex font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
          >
            Browse all letters →
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
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <ul className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
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
                    sizes="200px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>
              {letter.year ? (
                <p className="mt-4 font-[family-name:var(--font-ui)] text-[9px] font-semibold uppercase tracking-[2px] text-gold-text">
                  Pastoral Letter · {letter.year}
                </p>
              ) : null}
              <p className="mt-2 font-[family-name:var(--font-display)] text-[18px] font-medium normal-case tracking-normal leading-[1.2] text-ink transition-colors group-hover:text-gold-text">
                {letter.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReflectionsPanel({ homilies }: { homilies: HomilyPreview[] }) {
  const recent = homilies.slice(0, 4);
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-14 max-lg:grid-cols-1">
      <div>
        <PanelHeading
          eyebrow="Homilies & Reflections"
          title="Spoken from the Cathedra"
          lead="Homilies at solemnities, feasts, and ordinary time."
        />
        <Link
          href="/reflections"
          className="link-underline mt-8 inline-flex font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
        >
          Browse all reflections →
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-x-10 gap-y-6">
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
              <p className="mt-2 font-[family-name:var(--font-display)] text-[18px] font-medium normal-case tracking-normal leading-[1.2] text-ink transition-colors group-hover:text-gold-text">
                {h.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConnectPanel() {
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-14 max-lg:grid-cols-1">
      <PanelHeading
        eyebrow="Domus Episcopalis"
        title="Connect with His Grace"
        lead="Correspondence, prayer intentions, and quiet communion."
      />
      <ul className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
        {CONNECT_ITEMS.map((item) => {
          const Icon = item.Icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group block border-t border-[color:var(--rule)] pt-5 transition-colors hover:border-gold"
              >
                <Icon className="h-6 w-6 text-gold-text" size={24} />
                <p className="mt-4 font-[family-name:var(--font-display)] text-[22px] font-medium leading-[1.2] text-ink transition-colors group-hover:text-gold-text">
                  {item.label}
                </p>
                <p className="mt-2 text-[14px] leading-[1.5] text-ink-soft normal-case tracking-normal">
                  {item.description}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
