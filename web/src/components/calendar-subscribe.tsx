"use client";

import { useEffect, useState } from "react";

const FEED_PATH = "/programme.ics";

type Origin = { protocol: string; host: string; href: string };

function readOrigin(): Origin {
  if (typeof window === "undefined") {
    return { protocol: "https:", host: "", href: FEED_PATH };
  }
  return {
    protocol: window.location.protocol,
    host: window.location.host,
    href: `${window.location.origin}${FEED_PATH}`,
  };
}

function googleSubscribeUrl(href: string): string {
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(href)}`;
}

function outlookSubscribeUrl(href: string): string {
  const params = new URLSearchParams({
    url: href,
    name: "Pastoral Programme",
  });
  return `https://outlook.live.com/calendar/0/addfromweb?${params.toString()}`;
}

function appleSubscribeUrl(host: string): string {
  // webcal:// is the universal "subscribe to this URL" handler — Apple
  // Calendar, most third-party iOS apps, and Outlook desktop all
  // intercept it and present the subscribe dialog.
  return `webcal://${host}${FEED_PATH}`;
}

export function CalendarSubscribe() {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin>({
    protocol: "https:",
    host: "",
    href: FEED_PATH,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(readOrigin());
  }, []);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(origin.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available — user can long-press and copy from the field */
    }
  }

  return (
    <section
      aria-label="Subscribe to the Pastoral Programme"
      className="relative mx-auto mb-16 max-w-[840px] border border-[color:var(--rule)] bg-bone-deep p-10 max-md:mb-12 max-md:p-6"
    >
      <span
        aria-hidden
        className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-gold"
      />
      <span
        aria-hidden
        className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-gold"
      />

      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div className="max-w-[480px]">
          <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
            Sync · Subscribe
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(28px,3vw,40px)] font-medium leading-[1.1] text-ink">
            Add the entire programme to your calendar
          </h2>
          <p className="mt-3 font-[family-name:var(--font-display)] text-[18px] italic leading-[1.55] text-ink-soft">
            Subscribe once. Every Mass, visit, ordination, and meeting is added,
            and your calendar refreshes whenever the office updates the
            programme.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={{ ["--sweep-color" as string]: "#c9a664" }}
          className="btn-ink btn-sweep"
        >
          {open ? "Hide options ↑" : "Sync to Calendar →"}
        </button>
      </div>

      {open ? (
        <div className="mt-8 grid grid-cols-2 gap-3 max-md:grid-cols-1">
          <SubscribeButton
            label="Google Calendar"
            sub="Opens add-by-URL flow"
            href={googleSubscribeUrl(origin.href)}
            external
          />
          <SubscribeButton
            label="Apple Calendar"
            sub="Subscribes via webcal://"
            href={appleSubscribeUrl(origin.host)}
          />
          <SubscribeButton
            label="Outlook"
            sub="Add to Outlook on the web"
            href={outlookSubscribeUrl(origin.href)}
            external
          />
          <SubscribeButton
            label="Download .ics"
            sub="One-time import"
            href={FEED_PATH}
            download="pastoral-programme.ics"
          />

          <div className="col-span-2 flex flex-wrap items-center gap-3 border-t border-[color:var(--rule)] pt-5 max-md:col-span-1">
            <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
              Or copy the feed URL
            </p>
            <input
              readOnly
              value={origin.href}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-[220px] flex-1 border border-stone bg-bone px-3 py-2 font-mono text-[12px] text-ink-soft focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={copyUrl}
              className="border border-[color:var(--rule)] bg-bone px-4 py-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[1.6px] text-ink transition-colors hover:border-gold hover:text-gold"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="col-span-2 text-[12px] leading-[1.6] text-ink-soft max-md:col-span-1">
            Your calendar app will refresh roughly every hour. Cancellations
            and additions made by the office propagate automatically; no
            re-subscribing.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function SubscribeButton({
  label,
  sub,
  href,
  external,
  download,
}: {
  label: string;
  sub: string;
  href: string;
  external?: boolean;
  download?: string;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={download}
      className="group flex items-center justify-between border border-[color:var(--rule)] bg-bone px-5 py-4 transition-colors hover:border-gold hover:bg-bone-deep"
    >
      <div>
        <p className="font-[family-name:var(--font-display)] text-[18px] font-medium leading-[1.2] text-ink transition-colors group-hover:text-gold">
          {label}
        </p>
        <p className="mt-1 text-[12px] text-ink-soft">{sub}</p>
      </div>
      <span
        aria-hidden
        className="font-[family-name:var(--font-ui)] text-[14px] text-gold opacity-60 transition-opacity group-hover:opacity-100"
      >
        →
      </span>
    </a>
  );
}
