# Social UI Kit — More Muslim

The brand's **primary output**: square / portrait / story posts for Instagram. Recreated from the real episode posts (E7 *In Therapy, with SheikhAGPT*; E6 *Cape Malay*).

- `index.html` — **Social Studio**: pick a template, colourway and format and preview the post at native resolution. Open this.
- `screens.jsx` — the post templates (`CoverPost`, `QuotePost`, `SynopsisPost`, `NowStreamingPost`, `CreditsPost`) + the `PostFrame` canvas. Assigns to `window.MMSocial`; composes design-system primitives (`PatternPanel`, `PullQuote`, `Symbol`).

**Canvases:** square `1080×1080`, portrait `1080×1350`, story `1080×1920`.
**Colourways:** `oak`, `night`, `beige`, `black`, `mist`, `terra` — each maps ground + lattice line + text + accent + which logo colourway to use.

Every post is built on `PatternPanel` (solid brand colour + tone-on-tone star lattice + film grain) with the symbol or wordmark as the sign-off, exactly like the reference posts.

## Official template taxonomy (ZAINA, 23.02.2026)

The brand's social spec defines two canvases — **Posts Portrait 4:5 (1080×1350)** and **Stories 9:16 (1080×1920)** — each in **Positive** (light/beige ground) and **Negative** (dark ground) families, across these layouts: *Image Full Bleed*, *Image Framed* (photo in an inset frame on a colour/pattern ground), *Image Crop + Text*, *Text*, and *Background Pattern + Text*. Recurring content templates: **Quote** (big italic quote + `— NAME SURNAME` / role), **Now Streaming** (`EPISODE 0` · episode name · "NOW STREAMING ON APPLE PODCASTS, SPOTIFY, AND ALL PODCAST PLATFORMS" · `S0 E0`), **Episode Credits** (`NAME SURNAME` / Title grid), and **Synopsis** (eyebrow + subhead + body). Sign-off is `MOREMUSLIM.ORG`, centred. This kit implements the core set; the Studio's colourway swatches map to the Positive/Negative families.
