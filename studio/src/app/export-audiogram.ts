/* Audiogram MP4 export.
   Offline-rendered frames (Canvas 2D painter — Chromium taints canvases for
   SVG-foreignObject snapshots, so the legacy snapshot approach is not usable)
   encoded with WebCodecs H.264 into an mp4-muxer container with an AAC track
   decoded from the uploaded audio. Timestamps are timeline-based (frame index
   over fps), never wall-clock, so backgrounded tabs cannot stretch duration. */

import {
  ArrayBufferTarget as Mp4ArrayBufferTarget,
  Muxer as Mp4Muxer,
} from "mp4-muxer";
import {
  ArrayBufferTarget as WebmArrayBufferTarget,
  Muxer as WebmMuxer,
} from "webm-muxer";

import {
  evaluateToolcraftTimelineValue,
  getToolcraftVideoExportSize,
  shouldIncludeToolcraftExportBackground,
  type ToolcraftMediaAsset,
  type ToolcraftState,
} from "@/toolcraft/runtime";

import {
  COLOURWAYS,
  getEpisodeIllustration,
  POST_SIZES,
  SYMBOLS,
  type ColourwayKey,
} from "./brand";
import {
  activeBlockIndex,
  applyBlockTextOverrides,
  breatheOpacity,
  buildSpeechBlocks,
  computeAudioEnvelope,
  finalCardProgress,
  firstName,
  groundMotion,
  groundState,
  highlightSet,
  outroFadeAt,
  OUTRO_FADE_DELAYS,
  outroProgress,
  outroStartAt,
  speakersOf,
  wordVisual,
  type AudiogramMotionConfig,
  type AudiogramSpeechBlock,
} from "./audiogram-motion";
import {
  decodeCaptionAsset,
  readBlockOverrides,
  readFocusPercent,
  readHighlightLines,
  readPercentFactor,
} from "./post-renderer";
import { parseSrt } from "./srt";

const FPS = 24;
const MARIST = '"ABC Marist", Georgia, serif';
const CAPS_TRACKING_EM = 0.165;

type PaintContext = CanvasRenderingContext2D & { letterSpacing?: string };

/* Walk an MPEG-4 descriptor tree and return the DecoderSpecificInfo (tag 5)
   payload — for AAC that is the AudioSpecificConfig. Handles the nested
   ES_Descriptor (3) → DecoderConfigDescriptor (4) → DecoderSpecificInfo (5)
   shape, including the optional ES_Descriptor fields. */
function findDecoderSpecificInfo(
  bytes: Uint8Array,
  start: number,
  end: number,
): Uint8Array | null {
  let index = start;

  while (index < end) {
    const tag = bytes[index];

    index += 1;

    let length = 0;

    for (;;) {
      if (index >= end) {
        return null;
      }

      const byte = bytes[index];

      index += 1;
      length = (length << 7) | (byte & 0x7f);

      if (!(byte & 0x80)) {
        break;
      }
    }

    const payloadEnd = Math.min(index + length, end);

    if (tag === 0x05) {
      return bytes.subarray(index, payloadEnd);
    }

    if (tag === 0x03) {
      // ES_Descriptor: ES_ID (2) + flags (1), then optional fields.
      const flags = bytes[index + 2];
      let nested = index + 3;

      if (flags & 0x80) {
        nested += 2; // dependsOn_ES_ID
      }

      if (flags & 0x40) {
        nested += 1 + bytes[nested]; // URLlength + URLstring
      }

      if (flags & 0x20) {
        nested += 2; // OCR_ES_Id
      }

      const found = findDecoderSpecificInfo(bytes, nested, payloadEnd);

      if (found) {
        return found;
      }
    } else if (tag === 0x04) {
      // DecoderConfigDescriptor: 13 fixed bytes, then nested descriptors.
      const found = findDecoderSpecificInfo(bytes, index + 13, payloadEnd);

      if (found) {
        return found;
      }
    }

    index = payloadEnd;
  }

  return null;
}

/* mp4-muxer builds the whole MPEG-4 descriptor tree itself and splices
   `decoderConfig.description` in where the bare AudioSpecificConfig belongs.
   Chrome's AAC encoder, however, can hand back a FULL ES_Descriptor. Passing
   that through nests one descriptor inside another, so the ASC a player reads
   starts with tag 0x03 (audioObjectType 0 — invalid), the AAC decoder never
   initialises, and the exported MP4 plays silent even though the audio track,
   its samples, and its duration are all present and correct.

   Unwrap to the bare AudioSpecificConfig (e.g. 0x1190 = AAC-LC/48kHz/stereo).
   A description that is already bare is returned untouched. */
