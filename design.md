# More Muslim Design System

> **Version:** 1.0 · June 2026  
> **Namespace:** `window.MoreMuslimDesignSystem_019df4`  
> **Typeface:** ABC Marist (Regular + Italic only — no bold weight exists)

---

## 1. Brand Overview

More Muslim is a sound-rich, cinematic narrative podcast telling deeply reported stories about Muslims across the world. Each episode is a mix of interviews, field reporting, history, and research, all scored to original music. Our first season is a production of Al-Mujadilah Center and Mosque for Women and is focused on covering some of the most interesting stories in the Muslim world through the lived experiences of Muslim women.

**Show tagline (exact):**  
> A narrative audio documentary series that explores the Muslim experience, with all its messiness.

**Website:** [moremuslim.org](https://moremuslim.org)

---

## 2. Colour System

All colour values sourced from `tokens/colors.css`. Use hex for web.

### Base Palette

| Token | Hex | Name |
|---|---|---|
| `--more-white` | `#FFFFFF` | More White |
| `--more-ivory-beige` | `#F6E1C6` | More Ivory Beige |
| `--more-harvest-yellow` | `#E2B16D` | More Harvest Yellow |
| `--more-terracotta` | `#C15A3A` | More Terracotta Orange |
| `--more-oak-brown` | `#511C14` | More Oak Brown |
| `--more-mist-blue` | `#9FBCCC` | More Mist Blue |
| `--more-coastal-blue` | `#6185A3` | More Coastal Blue |
| `--more-stone-blue` | `#3C5065` | More Stone Blue |
| `--more-night-blue` | `#192136` | More Night Blue |
| `--more-black` | `#000000` | More Black |

**Harvest Yellow** (`#E2B16D`) is **only** permitted as a background ground — never as ink, text, or accent colour.

### Approved Colour Pairings

Only these seven combinations are permitted. Any foreground must use its paired ink — no mixing.

| Ground | Hex | Ink | Hex |
|---|---|---|---|
| Night Blue | `#192136` | Ivory Beige | `#F6E1C6` |
| Oak Brown | `#511C14` | Ivory Beige | `#F6E1C6` |
| Ivory Beige | `#F6E1C6` | Oak Brown | `#511C14` |
| Harvest Yellow | `#E2B16D` | Oak Brown | `#511C14` |
| Mist Blue | `#9FBCCC` | Night Blue | `#192136` |
| Black | `#000000` | Beige Soft | `#FBF2E9` |
| Black | `#000000` | White | `#FFFFFF` |

Apply via CSS classes: `.more-pair-night`, `.more-pair-oak`, `.more-pair-beige`, `.more-pair-harvest`, `.more-pair-mist`, `.more-pair-black-beige`, `.more-pair-black-white`.

### Supporting Tints

| Token | Hex | Use |
|---|---|---|
| `--more-beige-soft` | `#FBF2E9` | Paper / lightest warm surface |
| `--more-beige-deep` | `#ECCFA9` | Beige-on-beige layering |
| `--more-night-blue-700` | `#232D45` | Raised surface on Night |
| `--more-night-blue-600` | `#2E3A55` | Hairline / border on Night |
| `--more-oak-700` | `#6A2A1C` | Raised surface on Oak |

---

## 3. Typography

**One typeface: ABC Marist.** Regular and Italic only. No bold weights exist.  
Build hierarchy with **size**, **case**, and **letter-spacing** — never font-weight.

```css
--font-serif: "ABC Marist", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
```

### Type Scale

| Token | rem | px | Use |
|---|---|---|---|
| `--text-2xs` | 0.6875rem | 11px | Micro labels |
| `--text-xs` | 0.8125rem | 13px | Captions |
| `--text-sm` | 0.9375rem | 15px | Secondary / credits |
| `--text-base` | 1.0625rem | 17px | Body copy |
| `--text-lg` | 1.375rem | 22px | Lead / intro |
| `--text-xl` | 1.75rem | 28px | — |
| `--text-2xl` | 2.375rem | 38px | — |
| `--text-3xl` | 3.25rem | 52px | Display |
| `--text-4xl` | 4.5rem | 72px | Hero |
| `--text-5xl` | 6rem | 96px | Hero display |

### Display Scale (Brand Print Spec)

| Token | Size | Leading |
|---|---|---|
| `--text-display-lg` | 76pt | 1.053 (80pt) |
| `--text-display-md` | 60pt | 1.10 (66pt) |
| `--text-display-sm` | 50pt | 1.10 (55pt) |
| `--text-display-xs` | 32pt | 1.125 (36pt) |

### Leading (Line-Height)

| Token | Value | Context |
|---|---|---|
| `--leading-tight` | 1.04 | Tight display headlines |
| `--leading-snug` | 1.18 | Desktop body (site: 1.176) |
| `--leading-normal` | 1.22 | Mobile body (site: 1.225) |
| `--leading-relaxed` | 1.34 | Prose / about text |

### Tracking (Letter-Spacing)

All uppercase text uses `--tracking-caps: 0.165em` — this is the canonical brand value from the `All-Caps---Tracking-165` paragraph style. Never retrack uppercase off this value.

| Token | Value |
|---|---|
| `--tracking-caps` | `0.165em` |
| `--tracking-tight` | `-0.01em` |
| `--tracking-normal` | `0em` |
| `--tracking-wide` | `0.06em` |
| `--tracking-wider` | `0.14em` |
| `--tracking-widest` | `0.24em` |

### Body Text (from moremuslim.org CSS)

```css
/* Mobile */
font-size: 1rem; letter-spacing: 0.2px; line-height: 1.225;
/* Desktop (≥768px) */
font-size: 1.1875rem; letter-spacing: 0.14px; line-height: 1.158;
```

---

## 4. Patterns

Seven pattern families (1–7), each with three colourway variants (A/B/C). Referenced by tile code, e.g. `"5C"`, `"6B"`.

**Approved tile × ground pairings:**

| Ground | Tile | Opacity cap |
|---|---|---|
| Night Blue | `5C` | 0.20 |
| Oak Brown | `6B` | 0.15 |
| Beige Soft | `6A` | 0.10 |
| Harvest Yellow | `3A` | 0.10 |
| Mist Blue | `2B` | 0.10 |

Always layer a grain texture (`grainOpacity: 0.06–0.14`) on top of pattern tiles for tactile depth.

---

## 5. Components

All components are available via `window.MoreMuslimDesignSystem_019df4` after loading `_ds_bundle.js`.

### Core Components

#### `Symbol`
The More Muslim geometric mark. Use at the bottom of slides and sign-offs.

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.Symbol"
  size="48" hint-size="48px,48px" style="color:inherit;"></x-import>
```

Props: `size` (number, px)

#### `Button`

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.Button"
  variant="primary" size="lg" hint-size="140px,40px">Subscribe</x-import>
```

Props: `variant` (`primary` | `outline` | `ghost`), `size` (`sm` | `md` | `lg`)

#### `EyebrowLabel`

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.EyebrowLabel"
  hint-size="100%,20px">Season One</x-import>
```

Props: `tone` (`primary` | `secondary`)

#### `Tag`

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.Tag"
  hint-size="80px,28px">S1 · E7</x-import>
```

#### `Avatar`

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.Avatar"
  name="Sohaira Siddiqui" size="42" hint-size="42px,42px"></x-import>
```

Props: `name` (string), `size` (number, px)

### Media Components

#### `PatternPanel`
Full-bleed pattern + grain tile background. Use as a wrapper — children render inside it.

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.PatternPanel"
  tile="5C" color="#192136" tile-opacity="0.2" grain-opacity="0.07" radius="0"
  hint-size="1280px,720px" style="width:1280px; height:720px; position:relative;">
  <!-- children here -->
</x-import>
```

Props: `tile` (string, e.g. `"5C"`), `color` (hex), `tile-opacity` (0–1), `grain-opacity` (0–1), `radius` (CSS string)

#### `AudioBar`

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.AudioBar"
  episode="S1 · E7" title="In Therapy, With SheikhaGPT"
  playing="false" progress="0.18" duration="2531"
  hint-size="100%,60px"></x-import>
```

Props: `episode`, `title`, `playing` (bool), `progress` (0–1), `duration` (seconds), `onToggle`, `onSeek`

#### `EpisodeCard`

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.EpisodeCard"
  title="Side Entrances" episode="S1 · E1" duration="43:59" date="01 Feb 2026"
  hint-size="100%,300px"></x-import>
```

#### `PullQuote`

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.PullQuote"
  size="lg" cite="Episode 7 · In Therapy, With SheikhaGPT"
  hint-size="100%,120px">It calls her habibti. Gives her Islamic relationship advice.</x-import>
```

Props: `size` (`sm` | `md` | `lg`), `cite` (string)

#### `PlayButton`

```html
<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.PlayButton"
  playing="false" hint-size="120px,38px"></x-import>
```

---

## 6. Templates

### Keynote Slide (`templates/keynote-slide/KeynoteSlide.dc.html`)

A branded 1280×720 statement slide on the star-lattice ground.

**Props:**

| Prop | Type | Default | Options |
|---|---|---|---|
| `ground` | enum | `oak` | `night`, `oak`, `beige`, `black` |
| `patternOpacity` | float | `0.2` | 0–1 |

**Ground presets:**

| Ground | Background | Tile | Text |
|---|---|---|---|
| `night` | `#192136` | `5C` | `#F6E1C6` |
| `oak` | `#511C14` | `6B` | `#F6E1C6` |
| `beige` | `#FBF2E9` | `6A` | `#511C14` |
| `black` | `#000000` | — | `#F6E1C6` |

Symbol always appears at the bottom of the slide.

---

### Social Post (`templates/social-post/SocialPost.dc.html`)

A branded 1080×1350 (4:5) Instagram post on the star-lattice ground. Default: Oak Brown + Ivory Beige colourway.

---

## 7. UI Kits

### Slides (`ui_kits/slides/`)

Seven slide types available via `window.MMSlides`:

| Component | Ground | Purpose |
|---|---|---|
| `TitleSlide` | Black | Deck opener with logo |
| `SectionSlide` | Oak | Section divider, large uppercase |
| `StatementSlide` | Night | Lead copy + body paragraph |
| `StatsSlide` | Night | Up to 3 key figures |
| `QuoteSlide` | Oak | Italic pull-quote with attribution |
| `ListSlide` | Beige | Episode or agenda list |
| `ClosingSlide` | Night | Sign-off with symbol |

### Social (`ui_kits/social/`)

Five post types via `window.MMSocial`:

| Component | Format | Purpose |
|---|---|---|
| `CoverPost` | Portrait 4:5 | Episode launch cover |
| `QuotePost` | Story 9:16 | Dialogue / quote exchange |
| `SynopsisPost` | Portrait 4:5 | Episode synopsis |
| `NowStreamingPost` | Story 9:16 | "Now Streaming" announcement |
| `CreditsPost` | Portrait 4:5 | Episode credits |

**Six approved colourways:** `night`, `oak`, `beige`, `harvest`, `mist`, `black`

### Website (`ui_kits/website/`)

Four screens via `window.MMSite`:

| Component | Purpose |
|---|---|
| `Home` | Episode index with featured + all-episodes list |
| `EpisodePage` | Immersive single-episode view |
| `About` | Show & team overview |
| `Header` / `Footer` | Shared chrome |

---

## 8. Copy & Tone of Voice

### Exact tagline
> A narrative audio documentary series that explores the Muslim experience, with all its messiness.

### About (exact)
> More Muslim is a sound-rich, cinematic narrative podcast telling deeply reported stories about Muslims across the world. Each episode is a mix of interviews, field reporting, history, and research, all scored to original music. Our first season is a production of Al-Mujadilah Center and Mosque for Women and is focused on covering some of the most interesting stories in the Muslim world through the lived experiences of Muslim women.

### Episode descriptions
All episode blurbs use the exact text from moremuslim.org — do not paraphrase or truncate for card layouts; use `text-wrap: pretty` and let text flow.

### Rules
- **No em dashes** at the end of sentences to add trailing thoughts. Use a comma, colon, or a new sentence instead.
- **No italic** or accent-coloured text in description body copy.
- **No "Qatar's first"** — this phrase does not appear anywhere on moremuslim.org and must not be used in mockups or templates.
- **Harvest Yellow** is never used for text or accent; it is a background ground only.
- All uppercase text tracks at `0.165em` (`--tracking-caps`). Never override this.

---

## 9. Logo & Symbol

Three logo lockups, each in five colourways (`beige`, `oak`, `night`, `terracotta`, `black`):

| File prefix | Lockup |
|---|---|
| `logo-horizontal-*` | Horizontal lockup (full logo) |
| `wordmark-*` | Wordmark only |
| `symbol-*` | Symbol only |

**Minimum logo height:** 34px (social sidebar), 44px (slides), 54px (website header).

---

## 10. Season One Episodes

| # | Title | Reporter | Duration | Date |
|---|---|---|---|---|
| E1 | Side Entrances | Taqwa Sadiq | 43:59 | 01 Feb 2026 |
| E2 | The Nikkah Loophole | Tanita Rahmani | 35:54 | 01 Feb 2026 |
| E3 | The Secret Translators | Cadar Mohamud | 43:48 | 18 Feb 2026 |
| E4 | A Recitation Revolution | — | 49:39 | 06 Mar 2026 |
| E5 | Hanabneehu: Rebuilding Sudan, One Class at a Time | Yassmin Abdel-Magied | 35:50 | 19 Mar 2026 |
| E6 | Cape Malay: The Indonesian Roots of South African Islam | Aina J. Khan | 41:43 | 02 Apr 2026 |
| E7 | In Therapy, With SheikhaGPT | Yassmin Abdel-Magied | 42:11 | 24 Apr 2026 |
| E8 | The Travelling Sisterhood | Sohaira Siddiqui | 43:00 | 27 May 2026 |
| E9 | A More Muslim Japan | Tanita Rahmani | 25:45 | 11 Jun 2026 |

---

## 12. Social Post Rules

These rules apply to all branded Instagram and social-media posts (1080×1080, 1080×1350, 1080×1920). They override or refine the general brand guidelines where social-specific behaviour differs.

### Typography

- **No muted text.** All type runs at full opacity — never apply `opacity` less than 1 to text elements on a social post. The brand does not whisper.
- **No italic.** Social posts use upright Roman only. Italic is reserved for pull-quotes inside long-form contexts (pitch decks, editorial pages), never social.
- **Caps tracking is universal.** Every uppercase string — eyebrows, CTAs, URLs, labels — uses `letter-spacing: 0.165em`. No exceptions, no retracking for decorative variation.
- **Use the social text scale.** Four sizes only — no freeform sizing:
  - `--social-text-l`: `77px` — primary body / headline
  - `--social-text-m`: `56px` — secondary body
  - `--social-text-s`: `42px` — tertiary body
  - `--social-text-xs`: `32px` — eyebrows, labels, URLs
- **Line-height is 1em (solid).** Set once on the container at `lineHeight: 1` and inherited by all children. Do not override per-element. Do not use looser values.
- **Body text is left-aligned.** Body copy on social posts aligns to the left. Eyebrows (top and bottom) are the only centred elements.
- **Text box width narrows by format.** `max-width: 910px` on portrait (1080×1350); `max-width: 780px` on story (1080×1920). Font scale does not change between formats. Eyebrows additionally use `white-space: nowrap` — they never break to a second line.

### Layout

- **Fixed eyebrow positions.** On a 1080×1350 canvas: top eyebrow sits at `y: 85px`, bottom eyebrow at `y: 1236px`. These are absolute — they do not flex with content. Scale proportionally for other canvas heights.
- **Body text is vertically centred.** The body copy occupies the space between the two eyebrows and is centred within it.
- **Horizontal padding is 85px.** Body text uses `padding-left: 85px; padding-right: 85px`. Eyebrows are centred with `left: 50%; transform: translateX(-50%)`, not padded.
- **No decorative separators.** No horizontal rules, dashes, or line dividers between text elements. Whitespace alone creates separation.

### Brand marks

- **No horizontal logo lockup on social posts.** The lockup (symbol + wordmark) belongs to pitch decks, website headers, and partner materials.
- **No symbol on social posts.** The bottom eyebrow carries the URL (e.g. `MOREMUSLIM.ORG`) as the sole brand sign-off. The symbol is not used.

### Copy

- **Never use the show tagline as body copy.** "A narrative audio documentary series that explores the Muslim experience, with all its messiness" is a show description for pitch and press contexts. Body copy on a social post must be specific to the subject of that post.
- **Be concrete and specific.** Tell the reader exactly what the post is about. Abstract brand language is a placeholder, not content. If the post announces a job, describe the job. If it announces an episode, describe the episode.

---

## 11. Loading the Design System

```html
<!-- In any HTML file -->
<link rel="stylesheet" href="_ds/more-muslim/styles.css">
<script src="_ds/more-muslim/_ds_bundle.js"></script>

<script>
  const { Button, Symbol, PatternPanel, PullQuote } = window.MoreMuslimDesignSystem_019df4;
</script>
```

In a DC template, use `<helmet><script src="./ds-base.js"></script></helmet>` and mount components with `<x-import component-from-global-scope="MoreMuslimDesignSystem_019df4.ComponentName" …>`.
