---
name: Archbishop Valerian M. Okeke
description: The personal site of His Grace Most Rev. Valerian Maduka Okeke, Metropolitan Archbishop of Onitsha — a reading-first home for his pastoral letters, homilies, and ministry.
colors:
  ink: "#0A1B33"
  ink-soft: "#1F3354"
  bone: "#F7F4EE"
  bone-deep: "#EFEAE0"
  tan: "#E6DFCD"
  gold: "#B08840"
  gold-text: "#8A6A2E"
  gold-soft: "#C9A664"
  purple: "#3A1F4D"
  stone: "#D9D2C2"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(30px, 3.5vw, 42px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.25em"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-letter:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.2em"
rounded:
  none: "0px"
  hairline: "1px"
spacing:
  hairline: "1px"
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "80px"
  section-mobile: "80px"
  section-desktop: "140px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
    height: "48px"
  button-ink-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
  link-underline:
    textColor: "inherit"
    typography: "{typography.body}"
  letter-blockquote:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.headline}"
    padding: "3.2px 0 3.2px 25.6px"
  numbered-paragraph-marker:
    textColor: "{colors.gold-text}"
    typography: "{typography.label}"
    padding: "0"
---

# Design System: Archbishop Valerian M. Okeke

## 1. Overview

**Creative North Star: "The Pastoral Lectern."**

The site reads like a leather-bound book lifted from a chancery library and laid open on a sun-warmed table. The page is paper, not screen — bone-warm rather than white, with type that wants to be read at length and ornament that earns its place by signalling, not decorating. Hierarchy comes from the three warm bone tones layering against each other (`bone` → `bone-deep` → `tan`) and from one disciplined gold accent that appears as hairlines, eyebrows, and the occasional underline. Drop-shadow depth is reserved for the book mockups and hero photograph; everywhere else, depth is tonal.

The system is **explicitly and permanently flat-luxury**, not Liquid Glass. Glass, gradient, glow, and bounce — the entire SaaS reflex stack — are forbidden by name in PRODUCT.md and re-forbidden here. There is no dark mode and there will not be one. Sections never invert to darkness; depth is conveyed by tonal warm bone tones, not by darkening. The reader of a pastoral letter is, by design, never asked to leave a paper-feeling document for a black UI.

The voice across surfaces is dignified and unhurried. Latin liturgical phrases (`Ut Vitam Habeant`, `MMXXVI`) appear as section eyebrows or chapter marks — always wrapped in `<abbr>` and `<span lang="la">` so screen readers honour them — and are removed wherever they cannot earn their place.

**Key Characteristics:**
- Light-only, paper-warm, three-tone bone hierarchy
- One accent (gold), used at ≤10% of any surface
- Editorial flat — no shadows beyond book covers and hero photograph
- Long-form prose is a first-class citizen, not "polish for later"
- Latin and Roman numerals as signature accents, never as ornament
- Bilingual chrome (English / Igbo); body prose stays as the Archbishop wrote it

## 2. Colors: The Onitsha Bone Palette

The palette is paper, ink, and gold — the colours of a vested missal on a lectern. Every neutral is warmed toward gold, never toward grey. Pure `#fff` and `#000` are forbidden by token; even hairlines use translucent gold rather than black.

### Primary

- **Onitsha Gold** (`#B08840`): the single accent. Hairline rules between sections (1px at 35% opacity), section eyebrows, link underlines, the flourish glyph above letter sub-sections, and the leading vertical rule on numbered pastoral-letter paragraphs. Reserved — it should occupy ≤10% of any visible screen. Body text in gold uses **Onitsha Gold (Body)** below, never this hue, because this hue does not pass WCAG AA at body size.

### Secondary

- **Onitsha Gold (Body)** (`#8A6A2E`): a darker gold used wherever gold appears as text — small caps eyebrows, inline links inside long-form prose (`prose-editorial-letter a`), `h4` labels in the prose component. Exists *only* to pass WCAG AA against `--bone`; never used on borders or fills.
- **Soft Gold** (`#C9A664`): a lighter gold for use against the dark navy ink background — focus ring outline, gold-on-ink CTAs. Never on bone.

