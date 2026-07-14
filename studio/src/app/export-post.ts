/* PNG/JPG export for the post slide.
   A dedicated Canvas 2D painter mirrors the DOM templates at native size and
   draws through the standard createToolcraftPngExportCanvas helper so
   resolution and background follow runtime state. SVG-foreignObject snapshots
   are not used: Chromium now taints canvases for any foreignObject SVG image,
   so exported bytes must come from a real Canvas 2D pass. */

import {
  createToolcraftPngExportCanvas,
  evaluateToolcraftTimelineValue,
  type ToolcraftState,
} from "@/toolcraft/runtime";

import {
  COLOURWAYS,
  getEpisodeIllustration,
  getPostFormat,
  POST_SIZES,
  SYMBOLS,
  TEXT_WIDTH,
  type ColourwayKey,
  type PostFormat,
} from "./brand";
import { readCredits } from "./credits";
import { readFocusPercent } from "./post-renderer";
import type { PostTemplateKey } from "./templates";
import { createStoredZip } from "./zip-store";

const CAPS_TRACKING_EM = 0.165;
const MARIST = '"ABC Marist", Georgia, serif';

const imageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImage(src: string): Promise<HTMLImageElement> {
  let cached = imageCache.get(src);

  if (!cached) {
    cached = new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load export image: ${src}`));
      image.src = src;
    });
    imageCache.set(src, cached);
  }

  return cached;
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getPostExportBackground(state: ToolcraftState): string {
  // Evaluated at the playhead so a keyframed backdrop colour exports the
  // colour visible at the currently selected time.
  const value = evaluateToolcraftTimelineValue(state, "appearance.background");

  if (value && typeof value === "object" && "hex" in value) {
    const hex = (value as { hex?: unknown }).hex;

    if (typeof hex === "string" && hex) {
      return hex;
    }
  }

  return "#FBF2E9";
}

type PaintContext = CanvasRenderingContext2D & { letterSpacing?: string };

function setFont(
  context: PaintContext,
  sizePx: number,
  options: { italic?: boolean; tracked?: boolean } = {},
): void {
  context.font = `${options.italic ? "italic " : ""}400 ${sizePx}px ${MARIST}`;
  context.letterSpacing = options.tracked
    ? `${(sizePx * CAPS_TRACKING_EM).toFixed(2)}px`
    : "0px";
}

function wrapLines(
  context: PaintContext,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

function drawCenteredBlock(
  context: PaintContext,
  lines: string[],
  centerX: number,
  topY: number,
  sizePx: number,
  lineHeight = 1.2,
): number {
  let y = topY;

  for (const line of lines) {
    context.fillText(line, centerX, y + sizePx * (lineHeight / 2));
    y += sizePx * lineHeight;
  }

  return y;
}

function drawCoverImage(
  context: PaintContext,
  image: HTMLImageElement,
  frameW: number,
  frameH: number,
  focusX: number,
  focusY: number,
  zoom: number,
): void {
  const scale = Math.max(frameW / image.width, frameH / image.height) * zoom;
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  // object-position + transform-origin at (focusX%, focusY%): the focal point
  // of the image aligns with the same fraction of the frame.
  const x = (frameW - drawW) * (focusX / 100);
  const y = (frameH - drawH) * (focusY / 100);

  context.drawImage(image, x, y, drawW, drawH);
}

let grainImagePromise: Promise<HTMLImageElement> | null = null;

function loadGrainTile(): Promise<HTMLImageElement> {
  // Pure-SVG feTurbulence tile (no foreignObject, so it does not taint the
  // export canvas) matching the preview grain overlay.
  grainImagePromise ??= loadImage(
    "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="512" height="512" filter="url(#g)"/></svg>',
      ),
  );

  return grainImagePromise;
}

async function drawGrain(
  context: PaintContext,
  frameW: number,
  frameH: number,
  opacity: number,
): Promise<void> {
  const tile = await loadGrainTile();

  context.save();
  context.globalAlpha = opacity;
  context.globalCompositeOperation = "overlay";

  for (let y = 0; y < frameH; y += 512) {
    for (let x = 0; x < frameW; x += 512) {
      context.drawImage(tile, x, y);
    }
  }

  context.restore();
}

type SlidePaintInput = {
  format: PostFormat;
  includeBackground: boolean;
  state: ToolcraftState;
  template: PostTemplateKey;
  way: ColourwayKey;
};

export async function paintSlide(
  context: PaintContext,
  { format, includeBackground, state, template, way }: SlidePaintInput,
): Promise<void> {
  const values = state.values;
  const c = COLOURWAYS[way];
  const { h, w } = POST_SIZES[format];
  const textWidth = TEXT_WIDTH[format];
  const isStory = format === "story";
  const padTop = isStory ? 370 : 85;
  const padBottom = isStory ? 370 : 85;
  const source = readString(values["scene.source"], "pattern") || "pattern";
  const episode = readString(values["content.episode"]);

  await document.fonts.load(`400 77px ${MARIST}`);
  await document.fonts.load(`italic 400 56px ${MARIST}`);

  // --- Ground -------------------------------------------------------------
  if (includeBackground) {
    context.fillStyle = c.bg;
    context.fillRect(0, 0, w, h);

    let sceneImage: HTMLImageElement | null = null;

    if (source === "illustration") {
      const entry = getEpisodeIllustration(values["scene.illustration"]);

      sceneImage = entry ? await loadImage(entry.src) : null;
    } else if (source === "upload") {
      const uploaded = state.mediaAssets.find(
        (asset) => asset.sourceTarget === "scene.upload",
      );

      sceneImage = uploaded ? await loadImage(uploaded.dataUrl) : null;
    }

    if (sceneImage) {
      const position = readFocusPercent(values["scene.imagePosition"]);
      const zoom =
        typeof values["scene.imageZoom"] === "number"
          ? (values["scene.imageZoom"] as number)
          : 1;

      drawCoverImage(context, sceneImage, w, h, position.x, position.y, zoom);
    } else {
      if (source !== "solid" && c.tile) {
        const tile = await loadImage(c.tile);

        context.save();
        context.globalAlpha = c.tileOpacity;

        const tileScale = Math.max(w / tile.width, h / tile.height);

        context.drawImage(tile, 0, 0, tile.width * tileScale, tile.height * tileScale);
        context.restore();
      }

      await drawGrain(context, w, h, c.grain);
    }
  }

  // --- Copy ---------------------------------------------------------------
  context.fillStyle = c.ink;
  context.textAlign = "center";
  context.textBaseline = "middle";

  const centerX = w / 2;
  const contentTop = padTop;
  const contentBottom = h - padBottom;

  const drawEyebrow = (text: string, y: number): void => {
    setFont(context, 32, { tracked: true });
    context.fillText(text.toUpperCase(), centerX, y + 16);
  };

  const symbol = await loadImage(SYMBOLS[c.logo]);

  if (template === "cover") {
    drawEyebrow(readString(values["content.cover.presents"]), contentTop);
    setFont(context, 77, { tracked: true });

    const titleLines = wrapLines(
      context,
      readString(values["content.cover.title"]).toUpperCase(),
      textWidth,
    );

    drawCenteredBlock(context, titleLines, centerX, contentTop + 32 + 36, 77);

    // Footer: symbol left (translate -37, 36 from the pad corner), episode centred.
    context.drawImage(symbol, 85 - 37, contentBottom - 216 + 36, 216, 216);
    setFont(context, 32, { tracked: true });
    context.fillText(episode.toUpperCase(), centerX, contentBottom - 16);
  } else if (template === "quote") {
    drawEyebrow(episode, contentTop);

    const dialogue = readString(values["content.quote.dialogue"]);
    const exchanges = dialogue
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^([^:]{1,40}):\s*(.+)$/);

        return match
          ? { speaker: match[1].trim(), text: match[2].trim() }
          : { speaker: "", text: line };
      });
    const speakerSize = isStory ? 64 : 32;
    const quoteSize = isStory ? 56 : 42;
    const innerGap = isStory ? 48 : 20;
    const groupGap = isStory ? 72 : 56;

    // Measure total height to centre the stack between eyebrow and footer.
    const blocks = exchanges.map((exchange) => {
      setFont(context, quoteSize, { italic: isStory });

      const lines = wrapLines(context, exchange.text, textWidth);

      return { exchange, height: speakerSize * 1.2 + innerGap + lines.length * quoteSize * 1.2, lines };
    });
    const totalHeight =
      blocks.reduce((sum, block) => sum + block.height, 0) +
      groupGap * Math.max(0, blocks.length - 1);
    const areaTop = contentTop + 32 + (isStory ? 80 : 56);
    const areaBottom = contentBottom - 32 - 28;
    let y = areaTop + (areaBottom - areaTop - totalHeight) / 2;

    for (const block of blocks) {
      setFont(context, speakerSize, { tracked: true });
      context.fillText(block.exchange.speaker.toUpperCase(), centerX, y + speakerSize * 0.6);
      y += speakerSize * 1.2 + innerGap;
      setFont(context, quoteSize, { italic: isStory });
      y = drawCenteredBlock(context, block.lines, centerX, y, quoteSize);
      y += groupGap;
    }

    setFont(context, 32, { tracked: true });
    context.fillText("MOREMUSLIM.ORG", centerX, contentBottom - 16);
  } else if (template === "synopsis") {
    drawEyebrow(episode, contentTop);

    const paragraphs = readString(values["content.synopsis.body"])
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    const totalLength = paragraphs.join("").length;
    const bodySize = totalLength > 200 ? 56 : 77;

    setFont(context, bodySize);

    const paragraphLines = paragraphs.map((paragraph) =>
      wrapLines(context, paragraph, textWidth),
    );
    const totalHeight =
      paragraphLines.reduce((sum, lines) => sum + lines.length * bodySize * 1.2, 0) +
      40 * Math.max(0, paragraphLines.length - 1);
    const areaTop = contentTop + 32 + 64;
    const areaBottom = contentBottom - 32 - 56;
    let y = areaTop + (areaBottom - areaTop - totalHeight) / 2;

    context.textAlign = "left";

    const blockLeft = centerX - textWidth / 2;

    for (const lines of paragraphLines) {
      for (const line of lines) {
        context.fillText(line, blockLeft, y + bodySize * 0.6);
        y += bodySize * 1.2;
      }

      y += 40;
    }

    context.textAlign = "center";
    setFont(context, 32, { tracked: true });
    context.fillText("MOREMUSLIM.ORG", centerX, contentBottom - 16);
  } else if (template === "streaming") {
    const lines = readString(values["content.streaming.lines"])
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    setFont(context, 56, { tracked: true });

    const headingLines = [
      ...wrapLines(context, episode.toUpperCase(), textWidth),
      "NOW STREAMING",
    ];

    setFont(context, 56);

    const bodyLines = lines.flatMap((line) => wrapLines(context, line, textWidth));
    const totalHeight =
      headingLines.length * 56 * 1.2 + 48 + bodyLines.length * 56 * 1.2;
    const footerHeight = 216 + 28 + 32;
    const areaTop = contentTop;
    const areaBottom = contentBottom - footerHeight;
    let y = areaTop + (areaBottom - areaTop - totalHeight) / 2;

    setFont(context, 56, { tracked: true });
    y = drawCenteredBlock(context, headingLines, centerX, y, 56);
    y += 48;
    setFont(context, 56);
    drawCenteredBlock(context, bodyLines, centerX, y, 56);

    context.drawImage(symbol, centerX - 108, contentBottom - footerHeight + 8, 216, 216);
    setFont(context, 32, { tracked: true });
    context.fillText("MOREMUSLIM.ORG", centerX, contentBottom - 16);
  } else {
    drawEyebrow("Episode Credits", contentTop);

    const credits = readCredits(values["content.credits.list"]);
    const rowHeight = (credit: { title: string }): number =>
      32 * 1.2 * (credit.title ? 2 : 1);
    const totalHeight =
      credits.reduce((sum, credit) => sum + rowHeight(credit), 0) +
      48 * Math.max(0, credits.length - 1);
    const areaTop = contentTop + 32 + 56;
    const areaBottom = contentBottom - 32 - 40;
    let y = areaTop + (areaBottom - areaTop - totalHeight) / 2;

    for (const credit of credits) {
      setFont(context, 32, { tracked: true });
      context.fillText(credit.name.toUpperCase(), centerX, y + 32 * 0.6);
      y += 32 * 1.2;

      if (credit.title) {
        setFont(context, 32);
        context.fillText(credit.title, centerX, y + 32 * 0.6);
        y += 32 * 1.2;
      }

      y += 48;
    }

    setFont(context, 32, { tracked: true });
    context.fillText(episode.toUpperCase(), centerX, contentBottom - 16);
  }
}

export async function exportPostImage(state: ToolcraftState): Promise<void> {
  const format = getPostFormat(state.canvas.size.width, state.canvas.size.height);
  const native = POST_SIZES[format];
  const template = (readString(state.values["post.template"], "cover") ||
    "cover") as PostTemplateKey;
  const way = (readString(state.values["post.colourway"], "night") ||
    "night") as ColourwayKey;
  const includeBackground = state.values["export.includeBackground"] !== false;

  // Pre-render the slide once at native size, then place it via the standard
  // export helper so export.image.resolution drives the real pixel size.
  const slideCanvas = document.createElement("canvas");

  slideCanvas.width = native.w;
  slideCanvas.height = native.h;

  const slideContext = slideCanvas.getContext("2d");

  if (!slideContext) {
    throw new Error("PNG export requires a 2D canvas context.");
  }

  await paintSlide(slideContext, { format, includeBackground, state, template, way });

  const imageFormat = state.values["export.image.format"] === "jpg" ? "jpg" : "png";
  const canvas = createToolcraftPngExportCanvas({
    background: getPostExportBackground(state),
    includeBackground,
    resolution: state.values["export.image.resolution"] as string | undefined,
    render: ({ cssHeight, cssWidth, context }) => {
      // Match the preview: fit the native slide centred inside the canvas.
      const scale = Math.min(cssWidth / native.w, cssHeight / native.h);
      const drawWidth = native.w * scale;
      const drawHeight = native.h * scale;

      context.drawImage(
        slideCanvas,
        (cssWidth - drawWidth) / 2,
        (cssHeight - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    },
    state,
  });
  const mimeType = imageFormat === "jpg" ? "image/jpeg" : "image/png";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("PNG export produced an empty image.")),
      mimeType,
      imageFormat === "jpg" ? 0.92 : undefined,
    );
  });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.download = `more-muslim-post-${template}.${imageFormat}`;
  anchor.href = downloadUrl;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 10_000);
}

async function paintSlideBytes(state: ToolcraftState): Promise<Uint8Array<ArrayBuffer>> {
  const format = getPostFormat(state.canvas.size.width, state.canvas.size.height);
  const native = POST_SIZES[format];
  const template = (readString(state.values["post.template"], "cover") ||
    "cover") as PostTemplateKey;
  const way = (readString(state.values["post.colourway"], "night") ||
    "night") as ColourwayKey;
  const includeBackground = state.values["export.includeBackground"] !== false;
  const canvas = document.createElement("canvas");

  canvas.width = native.w;
  canvas.height = native.h;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Carousel export requires a 2D canvas context.");
  }

  await paintSlide(context, { format, includeBackground, state, template, way });

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("Carousel export produced an empty slide.")),
      "image/png",
    );
  });

  return new Uint8Array(await blob.arrayBuffer());
}

/* Export every visible slide layer as numbered PNGs in one ZIP, in layer
   order, using each slide's snapshotted values (the selected slide uses the
   live values). */
export async function exportCarouselZip(
  state: ToolcraftState,
  reportProgress?: (progress: number) => void,
): Promise<void> {
  const slides = (state.values["carousel.slides"] ?? {}) as Record<
    string,
    Record<string, unknown>
  >;
  const layers = state.layers.filter((layer) => layer.visible);

  if (layers.length === 0) {
    throw new Error("Add at least one slide layer before exporting the carousel.");
  }

  const entries = [];

  for (const [index, layer] of layers.entries()) {
    const snapshot = layer.id === state.selectedLayerId ? {} : (slides[layer.id] ?? {});
    const slideState = {
      ...state,
      values: { ...state.values, ...snapshot },
    } as ToolcraftState;

    entries.push({
      data: await paintSlideBytes(slideState),
      name: `slide-${String(index + 1).padStart(2, "0")}.png`,
    });
    reportProgress?.((index + 1) / layers.length);
  }

  const downloadUrl = URL.createObjectURL(createStoredZip(entries));
  const anchor = document.createElement("a");

  anchor.download = "more-muslim-carousel.zip";
  anchor.href = downloadUrl;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 10_000);
}
