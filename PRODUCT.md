# Product

## Register

brand

## Users

The personal site of His Grace Most Rev. Valerian Maduka Okeke, Metropolitan Archbishop of Onitsha. It serves four distinct readers, in roughly this order of weight:

1. **Global Catholic readers** — laity who follow the Archbishop's writing the way one might follow Robert Barron, Hans Urs von Balthasar, or Word on Fire. They arrive looking for a specific pastoral letter, homily, or reflection. They expect long-form prose to read well on a phone in bed at 11pm.
2. **The Onitsha faithful** — the diocesan congregation who recognise His Grace as their bishop. They want the diary, programme, photo gallery, and pastoral visits. They want to feel the site is *theirs*, including in Igbo.
3. **Journalists, scholars, and chancery offices** — checking biography, episcopal lineage, coat of arms, official communiqués. They need precise, citeable, archival material with PDFs.
4. **Visitors interested in his ministry** — vocations enquirers, prayer-request senders, contact-page users.

This is a *personal* site for the Archbishop himself, not the institutional Archdiocese of Onitsha site. The voice is his.

## Product Purpose

A reading-first, archive-quality home for the Archbishop's pastoral teaching — pastoral letters, homilies, reflections, and writings — surrounded by enough biographical and ministry context to be the canonical citation point on the open web. Pastoral Letters are the anchor; everything else exists to frame them.

Success looks like:
- A reader finishes a pastoral letter end-to-end on a phone without exiting.
- A journalist can cite one piece in three clicks from any landing surface.
- The Onitsha faithful can switch the chrome to Igbo and still know exactly where to go.
- The site reads as published, not as posted — closer in feel to a Vatican News long-read than to a parish blog.

## Brand Personality

Three words: **modern, editorial, restrained.**

Tone of voice in chrome: dignified, unhurried, sparing with adjectives. Closer to a serious newspaper's op-ed page than to a marketing site. Latin liturgical phrases are welcome as accents, never as ornament; they are wrapped in `<span lang="la">` so the screen-reader doesn't say them in English.

Aspirational references (in the right lane): **Vatican News, Word on Fire, Hallow, the printed Communio journal, the New York Review of Books, the L'Osservatore Romano English edition.**

The interface should feel **expensive** — not in the SaaS sense (gradients, glow, big claims) but in the editorial sense (paper-warm tones, generous space, restrained accent, considered typography).

## Anti-references

Explicit anti-references, repeated verbatim from the brand brief in `CLAUDE.md` so they can never be quietly relaxed:

- **Parish portals.** Stock crosses, clipart doves, autoplay choir music, "join 5,000 followers" counters, side-stripe alert boxes, blue-and-yellow CTAs.
- **SaaS / AI marketing reflex.** Multi-stop gradients, glassmorphism, neumorphism, hero-metric templates, identical card grids, dark mode "because tools look cool dark."
- **Modal-first thinking.** Modals stacked on modals, lightbox carousels, popup newsletters.
- **Carousels and autoplay.** Hero carousels, video that plays without consent, tickers.
- **Pure-white backgrounds.** `#fff` looks clinical against the warm photography of African Catholic life. Use the bone palette.
- **Dark sections.** No dark hero, no dark footer. Light mode only — tonal hierarchy comes from the three warm bone tones.
- **Cinzel as a heading face.** Already rejected by His Grace's office as looking "ugly." Cormorant Garamond is the locked display face; Playfair Display is also rejected as too declarative.
- **The Latin cross as `✠` character.** Always inline SVG; the glyph renders inconsistently and reads as ASCII art.
- **Tailwind `slate-*` / `zinc-*` for foundational surfaces.** Use the project tokens.
- **Stock religious imagery.** No Adobe Stock priests, no clip-art doves, no Getty cathedral interiors. Photography is from the Archbishop's own archive or commissioned.

## Design Principles

1. **Restraint is the brand.** Every page asks "what can be removed?" before "what should be added?" One accent (gold), one display face (Cormorant), one body face (EB Garamond). Ornament is a tax; charge it sparingly.
2. **The letter is the hero.** Surfaces exist to lead the reader to the writing and stay out of its way once they arrive. Reading rhythm, line length, and paragraph numbering are first-class concerns; they are not "long-form polish for later."
3. **Editorial flat-luxury, not Liquid Glass.** Depth comes from tonal warm bone tones (`bone` → `bone-deep` → `tan`) and gold hairlines (1px, 35% opacity), never from shadows, blur, or glass. The site is light, paper-textured, and quiet.
4. **Latin and Roman numerals are signatures, not decoration.** They appear when they earn their place — section eyebrows, chapter marks, year stamps — and are *always* made accessible (`<abbr>`, `lang="la"`). If they're decorative, remove them.
5. **The chrome is bilingual; the prose is the Archbishop's.** EN/Igbo language toggle covers navigation, eyebrows, buttons, footers, and form labels. Body content (pastoral letters, homilies, writings) stays in the language the Archbishop wrote it; the Igbo locale surfaces a small notice on long-form pages explaining this.

## Accessibility & Inclusion

- Target: **WCAG 2.1 AA** across every shipped surface. Gold body text has its own dimmer token (`--gold-text` / `#8A6A2E`) precisely so small gold copy passes AA on bone.
- **Light-only by design** — there is no dark theme switch and there will not be one. Reduced-motion is honoured (`prefers-reduced-motion`); print styles strip chrome and recolor for paper.
- **Roman numerals must be wrapped** in `<abbr title="...">` so a screen reader says "two thousand twenty-six," not "M-M-X-X-V-I."
- **Latin tag/heading text must be wrapped** in `<span lang="la">` so it's pronounced as Latin, not mangled as English.
- **Bilingual chrome (EN/Igbo).** Standard Igbo as used in Onitsha catechesis. The Office of His Grace owns final phrasing of every Igbo string in `web/src/lib/i18n.ts`.
- **Touch targets** ≥ 44×44 on mobile. Body type ≥ 17px on mobile, 18px on desktop.
- **No autoplaying audio or video, ever.** Includes the homepage hero.
