# More Muslim — Design System

> *A narrative audio documentary series that explores the Muslim experience, with all its messiness.*

This project is the brand & UI design system for **More Muslim**, a narrative-audio podcast. It contains the brand foundations (colour, type, logos, the star-lattice pattern), reusable React UI primitives, and high-fidelity recreations of the brand's real surfaces (social posts, podcast website, partner-overview slides).

---

## The brand at a glance

- **More Muslim** is the first narrative audio documentary series produced in **Qatar**, focused on stories from Muslim communities worldwide. Each episode is a transhistorical journey into one aspect of the Muslim experience.
- Produced by the **Al-Mujadilah Center and Mosque for Women**. Season One = **nine documentaries** told through the lived experiences of Muslim women.
- Editorial register comparable to **Radiolab** / **This American Life** — ambitious, cinematic, serious. Audience skews **22–45, university-educated, urban, culturally engaged**.
- Web home: **moremuslim.org**. Distributed on Apple Podcasts, Spotify, "wherever you get podcasts."
- Identity & brand package designed by **ZAINA** studio (studio@zaina.international), 02.2026.

**Known people / episodes (for realistic copy):** Host **Sohaira Siddiqui**; reporter **Yassmin Abdel-Magied**; producer Taqwa Sadiq. Episodes referenced in real assets: *E7 "In Therapy, with SheikhAGPT"* (Muslim women & AI-chatbot therapy), *E6 "Cape Malay"* (Cape Town's Bo-Kaap). Other Season One threads: the secret translators behind a widely-read English Qur'an.

## Source materials (provided by the user — reader may not have access)

- `uploads/ZAINA_Al-Mujadilah_More-Muslim_Brand-Elements.pdf` — official brand guide (logos, fonts, the 10-colour palette, pattern usage). **Primary source of truth.**
- `uploads/ABCMarist-Regular.otf`, `ABCMarist-RegularItalic.otf` — the licensed typeface (Dinamo).
- Logo artwork (beige) — horizontal lockup, symbol, wordmark (PNG + SVG).
- `.ase` swatch files (RGB + CMYK).
- Social-post reference images (`uploads/More-Muslim_AI_Post*.jpg`, `MoreMuslim_CapeMalay_Socials_Post*.jpg`) — real Instagram posts; the basis for the Social UI kit.
- Partner-overview deck, multiple partner versions (`MoreMuslim_Overview_*.pdf/.indd/.idml` — Qatar Airways, Media City, iHeartRadio). Basis for the Slides kit.
- InDesign→HTML export of the social-templates deck (`uploads/index.html`, `publication-*.html`, `idGeneratedStyles.css`). Confirms type system + colours and names the **official pattern assets** (see caveats). Its `image/` folder was **not** uploaded.

> ⚠️ **Not fully readable:** the `.indd` (InDesign binary) files could not be parsed. The `.idml` and `.pdf` overview were parsed for text, fonts and content. If you need pixel-exact slide layouts, please export the InDesign deck to PDF and re-attach.

---

## CONTENT FUNDAMENTALS — how More Muslim writes

The voice is **literary, calm, and unflinching** — documentary journalism, not marketing. It treats faith and culture with editorial seriousness and never proselytises. The tagline itself sets the register: plainspoken, a little wry ("…with all its messiness").

- **Tone:** thoughtful, humane, curious. Cinematic but never melodramatic. Comfortable sitting with complexity and contradiction.
- **Person:** third person and reportorial for descriptions ("When reporter Yassmin Abdel-Magied's friend tells her…"); first person only inside quotes from subjects. Addresses the listener directly only in calls-to-action ("Listen to the full episode…").
- **Casing:** Headlines and eyebrows are **UPPERCASE**, always tracked to **165 (`0.165em`, the `--tracking-caps` token / `.more-caps` utility)** — this is the one canonical all-caps tracking; never retrack uppercase to anything else (e.g. `EPISODE 7: IN THERAPY, WITH SHEIKHAGPT`, `NOW STREAMING`). Body and pull-quotes are **sentence case**. Titles of other shows are *italicised* (*Radiolab*, *This American Life*, *More Muslim*).
- **Pull-quotes** are central — verbatim, often colloquial subject speech, set large in italic serif. Quotation marks are curly; ellipses used to compress ("In between our sessions… I talked to a chatbot.").
- **Numbers** are used sparingly but concretely as proof ("downloaded more than 40,000 times across 143 countries in three months", "fourth-largest market", "sevenfold" growth).
- **Logos:** symbol used on its own at **187 × 187 px**; horizontal lockup at **734 × 141 px**. Always match the approved colour pairing for the ground (beige symbol on Night/Oak, oak symbol on Ivory/Harvest, night symbol on Mist). Streaming CTA names platforms: "Apple Podcasts, Spotify, or wherever you get podcasts."
- **No emoji.** Arabic loanwords appear naturally and unitalicised inside quotes ("habibti"). Spelling is British/international ("neighbourhood", "colour", "prioritise").

**Example copy lifted from real assets:**
- Eyebrow → `EPISODE 6: CAPE MALAY`
- Pull-quote → *"I want to let them know that there's consequences of everything."*
- Synopsis → "When reporter Yassmin Abdel-Magied's friend tells her she's been using ChatGPT as a therapist, Yassmin doesn't know what to think."
- CTA → `NOW STREAMING` · "Listen to the full episode on moremuslim.org."

---

## VISUAL FOUNDATIONS

**Overall feel:** warm, editorial, architectural. Tone-on-tone, generous negative space, centred or quietly left-aligned compositions. Think a beautifully art-directed documentary title sequence — not a SaaS dashboard.

- **Colour:** two families. *Warm earth* — Ivory Beige `#F6E1C7`, Harvest Yellow `#E2B16D`, Terracotta `#C15A3A`, Oak Brown `#511C13`. *Cool blue* — Mist `#9FBCCC`, Coastal `#6185A3`, Stone `#3C5065`, Night `#192136`. Plus White & Black. **Approved ground × ink pairings (the only permitted combinations):** Night+Ivory · Oak+Ivory · Ivory+Oak · Harvest+Oak · Mist+Night · Black+Beige Soft · Black+White. Never place any colour on a ground outside these seven pairs. Never more than ~2 colours per composition.
- **Type:** one typeface only — **ABC Marist** (Regular + Italic; *there is no bold*). Hierarchy is built from **size, UPPERCASE, letter-spacing and colour**, never weight. Display headings use the four official sizes — **Large 76/80, Medium 60/66, Small 50/55, XS 32/36 pt** (`--text-display-lg…xs` with matching `--leading-display-*`) — all uppercase, tracked to `var(--tracking-caps)` (0.165em). All-caps tracking is always 0.165em — never retrack.
- **Backgrounds:** solid brand colour + a **tone-on-tone 8-point-star lattice pattern** (derived from the symbol), kept subtle and secondary. Frequently a **fine film-grain/noise** texture over the flat colour. Editorial photography (warm, natural light, real people — e.g. an elder in a doorway) and moody illustration (the SheikhAGPT CRT) are used full-bleed for covers, always inside a small inset border or with a tracked caption.
- **Imagery vibe:** warm and filmic for documentary/portrait; cool teal-and-shadow for the conceptual/illustrated covers. Grain is welcome. Photos sit in a thin ivory inset frame on beige grounds.
- **Pattern rules (from the guide):** the brand ships **20 official star-lattice tiles** (real ZAINA artwork) in `assets/patterns/pattern-1a…7b.png` — these are the **only** patterns permitted. Each tile bakes in its own ground + tone-on-tone lattice. Use them via `PatternPanel` (`tile="6B"`) or as a full-bleed `background-image`. Keep discreet (the `5*`/`6*` fine tiles are best behind text), always fill the frame, never distort/rotate/recolour. **Never hand-draw, generate, or recolour a star pattern — there is no substitute; always use an official tile.**
- **Layout:** centred sign-offs and eyebrows; large vertical breathing room; the symbol or full lockup pinned to the bottom (centre or left). Square `1080×1080` and story `1080×1920` are the native social canvases.
- **Corners & cards:** corners are **sharp** (radius 0–8px) — the brand geometry is tile-like and angular. Photo insets get a slightly larger radius (~14px). Cards are flat fills or thin hairline borders (`--border-subtle`), not heavy drop-shadows.
- **Shadows:** soft, low-contrast, warm-tinted (`--shadow-warm`) when used at all. The aesthetic is mostly flat/matte.
- **Borders:** hairline, low-opacity ivory on dark / low-opacity oak on light.
- **Motion:** calm. Gentle fades and slow eases (`--ease-out`, 240–420ms), no bounce, no springy overshoot. Decorative loops are avoided.
- **Hover:** subtle — slight opacity lift or a one-step colour deepen (e.g. harvest → terracotta). **Press:** a small darken, optional 1–2px nudge; no aggressive scale.
- **Transparency/blur:** used lightly — frosted strip behind streaming captions over photos; otherwise opaque.

---

## ICONOGRAPHY

More Muslim is **typographically driven** and uses **almost no UI iconography** in its brand assets — the visual identity carries through the star symbol and the pattern, not an icon set.

- **The brand symbol** (`assets/logos/symbol-*.svg`) — an 8-point star built from four interlocking chevron polygons — is the one true "icon." It is used as a bullet, a sign-off mark, a loading/centre accent, and the seed of the lattice pattern. Recoloured variants are provided (beige, oak, terracotta, night, black).
- **No built-in icon font** ships with the brand. Where product UIs genuinely need functional icons (play/pause, share, search, platform marks), use **[Lucide](https://lucide.dev)** (CDN) — a thin, geometric, open-stroke set whose 1.5–2px weight sits well next to Marist. This is a **documented substitution**, not from the brand package.
- **Platform glyphs** (Apple Podcasts, Spotify) appear in real posts; use the official brand marks when representing those platforms.
- **No emoji**, ever. Unicode is not used as decoration. Stick to the symbol + Lucide.

---

## INDEX / manifest

**Root**
- `styles.css` — the single entry point consumers link. `@import`s only.
- `tokens/` — `fonts.css` (@font-face), `colors.css`, `typography.css`, `spacing.css`, `base.css`.
- `assets/fonts/` — ABC Marist OTFs · `assets/logos/` — logo lockups, symbol, wordmark in 5 colourways · `assets/patterns/` — the **20 official star-lattice tiles** (`pattern-1a…7b.png`).
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).

**Components** (`components/` — see each `.prompt.md`)
- `core/` — Button, Tag, Badge, Avatar, Symbol, EyebrowLabel
- `media/` — EpisodeCard, PlayButton, AudioBar, PullQuote, PatternPanel

**UI kits** (`ui_kits/`)
- `social/` — branded Instagram post/story templates (the brand's primary output)
- `website/` — moremuslim.org episode site recreation
- `slides/` — partner-overview deck slides

**Templates** (`templates/` — copy-and-edit starting points for consuming projects)
- `social-post/` — branded 4:5 social post (pattern ground, pull-quote, sign-off)
- `keynote-slide/` — branded 16:9 statement slide

**Other**
- `SKILL.md` — Agent-Skill wrapper.

---

## CAVEATS

- **Official patterns are included.** The 20 real ZAINA tiles now live in `assets/patterns/pattern-1a…7b.png` (numbered set, several colourways × four weights: solid · line · fine · duo). `PatternPanel` places them directly. The earlier generated SVG reconstruction has been removed — **do not regenerate or recreate patterns; only the official tiles may be used.** The matching film-grain texture is `uploads/QFO_…_Instagram_Content_Texture.png`.
- **Recoloured logo/symbol SVGs** (oak, terracotta, night, black) were generated from the supplied beige artwork by colour substitution. The brand package only shipped beige; request the other official colourways if exactness matters.
- **`.indd` binaries unreadable** — slides are built from the parsed `.idml`/`.pdf` text, not the exact InDesign layout.
- **ABC Marist** ships Regular + Italic only (no bold) — this is intentional per the brand, and the system never fakes bold.