### Tertiary

- **Cardinal Purple** (`#3A1F4D`): liturgical purple for explicitly contemplative surfaces — Lent, vigils, requiem notices. Not used as a generic accent; appears when the liturgical calendar invites it.

### Neutral

- **Ink** (`#0A1B33`): primary text colour, dark-CTA fill, hero overlay. Deep navy, not black.
- **Ink Soft** (`#1F3354`): secondary text, blockquote prose, captions. The colour of a slightly dusty ink.
- **Bone** (`#F7F4EE`): the page. Warm off-white. The default `body` background. Pure `#fff` is *forbidden* as a body background.
- **Bone Deep** (`#EFEAE0`): tonal band #2 — the daily reflection block, the diary, alternating sections. Reads as "same paper, slight shadow."
- **Tan** (`#E6DFCD`): tonal band #3 — the footer and the deepest tonal layer. Still warm; still paper.
- **Stone** (`#D9D2C2`): hairline borders, divider rules where gold would be too declarative.

### Named Rules

**The One Accent Rule.** Onitsha Gold is the only chromatic colour that ever appears on a non-text surface. It must occupy ≤10% of any rendered screen. Two accents on a page is a bug; three is a redesign request. Cardinal Purple is exempted *only* on liturgical pages.

**The Tonal Layering Rule.** Depth is a tonal step from `bone` to `bone-deep` to `tan`, never from a shadow on `bone`. If a section feels "too flat," the answer is the next tonal step, not a `box-shadow`.

**The No Pure White Rule.** `#FFFFFF` is reserved for text on `--ink` (button copy, hero overlay copy) and for nothing else. Cards, sections, and surfaces always use a bone tone. This rule is non-negotiable.

**The Gold-on-Bone WCAG Rule.** Gold *body* text uses `--gold-text` (`#8A6A2E`), not `--gold` (`#B08840`). The lighter hue is for hairlines and decoration, where contrast is not a legibility concern.

## 3. Typography

**Display Font:** Cormorant Garamond (Georgia, serif fallback)
**Body Font:** EB Garamond (Georgia, serif fallback)
**Label / UI Font:** Inter (system-ui, sans-serif fallback)