export function toBareAudioSpecificConfig(
  description: AllowSharedBufferSource,
): Uint8Array<ArrayBuffer> {
  const source = ArrayBuffer.isView(description)
    ? new Uint8Array(
        description.buffer as ArrayBuffer,
        description.byteOffset,
        description.byteLength,
      )
    : new Uint8Array(description as ArrayBuffer);
  // Copy into a fresh ArrayBuffer-backed view so the result is a valid
  // BufferSource regardless of how the encoder allocated its description.
  const bytes = new Uint8Array(source.byteLength);

  bytes.set(source);

  // Only the ES_Descriptor form (tag 0x03) needs unwrapping; a bare ASC starts
  // with its 5-bit audioObjectType, and Opus descriptions start with "Opus".
  if (bytes.byteLength === 0 || bytes[0] !== 0x03) {
    return bytes;
  }

  const asc = findDecoderSpecificInfo(bytes, 0, bytes.byteLength);

  if (!asc) {
    return bytes;
  }

  const unwrapped = new Uint8Array(asc.byteLength);

  unwrapped.set(asc);

  return unwrapped;
}

/* Yield to the event loop WITHOUT setTimeout. Hidden pages throttle timers to
   ~1 tick per second, which turned every yield below into a full second — an
   export in an unfocused tab crawled at roughly one loop iteration per second
   and looked exactly like a hang (this is what "WebM export silently fails"
   actually was). MessageChannel posts are never throttled. */
const yieldToEventLoop = (() => {
  const channel = new MessageChannel();
  const resolvers: (() => void)[] = [];

  channel.port1.onmessage = () => resolvers.shift()?.();

  return () =>
    new Promise<void>((resolve) => {
      resolvers.push(resolve);
      channel.port2.postMessage(null);
    });
})();

const frameImageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImage(src: string): Promise<HTMLImageElement> {
  let cached = frameImageCache.get(src);

  if (!cached) {
    cached = new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load audiogram asset."));
      image.src = src;
    });
    frameImageCache.set(src, cached);
  }

  return cached;
}

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

type AudiogramFrameAssets = {
  blocks: readonly AudiogramSpeechBlock[];
  config: AudiogramMotionConfig;
  envelope: Float32Array | null;
  guest: string;
  scene: {
    flipHorizontal: boolean;
    flipVertical: boolean;
    focusX: number;
    focusY: number;
    image: HTMLImageElement;
    /** 0-1; below 1 the image fades into the base ground fill behind it. */
    opacity: number;
    rotationDeg: number;
    zoom: number;
  } | null;
  symbols: Record<string, HTMLImageElement>;
  tiles: Partial<Record<ColourwayKey, HTMLImageElement | null>>;
};

type AudiogramFrameParams = {
  assets: AudiogramFrameAssets;
  durationSeconds: number;
  episode: string;
  eyebrow: string;
  outroLines: readonly string[];
  timeSeconds: number;
};

const CAPTION_BOX = { bottom: 460, left: 86, top: 460 } as const;

function paintTexturedGround(
  context: PaintContext,
  way: ColourwayKey,
  alpha: number,
  params: AudiogramFrameParams,
): void {
  const { assets, durationSeconds, timeSeconds } = params;
  const c = COLOURWAYS[way];
  const { h, w } = POST_SIZES.story;
  const move = groundMotion(assets.config, timeSeconds, durationSeconds);

  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = c.bg;
  context.fillRect(0, 0, w, h);

  const tile = assets.tiles[way];

  if (!assets.config.solid && tile) {
    context.save();
    context.translate(w / 2, h / 2);
    context.scale(move.scale, move.scale);
    context.translate(move.tx, move.ty);
    context.translate(-w / 2, -h / 2);
    context.globalAlpha =
      alpha * c.tileOpacity * breatheOpacity(assets.config, assets.envelope, timeSeconds);

    const tileScale = Math.max(w / tile.width, h / tile.height);

    context.drawImage(tile, 0, 0, tile.width * tileScale, tile.height * tileScale);
    context.restore();
  }

  context.restore();
}

