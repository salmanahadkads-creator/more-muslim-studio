import React from "react";

/**
 * OFFICIAL PATTERN TILES — the only patterns the brand permits.
 *
 * These are the real ZAINA artwork files shipped in `assets/patterns/`
 * (`Al-Mujadilah_More-Muslim_Patterns_*`). Each tile bakes in its own
 * ground colour + tone-on-tone 8-point-star lattice. NEVER hand-draw,
 * generate, or recolour a star pattern — pick a tile from this catalogue.
 *
 * id      → file `assets/patterns/pattern-<id>.png` (lower-cased)
 * ground  → the baked background colour family
 * ink     → the star/line colour family
 * weight  → "solid" (filled stars) · "line" (bold outline) · "fine" (subtle
 *            hairline, best for discreet backgrounds) · "duo" (two-colour)
 */
export const PATTERN_TILES = [
  { id: "1A", ground: "beige",     ink: "harvest",   weight: "solid" },
  { id: "1B", ground: "stone",     ink: "coastal",   weight: "solid" },
  { id: "1C", ground: "coastal",   ink: "night",     weight: "solid" },
  { id: "2A", ground: "harvest",   ink: "beige",     weight: "solid" },
  { id: "2B", ground: "mist",      ink: "coastal",   weight: "solid" },
  { id: "2C", ground: "night",     ink: "stone",     weight: "solid" },
  { id: "3A", ground: "harvest",   ink: "terracotta",weight: "line"  },
  { id: "3B", ground: "oak",       ink: "terracotta",weight: "line"  },
  { id: "3C", ground: "coastal",   ink: "mist",      weight: "line"  },
  { id: "4A", ground: "terracotta",ink: "oak",       weight: "line"  },
  { id: "4B", ground: "beige",     ink: "terracotta",weight: "line"  },
  { id: "4C", ground: "night",     ink: "coastal",   weight: "line"  },
  { id: "5A", ground: "beige",     ink: "terracotta",weight: "fine"  },
  { id: "5B", ground: "terracotta",ink: "harvest",   weight: "fine"  },
  { id: "5C", ground: "night",     ink: "coastal",   weight: "fine"  },
  { id: "6A", ground: "beige",     ink: "oak",       weight: "fine"  },
  { id: "6B", ground: "oak",       ink: "terracotta",weight: "fine"  },
  { id: "6C", ground: "coastal",   ink: "stone",     weight: "fine"  },
  { id: "7A", ground: "harvest",   ink: "terracotta",weight: "duo"   },
  { id: "7B", ground: "coastal",   ink: "stone",     weight: "duo"   },
];

/** Default tile per ground family — used when a colourway is given but no tile. */
const GROUND_TILE = {
  beige: "6A", ivory: "6A",
  harvest: "3A", yellow: "3A",
  terracotta: "5B", terra: "5B",
  oak: "6B",
  mist: "2B",
  coastal: "6C",
  stone: "1B",
  night: "5C",
};

/** Map of literal ground colours (hex + brand CSS vars) → default tile. */
const COLOR_TILE = {
  "#511c13": "6B", "var(--more-oak-brown)": "6B",
  "#192136": "5C", "var(--more-night-blue)": "5C",
  "#fbf1e4": "6A", "#f6e1c7": "6A", "var(--more-ivory-beige)": "6A",
  "#c15a3a": "5B", "var(--more-terracotta)": "5B",
  "#e2b16d": "3A", "var(--more-harvest-yellow)": "3A",
  "#9fbccc": "2B", "var(--more-mist-blue)": "2B",
  "#6185a3": "6C", "var(--more-coastal-blue)": "6C",
  "#3c5065": "1B", "var(--more-stone-blue)": "1B",
};

const VALID = new Set(PATTERN_TILES.map((t) => t.id));

/** Resolve the asset base from the loaded `_ds_bundle.js` script URL. */
function dsAssetBase() {
  try {
    const scripts = document.querySelectorAll("script[src]");
    for (const s of scripts) {
      if (/_ds_bundle\.js(\?|#|$)/.test(s.src || "")) {
        return s.src.replace(/_ds_bundle\.js.*$/, "");
      }
    }
  } catch (e) { /* SSR / no DOM */ }
  return "";
}

function resolveTile({ tile, way, color }) {
  if (tile) {
    const up = String(tile).toUpperCase();
    if (VALID.has(up)) return up;
  }
  if (way && GROUND_TILE[String(way).toLowerCase()]) return GROUND_TILE[String(way).toLowerCase()];
  if (color) {
    const key = String(color).trim().toLowerCase();
    if (COLOR_TILE[key]) return COLOR_TILE[key];
  }
  return "5C"; // discreet night default
}

/**
 * Brand background panel. Renders one of the OFFICIAL star-lattice tiles
 * (real artwork PNGs) full-bleed, with an optional film-grain noise overlay.
 *
 * Pick a tile explicitly with `tile="6B"`, or pass a `way`/`color` and the
 * matching ground tile is chosen for you. The panel NEVER draws its own
 * pattern — it only places official artwork.
 *
 *   <PatternPanel tile="6B" style={{ minHeight: 420, padding: 48 }}>…</PatternPanel>
 *   <PatternPanel way="night">…</PatternPanel>
 */
export function PatternPanel({
  children,
  tile,
  way,
  color,                 // fallback ground shown behind the artwork while it loads
  src,                   // escape hatch: explicit image URL (still must be official)
  basePath,              // override the resolved assets root
  size = "cover",        // background-size: "cover" | "contain" | a CSS length (tiled)
  position = "center",
  grain = true,
  grainOpacity = 0.10,
  tileOpacity = 1,
  radius = "var(--radius-card)",
  style,
  ...rest
}) {
  const id = resolveTile({ tile, way, color });
  const base = basePath != null ? basePath : dsAssetBase();
  const url = src || `${base}assets/patterns/pattern-${id.toLowerCase()}.png`;
  const uid = React.useId().replace(/:/g, "");
  const tiled = size !== "cover" && size !== "contain";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: color || "var(--more-night-blue)",
        borderRadius: radius,
        isolation: "isolate",
        ...style,
      }}
      {...rest}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${url}")`,
          backgroundSize: tiled ? size : size,
          backgroundRepeat: tiled ? "repeat" : "no-repeat",
          backgroundPosition: position,
          opacity: tileOpacity,
          pointerEvents: "none",
        }}
      />
      {grain && (
        <svg aria-hidden="true" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: grainOpacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
          <filter id={`mm-grain-${uid}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#mm-grain-${uid})`} />
        </svg>
      )}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </div>
  );
}