**Character.** A serif-display + serif-body pairing chosen to evoke Catholic publishing tradition (Communio, L'Osservatore Romano English) rather than tech-magazine editorial (Mediums, Substacks). Cormorant carries the high-contrast Italian-Renaissance display feel — long ascenders, narrow counters, beautiful italic. EB Garamond at 18px / 1.7 reads at length without fatigue. Inter is the only sans, and only ever for chrome (nav, buttons, labels, eyebrow rules) — never for prose.

All three are loaded via `next/font/google` in `web/src/app/layout.tsx`, exposed as `--font-cormorant`, `--font-eb-garamond`, `--font-inter` and referenced through `--font-display`, `--font-body`, `--font-ui` in `globals.css`.

### Hierarchy

- **Display** (Cormorant Garamond, 500, `clamp(30px, 3.5vw, 42px)`, line-height 1.15, letter-spacing -0.01em): pastoral-letter `h1`, page hero headlines. Italics on accent words.
- **Headline** (Cormorant Garamond, 500, 26px, line-height 1.25): pastoral-letter `h2` and prose `h2`. Preceded by a centred 14px gold ✦ flourish (decorative only, hidden on first `h2`).
- **Title** (Cormorant Garamond, 500, ~22–32px depending on context, line-height 1.25): card titles, section titles in prose.
- **Body** (EB Garamond, 400, 18px desktop / 17px mobile, line-height 1.7): everything that isn't a pastoral letter.
- **Body — Letter** (EB Garamond, 400, 19px desktop / 17px mobile, line-height 1.85): the `prose-editorial-letter` variant — the long-form pastoral letter reading view. Capped at 64ch.
- **Label** (Inter, 600, 11–12px, letter-spacing 2–2.4px, UPPERCASE): nav links, buttons, eyebrow rules, prose `h4`, section eyebrows. Always preceded by a 36px gold rule prefix when used as a section eyebrow.
- **Numbered marker** (Inter, 600, 11px, letter-spacing 0.5px, gold-text colour): the numeric label on hanging numbered paragraphs in pastoral letters; sits in a 2.2em right-aligned gutter divided by a 1px gold rule.

### Named Rules

**The 64ch Rule.** Pastoral-letter body is capped at 64ch. Long-form prose elsewhere should respect 65–75ch. Type that runs the full container width is a bug.

**The Tabular Numerals Rule.** Dates, scripture references, and roman-numeral years use `font-variant-numeric: tabular-nums` (`.tabular-nums`). The default body uses `oldstyle-nums proportional-nums` for graceful inline numbers in prose.

**The Latin Wrap Rule.** Any Latin string in chrome or display copy is wrapped in `<span lang="la">`. Roman numerals are wrapped in `<abbr title="2026">MMXXVI</abbr>`. Decorative Latin that cannot earn its place is removed, not displayed.

**The Inter-For-Chrome-Only Rule.** Inter is permitted in nav, buttons, labels, eyebrows, and prose `h4` only. Body prose, blockquotes, and pastoral-letter content *never* set in Inter. If Inter is appearing inside long-form prose, it's a bug.

## 4. Elevation

The system is **flat by default**. Depth is tonal, not cast.

There are exactly two places where elevation appears as a real shadow: the **pastoral-letter book mockup** (lifted off the surface to read as a held book; intensifies on hover via `book-tilt` 3D transform) and the **homepage hero photograph** (a single soft shadow grounds the portrait against bone). Everywhere else — cards, sections, buttons, panels — is flat.

Where a Material-style design would call for `elevation-1` to differentiate a card from a surface, this system uses the next tonal step (`bone` → `bone-deep`, or `bone-deep` → `tan`) plus, optionally, a 1px gold hairline at 35% opacity (`var(--rule)`).

### Shadow Vocabulary (sparing)

- **Book lift** (`box-shadow` baked into the book-cover component): grounds the book against bone. Animates to `perspective(1400px) rotateY(-4deg) rotateX(2deg) scale(1.02)` on hover or focus, with a 900ms `cubic-bezier(0.22, 1, 0.36, 1)` ease-out.
- **Hero portrait grounding** (per-instance, not a token): a single soft shadow grounding His Grace's portrait against the bone hero. Not used elsewhere.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadow appears only on the two named exceptions (book covers, hero portrait). If a designer reaches for a shadow elsewhere, they are reaching for the wrong tool — the answer is a tonal step or a hairline rule.

**The Hairline Depth Rule.** A 1px gold rule at 35% opacity (`var(--rule)`) is the system's primary mark-making tool for separation. It is not a "border" — borders are `var(--stone)`. Hairlines are gold; structural lines are stone.

**The No Cast Shadow on Cards Rule.** Cards never carry a drop-shadow. If a card needs to feel separated from its surface, the surface must drop one tonal step. If that drop is unwanted, the card should not be a card.

## 5. Components

### Buttons

The system has two button variants. Both are pill-less rectangles (`border-radius: 0`), reflecting the editorial-flat aesthetic.

- **Shape:** flat rectangle (`rounded.none`, `0px`). Min-height 48px, padding 16px 32px, gap 12px between icon and label.
- **Typography:** Inter, 11px, weight 600, UPPERCASE, letter-spacing 2px.
- **Primary (`btn-ink`):** `--ink` background (`#0A1B33`), white text. On hover/focus, a `btn-sweep::before` pseudo-element scales `scaleX(0)` → `scaleX(1)` from the left over 500ms `cubic-bezier(0.22, 1, 0.36, 1)`, sweeping a `--sweep-color` (default white) across the button while the text colour transitions to `--ink`. The reveal is left-to-right; never centre-out, never bottom-up.
- **Secondary (`btn-outline`):** transparent background with a 1px `rgba(10,27,51,0.25)` border. On hover/focus, the same sweep mechanism reveals an `--ink` background; the border darkens to solid `--ink` and the text inverts to white.
- **Tertiary / inline (`link-underline`):** plain inline link. The underline draws in left-to-right over 450ms via a 1px linear-gradient `background-size: 0% 1px → 100% 1px`. Active links share the same underline state.

### Inputs / Forms

- **Shape:** flat (`0px` radius), 1px `--stone` border on bone backgrounds.
- **Focus:** site-wide focus ring is a 2px `--gold-soft` outline at 3px offset, applied via `a:focus-visible, button:focus-visible`. Form inputs inherit this. Focus rings are never removed without replacement.
- **Validation timing:** on blur for individual fields, on submit for the whole form (Resend-backed — `web/src/lib/resend.ts`).
- **Required indicators:** explicit `*` markers; never colour-only.

### Navigation

- **Top bar:** `app-header` — sits on bone, light by default. Site brand on the left, primary nav centre, language toggle (EN/Igbo) right.
- **Mega-nav:** the desktop primary nav uses a `mega-panel` that opens on hover or focus-within. The panel is `position: absolute` with `visibility: hidden + opacity: 0 + transform: translateY(-4px)` at rest, transitioning over 260ms to `visibility: visible + opacity: 1 + transform: translateY(0)`. `visibility: hidden` (rather than just opacity) keeps it out of the document's bounding box at rest, preventing horizontal scrollbar pushes from the `w-screen` panel.
- **Mobile:** off-canvas overlay (`nav-overlay`). Trapped focus, `Escape` closes, `aria-label="Open menu"` and `"Primary"` are present.
- **Active state:** `link-underline[data-active="true"]` — the same 1px gold underline as hover, locked on.

### Editorial Prose (the signature component)

Two registered prose variants, both hand-written in `globals.css` (Tailwind Typography is *not* used).

- **`prose-editorial`** — for general CMS prose (homily summaries, biography sections, news entries):
  - `h1` 2em, `h2` 1.55em, `h3` 1.25em — all Cormorant Garamond, 500.
  - `h4` is the *eyebrow* role: Inter, 0.72em, UPPERCASE, letter-spacing 2px, `--gold-text`.
  - `blockquote` carries a 2px `--gold` left rule with 1.4em indent, italic Cormorant at 1.18em in `--ink-soft`. (Note: this is the system's *only* sanctioned `border-left` exception, because it is a blockquote rule, not a side-stripe accent.)
  - `hr` is a 4rem-wide, 1px `--gold` rule centred between paragraphs.
- **`prose-editorial-letter`** — for the long-form pastoral-letter reader at `/pastoral-letters/[slug]`:
  - 64ch max-width, 19px / 1.85, EB Garamond.
  - `h1` is `clamp(30px, 3.5vw, 42px)` Cormorant 500 with -0.01em tracking.
  - `h2` is preceded by a centred 14px `--gold` `✦` glyph (decorative only — first `h2` skips it), giving a ritual-flourish rhythm between sections.
  - `h3` is the eyebrow role inside a letter: Inter 12px, UPPERCASE, 2.4px letter-spacing, `--gold-text`.
  - **Numbered paragraphs:** `p.numbered` carries a left-padded gutter of 3.2em and a `::before` pseudo-element printing `attr(data-num)` in Inter 11px gold-text inside a 2.2em right-aligned column divided by a 1px `--rule` border. This is the canonical pastoral-letter paragraph treatment — it must never be reimplemented inline.
  - **Scripture blockquote:** 2px `--gold` left rule + Cormorant italic 19px in `--ink-soft`.
  - **Section divider `hr`:** 1px `--gold`, 5rem wide, centred with 3em vertical margin.
  - At ≤900px, font drops to 17px and numbered-paragraph gutters collapse to 2.6em.

### Cards

Cards in this system are typographic, not panelled. The default "card" treatment is:
- `bone-deep` or `tan` background as the surface (not `bone`)
- *no* radius (`0px`)
- *no* drop-shadow
- *optional* 1px `--rule` (gold hairline) or `--stone` border, depending on whether the card is decorative or structural
- generous internal padding (≥24px on mobile, ≥48px on desktop)

If a "card" would need a shadow, radius, *and* a coloured border to feel separated, the design is wrong; rethink as full-bleed, alternating tonal bands, or a typographic block.

### Signature: The Book Mockup

Pastoral letters are presented as **physical books**, not as PDFs or thumbnails. Cover image is fixed at **1200 × 1500** (Cloudinary `crop: pad, background: white`) and rendered with the `book-tilt` 3D transform on hover/focus (perspective 1400px, `rotateY(-4deg) rotateX(2deg) scale(1.02)`, 900ms ease-out-quart). The book carries the only sanctioned drop-shadow in the system. The mockup is the visual anchor of the brand and *must* be preserved on every surface that displays a pastoral letter.

## 6. Do's and Don'ts

### Do

- **Do** use the bone palette for every page background. `--bone` for primary, `--bone-deep` for secondary tonal bands, `--tan` for the deepest layer. Never `#fff`.
- **Do** use `--gold-text` (`#8A6A2E`) for any gold *text*. Reserve `--gold` (`#B08840`) for hairlines, dividers, and decorative marks.
- **Do** wrap every Roman numeral in `<abbr title="...">` and every Latin string in `<span lang="la">`.
- **Do** use the `prose-editorial-letter` component for all pastoral-letter body content. Numbered paragraphs use `p.numbered` with `data-num`; never reimplement.
- **Do** use inline SVG for icons and crosses (`src/components/icons.tsx`, `src/components/crest.tsx`). The Latin cross `✠` glyph is forbidden.
- **Do** keep one accent on screen at a time. Onitsha Gold ≤10% of the visible surface.
- **Do** animate state transitions with `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart) at 260–500ms. Hover sweeps run 500ms; nav panels 260ms; book lift 900ms.
- **Do** honour `prefers-reduced-motion` — already wired site-wide in `globals.css`.
- **Do** preserve the 1200 × 1500 book mockup for every pastoral letter. Always.
- **Do** load fonts via `next/font/google` only. No `@import url(...)`.
- **Do** use `next/image` for every image. `<img>` is a bug.

### Don't

- **Don't** introduce dark mode, a "theme switch," or any inverted dark section. Light-only is permanent.
- **Don't** reach for glassmorphism, neumorphism, gradients across more than two stops, or `backdrop-filter` blur as decoration. The "Liquid Glass" reflex is forbidden by name.
- **Don't** use `border-left` greater than 1px as a coloured side-stripe on cards, alerts, or list items. The pastoral-letter blockquote and numbered-paragraph gutter rule are the *only* sanctioned `border-left` instances; everything else is a bug.
- **Don't** use gradient text (`background-clip: text` on a gradient). Forbidden by skill law and brand law.
- **Don't** install Cinzel or Playfair Display. Cormorant Garamond is the locked display face; both alternatives are explicitly rejected.
- **Don't** use Tailwind's `slate-*` / `zinc-*` / `gray-*` palettes for any foundational surface. Use the project tokens.
- **Don't** add a hero carousel, autoplay video, autoplay audio, or popup newsletter signup.
- **Don't** add live counters ("join 5,000 followers"), social-share trays, or trending-now widgets. The site is editorial, not a content farm.
- **Don't** introduce stock religious imagery, clipart crosses, or Adobe Stock priests. Photography comes from the Archbishop's archive.
- **Don't** use `#fff` as a section background. Use `--bone` or one of its deeper steps.
- **Don't** drop a shadow on a card to make it feel separated. Drop a tonal step.
- **Don't** modal-first. Exhaust inline / progressive alternatives before reaching for a modal. The site has *very* few modals by design.
- **Don't** use em dashes in copy. Use commas, colons, semicolons, periods, or parentheses.
- **Don't** write "—" as `--`. Don't write em dashes at all.
- **Don't** display Latin or Roman numerals that cannot earn their place. If a flourish is decorative, remove it.