function paintImageGround(context: PaintContext, params: AudiogramFrameParams): void {
  const { assets, durationSeconds, timeSeconds } = params;

  if (!assets.scene) {
    return;
  }

  const { flipHorizontal, flipVertical, focusX, focusY, image, opacity, rotationDeg, zoom } =
    assets.scene;
  const { h, w } = POST_SIZES.story;
  const move = groundMotion(assets.config, timeSeconds, durationSeconds);
  const scale = Math.max(w / image.width, h / image.height) * zoom * move.scale;
  const drawW = image.width * scale;
  const drawH = image.height * scale;

  // Below 1 the image blends toward the base ground fill painted behind it,
  // matching the DOM preview's CSS opacity.
  context.save();
  context.globalAlpha = opacity;

  // The preview applies `scale(zoom * motion) rotate(R) scale(flipX, flipY)`
  // about the focus origin (templates.tsx). Uniform scale commutes with both
  // rotation and reflection, so applying rotate then flip about that origin
  // here reproduces the CSS matrix. Without this the export silently dropped
  // both transforms — a rotated upload previewed upright and exported sideways.
  if (rotationDeg !== 0 || flipHorizontal || flipVertical) {
    const originX = w * (focusX / 100);
    const originY = h * (focusY / 100);

    context.translate(originX, originY);
    context.rotate((rotationDeg * Math.PI) / 180);
    context.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    context.translate(-originX, -originY);
  }

  context.drawImage(
    image,
    (w - drawW) * (focusX / 100),
    (h - drawH) * (focusY / 100) + move.ty,
    drawW,
    drawH,
  );
  context.restore();
}

/* Lay out a block's words within maxWidth (word advance = measured width +
   0.28em gap, matching the DOM inline-block spacing), returning lines of words
   with x offsets for per-word painting. */
function layoutWords(
  context: PaintContext,
  words: readonly { text: string }[],
  size: number,
  maxWidth: number,
): { lines: { width: number; words: { index: number; x: number }[] }[] } {
  const gap = size * 0.28;
  const lines: { width: number; words: { index: number; x: number }[] }[] = [];
  let line: { width: number; words: { index: number; x: number }[] } = { width: 0, words: [] };

  words.forEach((word, index) => {
    const advance = context.measureText(word.text).width + gap;

    if (line.words.length > 0 && line.width + advance > maxWidth) {
      lines.push(line);
      line = { width: 0, words: [] };
    }

    line.words.push({ index, x: line.width });
    line.width += advance;
  });

  if (line.words.length > 0) {
    lines.push(line);
  }

  return { lines };
}

