The workhorse brand background — places one of the **official** tone-on-tone 8-point-star lattice tiles (real ZAINA artwork PNGs in `assets/patterns/`) full-bleed, with a little film grain on top. **It never draws or generates a pattern** — you only ever pick an official tile.

```jsx
// Pick a tile explicitly (see PATTERN_TILES for all 20):
<PatternPanel tile="6B" style={{ minHeight: 420, padding: 48 }}>
  <EyebrowLabel>Episode 6: Cape Malay</EyebrowLabel>
  <PullQuote>“…there's consequences of everything.”</PullQuote>
</PatternPanel>

// …or pass a colourway / ground colour and the matching tile is chosen:
<PatternPanel way="night">…</PatternPanel>
<PatternPanel color="var(--more-oak-brown)">…</PatternPanel>
```

Each tile bakes in its own ground + ink. Tiles `5A–6C` are the **fine/discreet** outlines best for backgrounds behind text; `1A–2C` are bold solid stars; `7A/7B` are two-colour and decorative. Set `grain={false}` for a cleaner look. **Never hand-draw, recolour, or procedurally generate a star pattern — always use a tile here.**
