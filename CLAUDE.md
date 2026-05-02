# CLAUDE.md — Archbishop Valerian M. Okeke

Operating context for Claude / AI agents working in this repository.
**Read this before doing anything.**

> **Heads-up:** `web/AGENTS.md` (re-exported as `web/CLAUDE.md`) warns:
> *"This is NOT the Next.js you know — APIs, conventions, and file structure may
> differ from your training data. Read the relevant guide in
> `web/node_modules/next/dist/docs/` before writing any code."* Heed it before
> reaching for App Router patterns from memory.

---

## What this project is

Personal website for **His Grace Most Rev. Valerian Maduka Okeke**, Metropolitan
Archbishop of Onitsha. This is a *personal* site for the Archbishop himself —
**not** the Archdiocese institutional site. Audience is global Catholic readers,
the Onitsha faithful, journalists, and visitors interested in his pastoral
letters, homilies, and ministry.

**Brand intent:** modern, Catholic, premium, expensive, editorial. Closer to
Vatican News / Word on Fire / Hallow than to a parish portal. Restraint over
ornament. Light mode only.

---

## Where we are right now

| Phase | Status | Notes |
|---|---|---|
| 0 — Content scraping | ✅ Done | 111 pages, 63 images, 20 PDFs from `archbishopvalokeke.org` |
| 1 — Design exploration | ✅ Done | Design system locked, homepage mockup approved |
| 2 — Sitemap / IA | ✅ Drafted | See "IA" below — not yet finalised |
| 3 — Design system in code | ✅ Done | Tokens live in `web/src/app/globals.css`; shadcn was **not** installed — components are hand-built in `web/src/components/` |
| 4 — Next.js scaffold | ✅ Done | Next.js 16 App Router with Turbopack, Tailwind v4, `next/font` |
| 5 — Page implementation | ✅ Done | Routes: `biography`, `coat-of-arms`, `connect`, `diary`, `his-episcopacy`, `messages`, `other-teachings`, `pastoral-letters`, `pastoral-visits`, `photo-gallery`, `reflections` |
| 6 — CMS integration | ✅ Done | `web/src/lib/cms.ts` reads pastoral letters / homilies / writings from the Archbishop Library API |
| 7 — GitHub repo + deploy | ✅ Done | GitHub: `Fremmanuel01/Archbishop-Valerian-M-Okeke` (public). Vercel project: `emmanuel-nwabufos-projects/archbishop-valerian-m-okeke` (Deployment Protection disabled — public). Live: <https://archbishop-valerian-m-okeke.vercel.app>. |
| 8 — CMS admin dashboard  | 🚧 In progress | Payload CMS 3.82 mounted at `(payload)/admin` with Postgres. Collections: `Users`, `Media`, `DiaryEntries`, `PastoralVisits`, `GalleryImages`, `BiographySections`. Globals: `Homepage`, `Programme`. Storefront pages still mostly read static data — wiring them through Payload is the open work. |

**The latest approved artifact** is the homepage mockup at:
- `docs/mockups/homepage-v1.html`
- `docs/mockups/homepage-v1-hero.png`
- `docs/mockups/homepage-v1-full.png`

Note: `homepage-v1.html` references three photos at `file:///tmp/hero.jpg`,
`/tmp/portrait.jpg`, `/tmp/diary.jpg` — those are temp paths from the screenshot
session. The screenshots are the canonical record; the HTML is for porting
reference, not for re-rendering as-is.

---

## Folder structure

