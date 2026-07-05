/* More Muslim brand tokens and assets for the social post product.
   Source of truth: ZAINA "Brand Elements for More Muslim", 02.2026, and the
   legacy studio at ../ui_kits/social. Only official artwork is referenced —
   never generate or recolour star-lattice patterns. */

import pattern1b from "../../../assets/patterns/pattern-1b.png";
import pattern2b from "../../../assets/patterns/pattern-2b.png";
import pattern3a from "../../../assets/patterns/pattern-3a.png";
import pattern5b from "../../../assets/patterns/pattern-5b.png";
import pattern5c from "../../../assets/patterns/pattern-5c.png";
import pattern6a from "../../../assets/patterns/pattern-6a.png";
import pattern6b from "../../../assets/patterns/pattern-6b.png";
import pattern6c from "../../../assets/patterns/pattern-6c.png";

import illusEp1 from "../../../assets/imagery/illus-ep1.jpg";
import illusEp2 from "../../../assets/imagery/illus-ep2.jpg";
import illusEp3 from "../../../assets/imagery/illus-ep3.jpg";
import illusEp4 from "../../../assets/imagery/illus-ep4.jpg";
import illusEp5 from "../../../assets/imagery/illus-ep5.jpg";
import illusEp6 from "../../../assets/imagery/illus-ep6.jpg";
import illusEp7 from "../../../assets/imagery/illus-ep7.jpg";
import illusEp8 from "../../../assets/imagery/illus-ep8.jpg";
import illusEp9 from "../../../assets/imagery/illus-ep9.jpg";
import illusEp10 from "../../../assets/imagery/illus-ep10.jpg";

import symbolBeige from "../../../assets/logos/symbol-beige.svg";
import symbolBlack from "../../../assets/logos/symbol-black.svg";
import symbolNight from "../../../assets/logos/symbol-night.svg";
import symbolOak from "../../../assets/logos/symbol-oak.svg";
import symbolTerracotta from "../../../assets/logos/symbol-terracotta.svg";

export type ColourwayKey =
  | "night"
  | "oak"
  | "beige"
  | "harvest"
  | "terracotta"
  | "mist"
  | "coastal"
  | "stone"
  | "black";

export type PostFormat = "portrait" | "story";

export type Colourway = {
  bg: string;
  grain: number;
  ink: string;
  label: string;
  logo: keyof typeof SYMBOLS;
  sub: string;
  tile: string | null;
  tileOpacity: number;
};

export const SYMBOLS = {
  beige: symbolBeige,
  black: symbolBlack,
  night: symbolNight,
  oak: symbolOak,
  terracotta: symbolTerracotta,
} as const;

/* Nine approved ground × ink pairings. Tiles are the official ZAINA
   star-lattice PNGs matched to each ground family. */
export const COLOURWAYS: Record<ColourwayKey, Colourway> = {
  night: { bg: "#192136", grain: 0.10, ink: "#F6E1C6", label: "Night Blue", logo: "beige", sub: "rgba(246,225,198,0.62)", tile: pattern5c, tileOpacity: 0.15 },
  oak: { bg: "#511C14", grain: 0.10, ink: "#F6E1C6", label: "Oak Brown", logo: "beige", sub: "rgba(246,225,198,0.66)", tile: pattern6b, tileOpacity: 0.15 },
  beige: { bg: "#FBF2E9", grain: 0.06, ink: "#511C14", label: "Ivory Beige", logo: "oak", sub: "rgba(81,28,20,0.62)", tile: pattern6a, tileOpacity: 0.10 },
  harvest: { bg: "#E2B16D", grain: 0.08, ink: "#511C14", label: "Harvest Yellow", logo: "oak", sub: "rgba(81,28,20,0.62)", tile: pattern3a, tileOpacity: 0.10 },
  terracotta: { bg: "#C15A3A", grain: 0.10, ink: "#F6E1C6", label: "Terracotta", logo: "beige", sub: "rgba(246,225,198,0.66)", tile: pattern5b, tileOpacity: 0.15 },
  mist: { bg: "#9FBCCC", grain: 0.07, ink: "#192136", label: "Mist Blue", logo: "night", sub: "rgba(25,33,54,0.7)", tile: pattern2b, tileOpacity: 0.10 },
  coastal: { bg: "#6185A3", grain: 0.08, ink: "#F6E1C6", label: "Coastal Blue", logo: "beige", sub: "rgba(246,225,198,0.66)", tile: pattern2b, tileOpacity: 0.12 },
  stone: { bg: "#3C5065", grain: 0.10, ink: "#F6E1C6", label: "Stone Blue", logo: "beige", sub: "rgba(246,225,198,0.66)", tile: pattern5c, tileOpacity: 0.15 },
  black: { bg: "#000000", grain: 0.14, ink: "#FBF2E9", label: "Black", logo: "beige", sub: "rgba(251,242,233,0.62)", tile: null, tileOpacity: 0 },
};

export const COLOURWAY_KEYS = Object.keys(COLOURWAYS) as readonly ColourwayKey[];

/* Instagram output sizes. Format is derived from the runtime canvas aspect —
   the runtime Setup section owns canvas size, the slide adapts its layout. */
export const POST_SIZES: Record<PostFormat, { h: number; w: number }> = {
  portrait: { h: 1350, w: 1080 },
  story: { h: 1920, w: 1080 },
};

export const TEXT_WIDTH: Record<PostFormat, number> = {
  portrait: 910,
  story: 900,
};

export type EpisodeIllustration = {
  label: string;
  src: string;
  value: string;
};

export const EPISODE_ILLUSTRATIONS: readonly EpisodeIllustration[] = [
  { label: "E1 Side Entrances", src: illusEp1, value: "ep1" },
  { label: "E2 Nikkah Loophole", src: illusEp2, value: "ep2" },
  { label: "E3 Secret Translators", src: illusEp3, value: "ep3" },
  { label: "E4 Recitation Revolution", src: illusEp4, value: "ep4" },
  { label: "E5 Hanabneehu", src: illusEp5, value: "ep5" },
  { label: "E6 Cape Malay", src: illusEp6, value: "ep6" },
  { label: "E7 SheikhaGPT", src: illusEp7, value: "ep7" },
  { label: "E8 Travelling Sisterhood", src: illusEp8, value: "ep8" },
  { label: "E9 A More Muslim Japan", src: illusEp9, value: "ep9" },
  { label: "E10 Washing the Dead", src: illusEp10, value: "ep10" },
];

export function getEpisodeIllustration(value: unknown): EpisodeIllustration | null {
  return EPISODE_ILLUSTRATIONS.find((entry) => entry.value === value) ?? null;
}

export function getPostFormat(canvasWidth: number, canvasHeight: number): PostFormat {
  const ratio = canvasHeight / Math.max(1, canvasWidth);
  const portraitRatio = POST_SIZES.portrait.h / POST_SIZES.portrait.w;
  const storyRatio = POST_SIZES.story.h / POST_SIZES.story.w;

  return Math.abs(ratio - storyRatio) < Math.abs(ratio - portraitRatio)
    ? "story"
    : "portrait";
}
