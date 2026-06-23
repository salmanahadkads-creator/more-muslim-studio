import * as React from "react";

/** The 20 official pattern tile IDs (real ZAINA artwork in assets/patterns/). */
export type PatternTileId =
  | "1A" | "1B" | "1C" | "2A" | "2B" | "2C" | "3A" | "3B" | "3C" | "4A"
  | "4B" | "4C" | "5A" | "5B" | "5C" | "6A" | "6B" | "6C" | "7A" | "7B";

export interface PatternTileMeta {
  id: PatternTileId;
  ground: string;
  ink: string;
  weight: "solid" | "line" | "fine" | "duo";
}

/** Catalogue of the official tiles. The ONLY permitted star patterns. */
export const PATTERN_TILES: PatternTileMeta[];

/**
 * Brand background: places ONE OFFICIAL star-lattice tile (real artwork PNG)
 * full-bleed, plus an optional film-grain overlay. It never draws or generates
 * a pattern itself — choose a tile from PATTERN_TILES.
 */
export interface PatternPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which official tile to use, e.g. "6B". Takes priority over way/color. */
  tile?: PatternTileId;
  /** Colourway name (beige|harvest|terracotta|oak|mist|coastal|stone|night) — picks its ground tile. */
  way?: string;
  /** Fallback ground colour shown behind the artwork while it loads. */
  color?: string;
  /** Escape hatch: explicit official image URL. Must point at an official tile. */
  src?: string;
  /** Override the resolved assets root (defaults to the loaded bundle's folder). */
  basePath?: string;
  /** background-size: "cover" (default) | "contain" | a CSS length (tiled). */
  size?: string;
  /** background-position. Default "center". */
  position?: string;
  /** Film-grain overlay. Default true. */
  grain?: boolean;
  grainOpacity?: number;
  /** Corner radius. Default --radius-card. */
  radius?: string;
}

export function PatternPanel(props: PatternPanelProps): JSX.Element;
