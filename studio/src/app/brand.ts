/* More Muslim brand tokens and assets for the social post product.
   Source of truth: ZAINA "Brand Elements for More Muslim", 02.2026, and the
   legacy studio at ../ui_kits/social. Only official artwork is referenced —
   never generate or recolour star-lattice patterns. */

const pattern1b = new URL("../../../assets/patterns/pattern-1b.png", import.meta.url).href;
const pattern2b = new URL("../../../assets/patterns/pattern-2b.png", import.meta.url).href;
const pattern3a = new URL("../../../assets/patterns/pattern-3a.png", import.meta.url).href;
const pattern5b = new URL("../../../assets/patterns/pattern-5b.png", import.meta.url).href;
const pattern5c = new URL("../../../assets/patterns/pattern-5c.png", import.meta.url).href;
const pattern6a = new URL("../../../assets/patterns/pattern-6a.png", import.meta.url).href;
const pattern6b = new URL("../../../assets/patterns/pattern-6b.png", import.meta.url).href;
const pattern6c = new URL("../../../assets/patterns/pattern-6c.png", import.meta.url).href;
const illusEp1 = new URL("../../../assets/imagery/illus-ep1.jpg", import.meta.url).href;
const illusEp2 = new URL("../../../assets/imagery/illus-ep2.jpg", import.meta.url).href;
const illusEp3 = new URL("../../../assets/imagery/illus-ep3.jpg", import.meta.url).href;
const illusEp4 = new URL("../../../assets/imagery/illus-ep4.jpg", import.meta.url).href;
const illusEp5 = new URL("../../../assets/imagery/illus-ep5.jpg", import.meta.url).href;
const illusEp6 = new URL("../../../assets/imagery/illus-ep6.jpg", import.meta.url).href;
const illusEp7 = new URL("../../../assets/imagery/illus-ep7.jpg", import.meta.url).href;
const illusEp8 = new URL("../../../assets/imagery/illus-ep8.jpg", import.meta.url).href;
const illusEp9 = new URL("../../../assets/imagery/illus-ep9.jpg", import.meta.url).href;
const illusEp10 = new URL("../../../assets/imagery/illus-ep10.jpg", import.meta.url).href;
// ~1280px preview copies of each illustration: the preview renders at ~540px on
// screen, so these ~150-500KB files load and decode fast, while the full-res
// originals above stay reserved for export fidelity.
const illusEp1Preview = new URL("../../../assets/imagery/illus-ep1-preview.jpg", import.meta.url).href;
const illusEp2Preview = new URL("../../../assets/imagery/illus-ep2-preview.jpg", import.meta.url).href;
const illusEp3Preview = new URL("../../../assets/imagery/illus-ep3-preview.jpg", import.meta.url).href;
const illusEp4Preview = new URL("../../../assets/imagery/illus-ep4-preview.jpg", import.meta.url).href;
const illusEp5Preview = new URL("../../../assets/imagery/illus-ep5-preview.jpg", import.meta.url).href;
const illusEp6Preview = new URL("../../../assets/imagery/illus-ep6-preview.jpg", import.meta.url).href;
const illusEp7Preview = new URL("../../../assets/imagery/illus-ep7-preview.jpg", import.meta.url).href;
const illusEp8Preview = new URL("../../../assets/imagery/illus-ep8-preview.jpg", import.meta.url).href;
const illusEp9Preview = new URL("../../../assets/imagery/illus-ep9-preview.jpg", import.meta.url).href;
const illusEp10Preview = new URL("../../../assets/imagery/illus-ep10-preview.jpg", import.meta.url).href;
const symbolBeige = new URL("../../../assets/logos/symbol-beige.svg", import.meta.url).href;
const symbolBlack = new URL("../../../assets/logos/symbol-black.svg", import.meta.url).href;
const symbolNight = new URL("../../../assets/logos/symbol-night.svg", import.meta.url).href;
const symbolOak = new URL("../../../assets/logos/symbol-oak.svg", import.meta.url).href;
const symbolTerracotta = new URL("../../../assets/logos/symbol-terracotta.svg", import.meta.url).href;




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
  accent: string;
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
  night: { accent: "#E2B16D", bg: "#192136", grain: 0.10, ink: "#F6E1C6", label: "Night Blue", logo: "beige", sub: "rgba(246,225,198,0.62)", tile: pattern5c, tileOpacity: 0.15 },
  oak: { accent: "#E2B16D", bg: "#511C14", grain: 0.10, ink: "#F6E1C6", label: "Oak Brown", logo: "beige", sub: "rgba(246,225,198,0.66)", tile: pattern6b, tileOpacity: 0.15 },
  beige: { accent: "#C15A3A", bg: "#FBF2E9", grain: 0.06, ink: "#511C14", label: "Ivory Beige", logo: "oak", sub: "rgba(81,28,20,0.62)", tile: pattern6a, tileOpacity: 0.10 },
  harvest: { accent: "#C15A3A", bg: "#E2B16D", grain: 0.08, ink: "#511C14", label: "Harvest Yellow", logo: "oak", sub: "rgba(81,28,20,0.62)", tile: pattern3a, tileOpacity: 0.10 },
  terracotta: { accent: "#E2B16D", bg: "#C15A3A", grain: 0.10, ink: "#F6E1C6", label: "Terracotta", logo: "beige", sub: "rgba(246,225,198,0.66)", tile: pattern5b, tileOpacity: 0.15 },
  mist: { accent: "#C15A3A", bg: "#9FBCCC", grain: 0.07, ink: "#192136", label: "Mist Blue", logo: "night", sub: "rgba(25,33,54,0.7)", tile: pattern2b, tileOpacity: 0.10 },
  coastal: { accent: "#E2B16D", bg: "#6185A3", grain: 0.08, ink: "#F6E1C6", label: "Coastal Blue", logo: "beige", sub: "rgba(246,225,198,0.66)", tile: pattern2b, tileOpacity: 0.12 },
  stone: { accent: "#E2B16D", bg: "#3C5065", grain: 0.10, ink: "#F6E1C6", label: "Stone Blue", logo: "beige", sub: "rgba(246,225,198,0.66)", tile: pattern5c, tileOpacity: 0.15 },
  black: { accent: "#E2B16D", bg: "#000000", grain: 0.14, ink: "#FBF2E9", label: "Black", logo: "beige", sub: "rgba(251,242,233,0.62)", tile: null, tileOpacity: 0 },
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
  /** Full-resolution source, used only for export. */
  src: string;
  /** Lightweight ~1280px copy, used for the live preview and picker. */
  previewSrc: string;
  value: string;
};

