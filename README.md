# Archbishop Valerian M. Okeke — Personal Website

The personal website of **His Grace Most Rev. Valerian Maduka Okeke**, Metropolitan Archbishop of Onitsha.

Editorial, Catholic, premium, light-mode. Not the Archdiocese institutional site — this is the personal site of His Grace.

## Structure

```
Archbishop-Valerian-M-Okeke/
├── web/                    Next.js 16 app — the deployable website
├── docs/mockups/           Design reference (approved homepage HTML + screenshots)
├── scraped/                Legacy content scraped from archbishopvalokeke.org
│   ├── inventory.json      Master index of every scraped page + asset
│   └── text/               Extracted page content as markdown (binary assets gitignored)
└── scripts/
    └── scrape.js           Re-runnable legacy scraper
```

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript, strict
- **Styling**: Tailwind CSS v4 (`@theme inline` tokens in `web/src/app/globals.css`)
- **Fonts**: Cormorant Garamond (display) · EB Garamond (body) · Inter (UI) — via `next/font/google`
- **Content**: Live CMS at the Archbishop Library API (pastoral letters, homilies, writings); static data for biography, programme, coat of arms, episcopacy
- **Deployment**: Vercel (root directory: `web`)

## Development

```bash
cd web
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Build

```bash
cd web
npm run build
```

## Conventions

See `CLAUDE.md` at the repo root for the authoritative project operating guide — design tokens, typography, palette, content sources, open questions, and hard rules are all there.