function paintAudiogramFrame(context: PaintContext, params: AudiogramFrameParams): void {
  const { assets, durationSeconds, episode, outroLines, timeSeconds } = params;
  const { blocks, config, guest } = assets;
  const { h, w } = POST_SIZES.story;
  const centerX = w / 2;
  const ground = groundState(blocks, guest, config, timeSeconds);
  const activeIndex = activeBlockIndex(blocks, timeSeconds);
  const active = activeIndex >= 0 ? blocks[activeIndex] : null;
  const highlights = highlightSet(blocks, config);
  const isHighlight = highlights.has(activeIndex);
  const contentEnd = blocks.length ? blocks[blocks.length - 1].end : 0;
  const outroStart = outroStartAt(durationSeconds, contentEnd);
  const outroProg = outroProgress(timeSeconds, outroStart);
  const finalCardProg = finalCardProgress(timeSeconds, durationSeconds);
  const chromeOp = (1 - outroProg) * (isHighlight ? 0.35 : 1);
  const ink = ground.ink;
  const accent = ground.accent;

  // Base fill so any sub-pixel transparency never shows through; tracks the
  // current speaker's settled ground behind the crossfading layers.
  context.fillStyle = COLOURWAYS[ground.curWay].bg;
  context.fillRect(0, 0, w, h);

  if (assets.scene) {
    paintImageGround(context, params);
  } else {
    if (ground.k < 1) {
      paintTexturedGround(context, ground.prevWay, 1, params);
    }

    paintTexturedGround(context, ground.curWay, ground.k, params);
  }

  context.textBaseline = "alphabetic";

  // Active caption — per-word entrance + accent
  if (active) {
    const size = Math.round((isHighlight ? 82 : 69) * Math.max(0.1, config.captionScale));
    const lineHeight = size * 1.06;
    const maxWidth = isHighlight ? 880 : w - CAPTION_BOX.left * 2;

    setFont(context, size, { italic: isHighlight });

    const layout = layoutWords(context, active.words, size, maxWidth);
    const blockHeight = layout.lines.length * lineHeight;
    const boxTop = CAPTION_BOX.top;
    const boxBottom = h - CAPTION_BOX.bottom;
    const speakerLabel = firstName(active.speaker);
    let startY: number;

    if (isHighlight) {
      startY = boxTop + (boxBottom - boxTop - blockHeight) / 2;
    } else {
      startY = boxTop;

      if (config.speakerSwap !== false && speakerLabel) {
        context.save();
        context.globalAlpha = chromeOp;
        context.fillStyle = accent;
        context.textAlign = "left";
        setFont(context, 32, { tracked: true });
        context.fillText(speakerLabel.toUpperCase(), CAPTION_BOX.left, boxTop + 32);
        context.restore();
        startY = boxTop + 32 * 1.2 + 28;
        setFont(context, size, { italic: isHighlight });
      }
    }

    context.textAlign = "left";
    context.textBaseline = "top";

    layout.lines.forEach((line, lineIndex) => {
      const lineY = startY + lineIndex * lineHeight;
      const lineStartX = isHighlight ? centerX - line.width / 2 : CAPTION_BOX.left;

      for (const entry of line.words) {
        const word = active.words[entry.index];
        const nextStart =
          entry.index < active.words.length - 1
            ? active.words[entry.index + 1].start
            : active.end;
        const visual = wordVisual(word, nextStart, timeSeconds, ink, accent, config.wordAccent);

        if (visual.opacity <= 0) {
          continue;
        }

        context.save();
        context.globalAlpha = visual.opacity;
        context.fillStyle = visual.color;
        context.fillText(word.text, lineStartX + entry.x, lineY);
        context.restore();
      }
    });

    context.textBaseline = "alphabetic";
  }

  // Eyebrow — episode name at the top (matches the DOM top: 370 placement)
  if (params.eyebrow) {
    context.save();
    context.globalAlpha = chromeOp;
    context.fillStyle = ink;
    context.textAlign = "center";
    setFont(context, 32, { tracked: true });
    context.fillText(params.eyebrow.toUpperCase(), centerX, 370 + 32);
    context.restore();
  }

  // Footer mark
  context.save();
  context.globalAlpha = chromeOp;
  context.fillStyle = ink;
  context.textAlign = "center";
  setFont(context, 32, { tracked: true });
  context.fillText("MOREMUSLIM.ORG", centerX, h - CAPTION_BOX.bottom + 90 + 32);
  context.restore();

  // Staggered fade outro
  if (outroProg > 0) {
    const outroWay = config.hostWay;
    const outroColour = COLOURWAYS[outroWay];

    context.save();
    context.globalAlpha = outroProg;

    if (!assets.scene) {
      paintTexturedGround(context, outroWay, 1, {
        ...params,
        assets: { ...assets, config: { ...config, hasImage: false } },
      });
    }

    context.textAlign = "center";
    context.fillStyle = outroColour.ink;
    context.textBaseline = "alphabetic";

    const titleFade = outroFadeAt(timeSeconds, outroStart, OUTRO_FADE_DELAYS.title);
    let y = h / 2 - 240;

    setFont(context, 56, { tracked: true });
    context.globalAlpha = outroProg * titleFade;
    context.fillText(episode.toUpperCase(), centerX, y);
    y += 56 * 1.16;
    context.fillText("NOW STREAMING", centerX, y);
    y += 200;

    setFont(context, 48);

    outroLines.forEach((line, index) => {
      context.globalAlpha =
        outroProg * outroFadeAt(timeSeconds, outroStart, OUTRO_FADE_DELAYS.line1 + index * 0.4);
      context.fillText(line, centerX, y);
      y += index === 0 ? 130 : 90;
    });

    y += 60;

    const symbol = assets.symbols[outroColour.logo];

    if (symbol) {
      context.globalAlpha =
        outroProg *
        outroFadeAt(timeSeconds, outroStart, OUTRO_FADE_DELAYS.line1 + outroLines.length * 0.4);
      context.drawImage(symbol, centerX - 95, y, 190, 190);
    }

    context.restore();
  }

  // Final logo card — the clip ends on the symbol centred on a clean ground,
  // crossfading over the now-streaming card.
  if (finalCardProg > 0) {
    const outroWay = config.hostWay;
    const outroColour = COLOURWAYS[outroWay];

    context.save();
    context.globalAlpha = finalCardProg;
    context.fillStyle = outroColour.bg;
    context.fillRect(0, 0, w, h);

    if (!assets.scene) {
      paintTexturedGround(context, outroWay, 1, {
        ...params,
        assets: { ...assets, config: { ...config, hasImage: false } },
      });
    }

    const symbol = assets.symbols[outroColour.logo];

    if (symbol) {
      context.drawImage(symbol, centerX - 160, h / 2 - 160, 320, 320);
    }

    context.restore();
  }
}