```
Archbishop-Valerian-M-Okeke/
├── CLAUDE.md                  ← you are here
├── README.md
├── package.json               ← scraper deps only (cheerio, turndown)
├── docs/
│   └── mockups/
│       ├── homepage-v1.html         (approved design reference)
│       ├── homepage-v1-hero.png
│       └── homepage-v1-full.png
├── scraped/                   ← Phase 0 output, do not edit by hand
│   ├── inventory.json               (master index of every page + asset)
│   ├── raw/                         (111 raw HTML snapshots)
│   ├── text/                        (111 markdown files w/ frontmatter)
│   ├── images/                      (63 downloaded images)
│   ├── pdfs/                        (20 downloaded pastoral letters / docs)
│   └── videos/                      (empty — only 1 embed catalogued in inventory)
├── scripts/
│   └── scrape.js                    (the scraper — re-runnable)
└── web/                       ← Next.js 16 app (the deployable site)
    ├── AGENTS.md / CLAUDE.md        (read first — Next.js may not match training data)
    ├── package.json
    ├── next.config.ts               (wraps config with `withPayload`, sets image hosts + security headers)
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx, page.tsx, globals.css, sitemap.ts, robots.ts
    │   │   ├── (payload)/           Payload admin route group
    │   │   │   ├── admin/[[...segments]]/   admin UI
    │   │   │   ├── api/[...slug]/           Payload REST API
    │   │   │   ├── api/graphql, api/graphql-playground
    │   │   │   ├── custom.scss
    │   │   │   └── layout.tsx
    │   │   └── biography, coat-of-arms, connect, diary, his-episcopacy,
    │   │       messages, other-teachings, pastoral-letters, pastoral-visits,
    │   │       photo-gallery, reflections    (storefront routes)
    │   ├── components/              hand-built (no shadcn)
    │   │   ├── home/                hero, daily-reflection, pastoral-diary, …
    │   │   ├── shell/               app-header, mega-nav, nav-overlay, page-shell
    │   │   ├── prose.tsx            sanitised HTML/Markdown renderer
    │   │   ├── connect-forms.tsx, form.tsx, letter-toc.tsx, reading-progress.tsx,
    │   │   │   reveal.tsx, smooth-scroll.tsx, editorial.tsx, crest.tsx, icons.tsx,
    │   │   │   animated-name.tsx
    │   ├── data/                    static content (e.g. pastoral-programme.ts)
    │   ├── lib/
    │   │   ├── cms.ts               read-only client for Archbishop Library API
    │   │   ├── resend.ts            transactional email
    │   │   ├── programme.ts         data-access layer (currently static, designed to swap to CMS)
    │   │   ├── gallery.ts, gallery.json, featured-videos.ts
    │   ├── payload/
    │   │   ├── collections/         Users, Media, DiaryEntries, PastoralVisits,
    │   │   │                        GalleryImages, BiographySections
    │   │   └── globals/             Homepage, Programme
    │   └── payload.config.ts        Postgres adapter, Lexical editor, Sharp
    └── tsconfig.json
```

**Hard rule**: nothing in `scraped/` is hand-authored. Re-run
`node scripts/scrape.js` to refresh.

---

## Tech stack (locked unless user says otherwise)

- **Framework**: Next.js 16 (App Router, Turbopack), React 19 — in `web/`
- **Language**: TypeScript, strict
- **Styling**: Tailwind CSS v4 (`@theme inline` tokens in `src/app/globals.css`, no `tailwind.config.ts`)
- **Components**: hand-built in `src/components/` — **shadcn was never installed**. Don't reach for `lucide-react` or shadcn primitives without checking; use inline SVG (see `src/components/icons.tsx`, `crest.tsx`).
- **Fonts**: Loaded via `next/font/google` in `src/app/layout.tsx`
- **Admin CMS** (this repo): Payload CMS 3.82 (`@payloadcms/next`) mounted under `(payload)/admin`, with `@payloadcms/db-postgres` and Lexical editor. Image processing via `sharp`.
- **External CMS data source** (read-only): Archbishop Library API at
  `https://peachpuff-tiger-996145.hostingersite.com/api/{pastoral-letters,homilies,writings}` — fetched in `src/lib/cms.ts` with `next: { revalidate: 3600 }`.
