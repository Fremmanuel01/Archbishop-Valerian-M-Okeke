# CLAUDE.md — Archbishop Valerian M. Okeke

Operating context for Claude / AI agents working in this repository.
**Read this before doing anything.**

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
| 3 — Design system in code | ⏳ Next | Port mockup tokens into Tailwind v4 theme + shadcn |
| 4 — Next.js scaffold | ✅ Bootstrapped | `web/` exists, no shadcn/components yet |
| 5 — Page implementation | ⏳ Pending | |
| 6 — CMS integration | ⏳ Pending | Pull from existing Archbishop Library API |
| 7 — GitHub repo + deploy | ✅ Done | GitHub: `Fremmanuel01/Archbishop-Valerian-M-Okeke` (public). Vercel project: `emmanuel-nwabufos-projects/archbishop-valerian-m-okeke` (Deployment Protection disabled — public). Live: <https://archbishop-valerian-m-okeke.vercel.app>. |
| 8 — CMS admin dashboard  | ⏳ Future | Edit site content (programme, biography, reflections) from one panel. Writes to the same backend that Phases 5–6 read from via `src/lib/*.ts`. |

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
└── web/                       ← Next.js 16 app (NOT yet styled)
    ├── package.json
    ├── src/app/                     (default Next.js scaffold, untouched)
    ├── tsconfig.json
    └── …
```

**Hard rule**: nothing in `scraped/` is hand-authored. Re-run
`node scripts/scrape.js` to refresh.

---

## Tech stack (locked unless user says otherwise)

- **Framework**: Next.js 16 (App Router, Turbopack) in `web/`
- **Language**: TypeScript, strict
- **Styling**: Tailwind CSS v4 (`@theme inline` tokens, no `tailwind.config.ts`)
- **Components**: shadcn/ui (Radix base, `new-york` style) — **not yet installed**
- **Fonts**: Loaded via `next/font` (Google Fonts)
- **Deployment target**: Vercel (Fluid Compute, default)
- **CMS data source**: existing Archbishop Library API at
  `https://peachpuff-tiger-996145.hostingersite.com/api/{pastoral-letters,homilies,writings}` —
  read-only consumption from this site.
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

- **No emoji as icons.** Use SVG (`lucide-react` once shadcn is installed) or
  inline `<svg>`. The Latin cross `✠` character is forbidden — use the inline
  SVG path from `docs/mockups/homepage-v1.html` (the footer watermark).
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

1. GitHub repo: name `Archbishop-Valerian-M-Okeke`, public or **private**?
2. Newsletter provider (Resend? ConvertKit? none?)
3. Prayer-request submissions — store in CMS DB, email only, or third-party form?
4. Should the site be **bilingual** English + Igbo eventually?
5. The 5 pastoral letters with no original cover (IDs 2, 4, 5, 6, 22 in the
   live CMS) — extract first page of PDF or wait for re-upload?
6. Hero photo for the homepage — current mockup uses a gold-vestments
   cathedraticum shot. Should we commission proper portraits?

---

## What NOT to do without asking

- Run `git push` to anywhere (no remote exists yet)
- Run `vercel link` / deploy commands
- Install large UI libraries other than shadcn/ui
- Touch the existing `Achbishop's library` project (sibling folder, separate)
- Re-run `scripts/scrape.js` against the live legacy site (rate-limit caution)
- Edit anything in `scraped/` by hand
- Delete the homepage mockup HTML — it's the canonical design reference until
  we ship Phase 3

---

## Useful commands

```bash
# Re-run the legacy scraper
node scripts/scrape.js
node scripts/scrape.js --limit 5      # quick test

# Start the Next.js dev server
cd web && npm run dev

# Re-render the homepage mockup screenshot (requires playwright from sibling repo)
node /tmp/snap-onitsha.js             # legacy temp script — should be moved to docs/mockups/
```

---

## Sibling repo (not part of this project)

`/Users/emmanuelnwabufo/Achbishop's library/` — the existing CMS that powers
the API we'll consume. Has its own `CLAUDE.md` (or should). Do not modify it
from this project. The cover-enhancer pipeline and admin UI live there.
