# Slides UI Kit — More Muslim Keynote

A branded keynote/overview deck (1280×720), based on the real presentation *"Imagining New Muslim Narratives in Media"* (Dr. Sohaira Siddiqui, Georgetown University in Qatar) and the partner-overview content.

- `index.html` — the **interactive deck** (arrow keys / on-screen nav, scales to any viewport, remembers your place). Open this.
- `screens.jsx` — slide templates + the ordered `DECK`. Assigns `window.MMSlides`.
- `*.card.html` — one card per slide type for the Design System tab.

**Slide types:** `TitleSlide`, `SectionSlide`, `StatementSlide`, `StatsSlide`, `QuoteSlide`, `ListSlide`, `ClosingSlide`. Each takes a `g` ground (`black`, `night`, `oak`, `beige`) and renders on the brand's star-lattice pattern with the symbol/logo. The title slide is black-ground with the beige logo, matching the real deck cover.