- **Email**: Resend (`src/lib/resend.ts`) for the Connect / prayer-request / contact forms.
- **Prose rendering**: `marked` + `sanitize-html` (see `src/components/prose.tsx`).
- **Smooth scroll / motion**: `lenis` (see `src/components/smooth-scroll.tsx`, `reveal.tsx`).
- **Telemetry**: `@vercel/analytics` and `@vercel/speed-insights`.
- **Deployment target**: Vercel (Fluid Compute, default). Root directory: `web`.
- **Node version**: 20.x (project defaults to whatever's installed; CI not set up yet)

---

## Locked design system

Cross-checked against the `ui-ux-pro-max` skill database. The skill suggested
"Liquid Glass" — **explicitly rejected** as wrong for the brand. Editorial
flat-luxury is the correct direction.

### Colors (CSS custom properties)

```css
--ink:        #0A1B33;   /* Dark navy — text, dark CTAs, hero overlay */
--ink-soft:   #1F3354;   /* Secondary text */
--bone:       #F7F4EE;   /* Page background — warm off-white, NOT pure white */
--bone-deep:  #EFEAE0;   /* Tonal band 2 — daily reflection, diary */
--tan:        #E6DFCD;   /* Tonal band 3 — footer */
--gold:       #B08840;   /* Single accent — links, dividers, CTAs, marks */
--gold-soft:  #C9A664;   /* Lighter gold for dark backgrounds */
--purple:     #3A1F4D;   /* Cardinal purple — sparingly, for Lent / contemplative */
--stone:      #D9D2C2;   /* Borders, hairline rules */
--rule:       rgba(176,136,64,0.35);  /* Gold hairline rules */
```

**No dark mode.** Site is light-only. Tonal hierarchy comes from the three
warm bone tones, never from darkening.

### Typography

- **Display heading**: `Cormorant Garamond` (weights 400, 500, 600, 700 + italics) — italic for accent words
- **Body**: `EB Garamond` (400, 500, 600, italic 400) — for pastoral letter prose
- **UI / labels / nav / buttons**: `Inter` (400, 500, 600) — for everything chrome
- All loaded via `next/font/google` in `web/src/app/layout.tsx`
- Use **literal font names** in `@theme inline` (not `var(--font-…)`) — see Next.js
  + Tailwind v4 + shadcn gotcha in the shadcn skill docs
- Body size **18px** desktop / **17px** mobile minimum
- Line-height 1.7 for body, 1.05–1.3 for display
- Numerals: tabular figures for dates/scripture refs

### Spacing & layout

- Page rhythm: very generous. Section padding ~140px desktop / 80px mobile
- Container max-width: ~1240px
- Grid: 12-col, 24px gutter
- Hairline rules: 1px gold at 35% opacity, never thick borders
- Radius: cards 0px (editorial flat) — no rounded book/photo containers
- Drop shadows allowed only on the book mockups and the hero photo

### Signature design moves

These are the things that make it feel "expensive". Every page should use
**at least one**:
1. Roman numerals for dates and chapter marks (`MMXXVI`) — but wrap in
   `<abbr title="2026">` for screen readers
2. Latin liturgical phrases as section eyebrows (`Ut Vitam Habeant`)
3. Italic + gold for accent words inside display headings
4. Hairline gold rules between sections (1px at 35% opacity)
5. Large faded typographic watermarks as background texture (Roman numerals,
   the diocesan crest, the Latin cross)
6. Section labels: small uppercase Inter with a 36px gold rule prefix
7. Photography always full-bleed or generously framed — never tight crops

### Anti-patterns (do not do these)

- Stock religious imagery, clipart crosses
- Multi-color gradients, glassmorphism, neumorphism
- Carousels, autoplay video, popups
- Live counters / "join 5000 followers"
- Cluttered footers
- Cinzel as a body or heading font (rejected — looks "ugly" per user feedback)
- Playfair Display (rejected — Cormorant Garamond is the locked display face, softer and more editorial)
- Pure white backgrounds (use `--bone` instead)
- Dark sections (user explicitly rejected dark mode)
- Tailwind palette `slate-*` / `zinc-*` for foundational surfaces — use the tokens above

---

## Information architecture (draft, not yet finalised)

```
Home
├── About His Grace
│    ├── Biography
│    ├── Episcopal Ministry
│    ├── Coat of Arms
│    └── Photo Gallery
├── Pastoral Letters       (anchor of the site — pull from CMS API)
├── Reflections & Homilies (pull from CMS API)
├── Other Teachings        (pull from CMS API)
├── News & Diary           (recent appointments, visits, addresses — from scraped/)
├── Pastoral Visits        (visual timeline)
└── Connect
     ├── Prayer requests
     ├── Contact
     └── Newsletter
```

Optional later: Multimedia, Vocations.

---

## Content sources

1. **Live CMS** (preferred for letters/homilies/writings):
   `https://peachpuff-tiger-996145.hostingersite.com/api/...`
   - `/pastoral-letters` — 24 letters, all with restored 1200×1500 cover mockups
   - `/homilies`
   - `/writings`
2. **Scraped legacy** (for biography text, photo gallery, news, diary entries):
   `scraped/inventory.json` — has every page's title, slug, markdown body,
   image references, PDF references, external links

When porting content, prefer **live API** for anything that changes; use
**scraped markdown** only for the static biographical / archival material that
won't change.

---

## Conventions

- **No emoji as icons.** Use inline `<svg>` (see `src/components/icons.tsx` and
  `crest.tsx`). The Latin cross `✠` character is forbidden — use the inline SVG
  path from `docs/mockups/homepage-v1.html` (the footer watermark).
- **Roman numerals must be wrapped** in `<abbr title="...">` for screen readers
- **Latin tag/heading text** must be wrapped in `<span lang="la">` so screen
  readers don't pronounce it as English
- All Pastoral Letter book images are at fixed **1200 × 1500** Cloudinary URLs
  (`crop: pad, background: white`) — already standardised from the other repo
- Strict TypeScript, no `any`
- Server Components by default; only `'use client'` when actually needed
- Async `params` / `searchParams` (Next.js 15+ pattern)
- Use `next/image` for all images (never `<img>`)
- Use `next/font` for all fonts (no `@import url(...)` in CSS)

---

## Open questions / decisions still owed to the user

1. Should the site be **bilingual** English + Igbo eventually?
2. The 5 pastoral letters with no original cover (IDs 2, 4, 5, 6, 22 in the
   live CMS) — extract first page of PDF or wait for re-upload?
3. Hero photo for the homepage — current mockup uses a gold-vestments
   cathedraticum shot. Should we commission proper portraits?
4. Phase 8 hand-off: which storefront pages migrate from static `src/data/` /
   the legacy Archbishop Library API to Payload first? (Programme is the
   obvious first candidate — the data-access layer in `src/lib/programme.ts`
   already anticipates the swap.)

*(Resolved earlier: repo is public; Resend chosen for forms / email; Phase 7 deploy live.)*

---

## What NOT to do without asking

- Push to `main` or any remote branch without explicit instruction
- Add `Co-Authored-By: Claude` (or any Claude attribution) to commits or PRs
- Run `vercel link` / deploy / promote commands
- Install large UI libraries (shadcn was deliberately skipped — confirm before adding one now)
- Touch the existing `Achbishop's library` project (sibling folder, separate)
- Re-run `scripts/scrape.js` against the live legacy site (rate-limit caution)
- Edit anything in `scraped/` by hand
- Delete the homepage mockup HTML — it remains the canonical design reference

---

## Useful commands

```bash
# --- Storefront / Next.js (run from web/) ---
cd web
npm install
npm run dev          # start dev server on http://localhost:3000
npm run build        # production build (also validates Payload + types)
npm run start        # run the built app
npm run lint         # eslint (eslint-config-next)

# --- Payload CMS admin (run from web/) ---
npm run payload                  # Payload CLI (e.g. `npm run payload migrate`)
npm run generate:types           # writes web/src/payload/payload-types.ts
npm run generate:importmap       # regenerate the admin importMap

# --- Legacy scraper (run from repo root) ---
node scripts/scrape.js
node scripts/scrape.js --limit 5     # quick test
```

### Required environment variables (`web/.env.local`)

- `PAYLOAD_SECRET` — required for Payload session signing
- One of `DATABASE_URL_UNPOOLED`, `POSTGRES_URL_NON_POOLING`, `DATABASE_URL`,
  or `POSTGRES_URL` — Postgres connection string (Payload prefers the unpooled
  variant). See `web/src/payload.config.ts`.
- `RESEND_API_KEY` — required for the Connect / contact / prayer-request forms
- `RESEND_FROM` (optional) — defaults to `Archbishop's Office <onboarding@resend.dev>`

---

## Sibling repo (not part of this project)

`/Users/emmanuelnwabufo/Achbishop's library/` — the existing CMS that powers
the API we'll consume. Has its own `CLAUDE.md` (or should). Do not modify it
from this project. The cover-enhancer pipeline and admin UI live there.