export async function exportAudiogramVideo(
  state: ToolcraftState,
  reportProgress?: (progress: number) => void,
): Promise<void> {
  if (state.values["post.template"] !== "audiogram") {
    throw new Error("Switch the template to Audiogram before exporting video.");
  }

  if (typeof VideoEncoder === "undefined") {
    throw new Error("MP4 export needs a Chromium browser with WebCodecs.");
  }

  const way = (typeof state.values["post.colourway"] === "string"
    ? state.values["post.colourway"]
    : "night") as ColourwayKey;
  const episode =
    typeof state.values["content.episode"] === "string"
      ? (state.values["content.episode"] as string)
      : "";
  // Eyebrow (episode name) label at the top; blank falls back to the marker.
  const eyebrowRaw =
    typeof state.values["audiogram.eyebrow"] === "string"
      ? (state.values["audiogram.eyebrow"] as string).trim()
      : "";
  const eyebrow = eyebrowRaw || episode;
  const captionAsset = state.mediaAssets.find(
    (asset) => asset.sourceTarget === "audiogram.captions",
  );
  const captions = captionAsset ? parseSrt(decodeCaptionAsset(captionAsset.dataUrl)) : [];
  const audioAsset = state.mediaAssets.find(
    (asset) => asset.sourceTarget === "audiogram.audio",
  );
  // Needed before decode: the container decides the audio codec, and the codec
  // decides which sample rates are legal (see the resample note below).
  const container = state.values["export.video.format"] === "webm" ? "webm" : "mp4";

  // Decode audio for the AAC/Opus track.
  let audioBuffer: AudioBuffer | null = null;

  if (audioAsset) {
    const bytes = await (await fetch(audioAsset.dataUrl)).arrayBuffer();
    // `close()` must run even when decode rejects. Chrome caps concurrent
    // AudioContexts (~6), so leaking one per failed export used to poison the
    // session: after a handful of undecodable files, every later export —
    // including ones that would decode fine — died on `new AudioContext()`.
    const audioContext = new AudioContext();

    try {
      audioBuffer = await audioContext.decodeAudioData(bytes);
    } finally {
      await audioContext.close();
    }

    // Resample to a rate the codec actually accepts. AAC takes 44.1k or 48k,
    // but Opus is a fixed-rate-family codec: only 8/12/16/24/48kHz are legal,
    // so a 44.1kHz podcast MP3 — the most common master rate there is — used
    // to reach `audioEncoder.configure()` unresampled on the WebM path and
    // kill the export AFTER the entire video pass had already run, silently.
    // (It also made the muxer declare 44100 on an Opus track, which players
    // that trust the container clock drift against.)
    const needsResample =
      container === "webm"
        ? audioBuffer.sampleRate !== 48_000
        : audioBuffer.sampleRate !== 44_100 && audioBuffer.sampleRate !== 48_000;

    if (needsResample) {
      const targetRate = 48_000;
      const offline = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        Math.max(1, Math.ceil(audioBuffer.duration * targetRate)),
        targetRate,
      );
      const source = offline.createBufferSource();

      source.buffer = audioBuffer;
      source.connect(offline.destination);
      source.start();
      audioBuffer = await offline.startRendering();
    }
  }

  // The timeline duration is what the preview scrubber shows and ends at, so
  // it is what exports. It used to be max(audio, timeline), which meant
  // trimming a 20-minute episode down to a 60s clip still exported the full
  // 20 minutes — none of which past 60s the user had ever previewed.
  // (Uploading audio syncs the timeline to its length, so the default is
  // still "export the whole clip".)
  const durationSeconds = Math.max(1, state.timeline.durationSeconds);
  const { height, width } = getToolcraftVideoExportSize({
    resolution: state.values["export.video.resolution"] as string | undefined,
    state: {
      ...state,
      canvas: {
        ...state.canvas,
        size: { height: POST_SIZES.story.h, unit: "px", width: POST_SIZES.story.w },
      },
    } as ToolcraftState,
  });
  const totalFrames = Math.max(1, Math.ceil(durationSeconds * FPS));
  // Video export always keeps the product background regardless of the PNG
  // Include toggle.
  const includeBackground = shouldIncludeToolcraftExportBackground({
    format: "video",
    schema: state.schema,
  });

  if (!includeBackground) {
    throw new Error("Video export must include the product background.");
  }

  const sceneSource =
    typeof state.values["scene.source"] === "string"
      ? (state.values["scene.source"] as string)
      : "pattern";
  let sceneImageSrc: string | null = null;

  // Only an upload carries a rotate/flip transform — built-in illustrations
  // ship correctly oriented, which is how the preview reads it too.
  let sceneTransform: ToolcraftMediaAsset["transform"] | undefined;

  if (sceneSource === "illustration") {
    sceneImageSrc = getEpisodeIllustration(state.values["scene.illustration"])?.src ?? null;
  } else if (sceneSource === "upload") {
    const uploaded = state.mediaAssets.find(
      (asset) => asset.sourceTarget === "scene.upload",
    );

    sceneImageSrc = uploaded?.dataUrl ?? null;
    sceneTransform = uploaded?.transform;
  }

  const focus = readFocusPercent(state.values["scene.imagePosition"]);
  const guestWay = (typeof state.values["audiogram.guestColourway"] === "string"
    ? state.values["audiogram.guestColourway"]
    : "oak") as ColourwayKey;
  const hostWay = (typeof state.values["audiogram.hostColourway"] === "string"
    ? state.values["audiogram.hostColourway"]
    : "beige") as ColourwayKey;
  const highlightMode =
    typeof state.values["audiogram.highlight"] === "string"
      ? (state.values["audiogram.highlight"] as string)
      : "auto";
  const config: AudiogramMotionConfig = {
    bgDrift: state.values["audiogram.breathing"] !== false,
    breathe: state.values["audiogram.breathing"] !== false,
    captionScale: readPercentFactor(state.values["audiogram.captionSize"], 1),
    guestWay: COLOURWAYS[guestWay] ? guestWay : "oak",
    hasImage: !!sceneImageSrc,
    highlight:
      highlightMode === "off"
        ? "off"
        : highlightMode === "choose"
          ? readHighlightLines(state.values["audiogram.highlightLine"])
          : "auto",
    hostWay: COLOURWAYS[hostWay] ? hostWay : "beige",
    motionScale: readPercentFactor(state.values["audiogram.motionIntensity"], 1),
    solid: sceneSource === "solid",
    speakerSwap: state.values["audiogram.crossfade"] !== false,
    wordAccent: state.values["audiogram.wordAccent"] !== false,
  };
  // Keyframed automation lanes evaluate per exported frame so the video
  // matches what the preview showed while scrubbing the same times.
  const configAt = (timeSeconds: number): AudiogramMotionConfig => ({
    ...config,
    captionScale: readPercentFactor(
      evaluateToolcraftTimelineValue(state, "audiogram.captionSize", timeSeconds),
      config.captionScale,
    ),
    motionScale: readPercentFactor(
      evaluateToolcraftTimelineValue(state, "audiogram.motionIntensity", timeSeconds),
      config.motionScale,
    ),
  });
  const sceneOpacityAt = (timeSeconds: number): number =>
    Math.min(
      1,
      readPercentFactor(
        evaluateToolcraftTimelineValue(state, "scene.imageOpacity", timeSeconds),
        1,
      ),
    );
  const outroLines = (typeof state.values["audiogram.outro"] === "string"
    ? (state.values["audiogram.outro"] as string)
    : "Listen to the full episode at moremuslim.org.\nOr search for “More Muslim” wherever you get your podcasts."
  )
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks = applyBlockTextOverrides(
    buildSpeechBlocks(captions),
    readBlockOverrides(state.values["audiogram.blockOverrides"]),
  );
  const guest = speakersOf(blocks).guest;

  // Load the star-lattice tile for both the host and guest colourways so the
  // speaker crossfade can render either ground.
  const tiles: Partial<Record<ColourwayKey, HTMLImageElement | null>> = {};

  for (const tileWay of new Set<ColourwayKey>([config.hostWay, config.guestWay])) {
    const tile = COLOURWAYS[tileWay].tile;

    tiles[tileWay] = tile && sceneSource !== "solid" ? await loadImage(tile) : null;
  }

  // Load every symbol logo the frame can show (host, guest, and outro grounds).
  const symbols: Record<string, HTMLImageElement> = {};

  for (const symbolWay of new Set<ColourwayKey>([config.hostWay, config.guestWay])) {
    const logo = COLOURWAYS[symbolWay].logo;

    symbols[logo] ??= await loadImage(SYMBOLS[logo]);
  }

  const assets: AudiogramFrameAssets = {
    blocks,
    config,
    envelope: audioBuffer ? computeAudioEnvelope(audioBuffer) : null,
    guest,
    scene: sceneImageSrc
      ? {
          flipHorizontal: sceneTransform?.flipHorizontal ?? false,
          flipVertical: sceneTransform?.flipVertical ?? false,
          focusX: focus.x,
          focusY: focus.y,
          image: await loadImage(sceneImageSrc),
          opacity: Math.min(
            1,
            readPercentFactor(state.values["scene.imageOpacity"], 1),
          ),
          rotationDeg: sceneTransform?.rotationDeg ?? 0,
          zoom:
            typeof state.values["scene.imageZoom"] === "number"
              ? (state.values["scene.imageZoom"] as number)
              : 1,
        }
      : null,
    symbols,
    tiles,
  };

  const slideCanvas = document.createElement("canvas");

  slideCanvas.width = POST_SIZES.story.w;
  slideCanvas.height = POST_SIZES.story.h;

  const frameCanvas = document.createElement("canvas");

  frameCanvas.width = width;
  frameCanvas.height = height;

  const slideContext = slideCanvas.getContext("2d");
  const frameContext = frameCanvas.getContext("2d");

  if (!slideContext || !frameContext) {
    throw new Error("Video export requires 2D canvas contexts.");
  }

  await document.fonts.load(`400 64px ${MARIST}`);
  await document.fonts.load(`italic 400 56px ${MARIST}`);

  const channels = audioBuffer ? Math.min(2, audioBuffer.numberOfChannels) : 0;
  const muxer =
    container === "webm"
      ? new WebmMuxer({
          audio: audioBuffer
            ? {
                codec: "A_OPUS",
                numberOfChannels: channels,
                sampleRate: audioBuffer.sampleRate,
              }
            : undefined,
          target: new WebmArrayBufferTarget(),
          video: { codec: "V_VP9", frameRate: FPS, height, width },
        })
      : new Mp4Muxer({
          fastStart: "in-memory",
          target: new Mp4ArrayBufferTarget(),
          video: { codec: "avc", frameRate: FPS, height, width },
          ...(audioBuffer
            ? {
                audio: {
                  codec: "aac",
                  numberOfChannels: channels,
                  sampleRate: audioBuffer.sampleRate,
                },
              }
            : {}),
        });
  const videoCodec = container === "webm" ? "vp09.00.10.08" : "avc1.640028";
  const videoSupport = await VideoEncoder.isConfigSupported({
    bitrate: 12_000_000,
    codec: videoCodec,
    framerate: FPS,
    height,
    width,
  });

  if (!videoSupport.supported) {
    throw new Error(
      `This browser cannot encode ${container.toUpperCase()} (${videoCodec}); try the other format.`,
    );
  }

  const audioCodec = container === "webm" ? "opus" : "mp4a.40.2";

  // Preflight the AUDIO codec too, and do it before the video pass — an
  // unsupported audio config used to surface only after minutes of video
  // encoding had already run (e.g. Chromium builds without an AAC encoder).
  if (audioBuffer) {
    const audioSupport = await AudioEncoder.isConfigSupported({
      bitrate: 160_000,
      codec: audioCodec,
      numberOfChannels: channels,
      sampleRate: audioBuffer.sampleRate,
    });

    if (!audioSupport.supported) {
      throw new Error(
        `This browser cannot encode ${container.toUpperCase()} audio (${audioCodec}); try the other format.`,
      );
    }
  }

  // WebCodecs invokes `error` callbacks on their own task, so throwing inside
  // one never rejects this function's promise — it used to vanish as an
  // uncaught error while the export sat frozen. Capture instead, and re-throw
  // from the encode loops below where a throw actually propagates.
  let encoderFailure: unknown = null;

  const encoder = new VideoEncoder({
    error: (error) => {
      encoderFailure = error;
    },
    output: (chunk, metadata) =>
      (muxer as { addVideoChunk: (c: EncodedVideoChunk, m?: EncodedVideoChunkMetadata) => void }).addVideoChunk(
        chunk,
        metadata,
      ),
  });
  let audioEncoder: AudioEncoder | null = null;

  try {
    encoder.configure({
      bitrate: 12_000_000,
      codec: videoCodec,
      framerate: FPS,
      height,
      width,
    });

    // Posterize time: the visual is painted at 12fps and each frame is held for
    // two 24fps output frames (the "vox"/stop-motion look). This halves the
    // per-frame paint work while keeping the 24fps container.
    const POSTERIZE = 2;
    let lastPaintedStep = -1;

    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex += 1) {
      const posterStep = Math.floor(frameIndex / POSTERIZE);

      if (posterStep !== lastPaintedStep) {
        const frameTimeSeconds = (posterStep * POSTERIZE) / FPS;

        paintAudiogramFrame(slideContext, {
          assets: {
            ...assets,
            config: configAt(frameTimeSeconds),
            scene: assets.scene
              ? { ...assets.scene, opacity: sceneOpacityAt(frameTimeSeconds) }
              : null,
          },
          durationSeconds,
          episode,
          eyebrow,
          outroLines,
          timeSeconds: frameTimeSeconds,
        });
        frameContext.drawImage(slideCanvas, 0, 0, width, height);
        lastPaintedStep = posterStep;
      }

      if (encoderFailure) {
        throw encoderFailure;
      }

      const frame = new VideoFrame(frameCanvas, {
        duration: Math.round(1e6 / FPS),
        timestamp: Math.round((frameIndex * 1e6) / FPS),
      });

      try {
        encoder.encode(frame, { keyFrame: frameIndex % (FPS * 2) === 0 });
      } finally {
        // Always close, even when encode throws on an errored encoder —
        // otherwise the frame's backing memory leaks until GC gets around to it.
        frame.close();
      }

      if (frameIndex % 12 === 0) {
        reportProgress?.(frameIndex / totalFrames);
        // Unconditional yield: with a fast hardware encoder the backpressure
        // loop below never awaits, and without this the whole export ran as one
        // synchronous block — progress sat at 0% and the tab froze.
        await yieldToEventLoop();
      }

      while (encoder.encodeQueueSize > 8) {
        await yieldToEventLoop();
      }
    }

    await encoder.flush();

    if (encoderFailure) {
      throw encoderFailure;
    }

    encoder.close();

    if (audioBuffer) {
      const sampleRate = audioBuffer.sampleRate;
      // Trim to the export duration: a 60s clip cut from a 20-minute episode
      // carries 60s of audio, matching the video track it sits beside.
      const length = Math.min(
        audioBuffer.length,
        Math.ceil(durationSeconds * sampleRate),
      );

      audioEncoder = new AudioEncoder({
        error: (error) => {
          encoderFailure = error;
        },
        output: (chunk, metadata) => {
          // MP4/AAC only: hand the muxer the bare AudioSpecificConfig, never the
          // wrapped ES_Descriptor Chrome may emit (see toBareAudioSpecificConfig
          // — passing the wrapped form through makes the export play silent).
          const description = metadata?.decoderConfig?.description;
          const normalized =
            container === "mp4" && metadata?.decoderConfig && description
              ? {
                  ...metadata,
                  decoderConfig: {
                    ...metadata.decoderConfig,
                    description: toBareAudioSpecificConfig(description),
                  },
                }
              : metadata;

          (muxer as { addAudioChunk: (c: EncodedAudioChunk, m?: EncodedAudioChunkMetadata) => void }).addAudioChunk(
            chunk,
            normalized,
          );
        },
      });

      audioEncoder.configure({
        bitrate: 160_000,
        codec: audioCodec,
        numberOfChannels: channels,
        sampleRate,
      });

      // Interleave one chunk at a time into a reused buffer (AudioData copies on
      // construction, so reuse is safe), and hold the encoder queue shallow. The
      // old shape — a full-episode interleaved Float32Array plus every AudioData
      // queued at once with no backpressure — peaked at ~2GB extra for a
      // 45-minute episode and OOM-crashed the tab.
      const CHUNK = 8192;
      const channelData: Float32Array[] = [];

      for (let channel = 0; channel < channels; channel += 1) {
        channelData.push(audioBuffer.getChannelData(channel));
      }

      const chunkBuffer = new Float32Array(CHUNK * channels);

      for (let offset = 0; offset < length; offset += CHUNK) {
        if (encoderFailure) {
          throw encoderFailure;
        }

        const frames = Math.min(CHUNK, length - offset);

        for (let channel = 0; channel < channels; channel += 1) {
          const data = channelData[channel];

          for (let index = 0; index < frames; index += 1) {
            chunkBuffer[index * channels + channel] = data[offset + index];
          }
        }

        const audioData = new AudioData({
          data: chunkBuffer.subarray(0, frames * channels),
          format: "f32",
          numberOfChannels: channels,
          numberOfFrames: frames,
          sampleRate,
          timestamp: Math.round((offset / sampleRate) * 1e6),
        });

        try {
          audioEncoder.encode(audioData);
        } finally {
          audioData.close();
        }

        while (audioEncoder.encodeQueueSize > 8) {
          await yieldToEventLoop();
        }
      }

      await audioEncoder.flush();

      if (encoderFailure) {
        throw encoderFailure;
      }

      audioEncoder.close();
    }

    muxer.finalize();
    reportProgress?.(1);

    const buffer = (muxer.target as { buffer: ArrayBuffer }).buffer;
    const blob = new Blob([buffer], {
      type: container === "webm" ? "video/webm" : "video/mp4",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.download = `more-muslim-audiogram.${container}`;
    anchor.href = downloadUrl;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 10_000);
  } finally {
    // A failed export must not leave codec handles open: encoder slots are a
    // finite browser resource, and an open encoder also pins every chunk the
    // muxer has buffered. This is what used to make three failed exports in a
    // session cost several hundred MB that never came back.
    if (encoder.state !== "closed") {
      encoder.close();
    }

    if (audioEncoder && audioEncoder.state !== "closed") {
      audioEncoder.close();
    }
  }
}