export const EPISODE_ILLUSTRATIONS: readonly EpisodeIllustration[] = [
  { label: "E1 Side Entrances", previewSrc: illusEp1Preview, src: illusEp1, value: "ep1" },
  { label: "E2 Nikkah Loophole", previewSrc: illusEp2Preview, src: illusEp2, value: "ep2" },
  { label: "E3 Secret Translators", previewSrc: illusEp3Preview, src: illusEp3, value: "ep3" },
  { label: "E4 Recitation Revolution", previewSrc: illusEp4Preview, src: illusEp4, value: "ep4" },
  { label: "E5 Hanabneehu", previewSrc: illusEp5Preview, src: illusEp5, value: "ep5" },
  { label: "E6 Cape Malay", previewSrc: illusEp6Preview, src: illusEp6, value: "ep6" },
  { label: "E7 SheikhaGPT", previewSrc: illusEp7Preview, src: illusEp7, value: "ep7" },
  { label: "E8 Travelling Sisterhood", previewSrc: illusEp8Preview, src: illusEp8, value: "ep8" },
  { label: "E9 A More Muslim Japan", previewSrc: illusEp9Preview, src: illusEp9, value: "ep9" },
  { label: "E10 Washing the Dead", previewSrc: illusEp10Preview, src: illusEp10, value: "ep10" },
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
