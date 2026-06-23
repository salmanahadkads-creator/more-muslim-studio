# Website UI Kit — moremuslim.org

Interactive recreation of the More Muslim podcast site, built on the brand system. **Content (episodes, team, copy) is pulled from the live site** at moremuslim.org; the **visual layout is brand-derived** (the live site runs on WordPress — this is a faithful brand interpretation, not a pixel copy).

- `index.html` — the app: Home → Episode → About, with a working audio scrubber. Open this.
- `screens.jsx` — `Header`, `Home`, `EpisodePage`, `About`, `Footer` + the real Season One `EPISODES` data. Composes design-system primitives (`Button`, `EpisodeCard` patterns, `AudioBar`, `PullQuote`, `Avatar`, `Symbol`, `PatternPanel`).

**Screens**
- **Home** — editorial hero (the tagline), featured latest episode, Season One grid.
- **Episode** — cover, host, `AudioBar` player, synopsis, pull-quote, episode credits, "more from Season One".
- **About** — show description + audience stats.

Episodes without supplied artwork use a `PatternPanel` cover with the star symbol (an authentic brand fallback). Two episodes use real artwork copied from the brand's social posts.
