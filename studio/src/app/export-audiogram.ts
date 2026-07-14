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
  firstName,
  groundMotion,
  groundState,
  highlightIndex,
  outroFadeAt,
  OUTRO_FADE_DELAYS,
  outroProgress,
  outroStartAt,
  speakersOf,
  wordVisual,
  type AudiogramMotionConfig,
  type AudiogramSpeechBlock,
} from "./audiogram-motion";
import { readBlockOverrides, readFocusPercent, readPercentFactor } from "./post-renderer";
import { parseSrt } from "./srt";

const FPS = 24;
const MARIST = '"ABC Marist", Georgia, serif';
const CAPS_TRACKING_EM = 0.165;

type PaintContext = CanvasRenderingContext2D & { letterSpacing?: string };

function decodeTextAsset(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(",");

  if (commaIndex === -1) {
    return "";
  }

  const payload = dataUrl.slice(commaIndex + 1);

  try {
    if (/;base64/i.test(dataUrl.slice(0, commaIndex))) {
      const bytes = atob(payload);

      return decodeURIComponent(
        Array.from(bytes, (char) =>
          `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`,
        ).join(""),
      );
    }

    return decodeURIComponent(payload);
  } catch {
    return "";
  }
}

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
    focusX: number;
    focusY: number;
    image: HTMLImageElement;
    zoom: number;
  } | null;
  symbols: Record<string, HTMLImageElement>;
  tiles: Partial<Record<ColourwayKey, HTMLImageElement | null>>;
};

type AudiogramFrameParams = {
  assets: AudiogramFrameAssets;
  durationSeconds: number;
  episode: string;
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

  const { focusX, focusY, image, zoom } = assets.scene;
  const { h, w } = POST_SIZES.story;
  const move = groundMotion(assets.config, timeSeconds, durationSeconds);
  const scale = Math.max(w / image.width, h / image.height) * zoom * move.scale;
  const drawW = image.width * scale;
  const drawH = image.height * scale;

  context.drawImage(
    image,
    (w - drawW) * (focusX / 100),
    (h - drawH) * (focusY / 100) + move.ty,
    drawW,
    drawH,
  );
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
  const highlight = highlightIndex(blocks, config);
  const isHighlight = highlight >= 0 && activeIndex === highlight;
  const contentEnd = blocks.length ? blocks[blocks.length - 1].end : 0;
  const outroStart = outroStartAt(durationSeconds, contentEnd);
  const outroProg = outroProgress(timeSeconds, outroStart);
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
  const captionAsset = state.mediaAssets.find(
    (asset) => asset.sourceTarget === "audiogram.captions",
  );
  const captions = captionAsset ? parseSrt(decodeTextAsset(captionAsset.dataUrl)) : [];
  const audioAsset = state.mediaAssets.find(
    (asset) => asset.sourceTarget === "audiogram.audio",
  );

  // Decode audio for the AAC/Opus track; its duration drives the video duration.
  let audioBuffer: AudioBuffer | null = null;

  if (audioAsset) {
    const bytes = await (await fetch(audioAsset.dataUrl)).arrayBuffer();
    const audioContext = new AudioContext();

    audioBuffer = await audioContext.decodeAudioData(bytes);
    await audioContext.close();

    // WebCodecs audio encoders only accept 44.1kHz or 48kHz; resample anything
    // else (e.g. an 8kHz voice memo) up to 48kHz through an OfflineAudioContext
    // so the export never rejects an odd input rate.
    if (audioBuffer.sampleRate !== 44_100 && audioBuffer.sampleRate !== 48_000) {
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

  const durationSeconds = Math.max(
    audioBuffer?.duration ?? 0,
    state.timeline.durationSeconds,
    1,
  );
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

  if (sceneSource === "illustration") {
    sceneImageSrc = getEpisodeIllustration(state.values["scene.illustration"])?.src ?? null;
  } else if (sceneSource === "upload") {
    sceneImageSrc =
      state.mediaAssets.find((asset) => asset.sourceTarget === "scene.upload")?.dataUrl ??
      null;
  }

  const focus = readFocusPercent(state.values["scene.imagePosition"]);
  const guestWay = (typeof state.values["audiogram.guestColourway"] === "string"
    ? state.values["audiogram.guestColourway"]
    : way) as ColourwayKey;
  const highlightMode =
    typeof state.values["audiogram.highlight"] === "string"
      ? (state.values["audiogram.highlight"] as string)
      : "auto";
  const highlightLine =
    typeof state.values["audiogram.highlightLine"] === "number"
      ? (state.values["audiogram.highlightLine"] as number)
      : 1;
  const config: AudiogramMotionConfig = {
    bgDrift: state.values["audiogram.breathing"] !== false,
    breathe: state.values["audiogram.breathing"] !== false,
    captionScale: readPercentFactor(state.values["audiogram.captionSize"], 1),
    guestWay: COLOURWAYS[guestWay] ? guestWay : way,
    hasImage: !!sceneImageSrc,
    highlight:
      highlightMode === "off"
        ? "off"
        : highlightMode === "choose"
          ? Math.max(0, Math.round(highlightLine) - 1)
          : "auto",
    hostWay: way,
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
          focusX: focus.x,
          focusY: focus.y,
          image: await loadImage(sceneImageSrc),
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

  const container = state.values["export.video.format"] === "webm" ? "webm" : "mp4";
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

  const encoder = new VideoEncoder({
    error: (error) => {
      throw error;
    },
    output: (chunk, metadata) =>
      (muxer as { addVideoChunk: (c: EncodedVideoChunk, m?: EncodedVideoChunkMetadata) => void }).addVideoChunk(
        chunk,
        metadata,
      ),
  });

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
        assets: { ...assets, config: configAt(frameTimeSeconds) },
        durationSeconds,
        episode,
        outroLines,
        timeSeconds: frameTimeSeconds,
      });
      frameContext.drawImage(slideCanvas, 0, 0, width, height);
      lastPaintedStep = posterStep;
    }

    const frame = new VideoFrame(frameCanvas, {
      duration: Math.round(1e6 / FPS),
      timestamp: Math.round((frameIndex * 1e6) / FPS),
    });

    encoder.encode(frame, { keyFrame: frameIndex % (FPS * 2) === 0 });
    frame.close();

    if (frameIndex % 12 === 0) {
      reportProgress?.(frameIndex / totalFrames);
    }

    while (encoder.encodeQueueSize > 8) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  await encoder.flush();
  encoder.close();

  if (audioBuffer) {
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    const audioEncoder = new AudioEncoder({
      error: (error) => {
        throw error;
      },
      output: (chunk, metadata) =>
        (muxer as { addAudioChunk: (c: EncodedAudioChunk, m?: EncodedAudioChunkMetadata) => void }).addAudioChunk(
          chunk,
          metadata,
        ),
    });

    audioEncoder.configure({
      bitrate: 160_000,
      codec: container === "webm" ? "opus" : "mp4a.40.2",
      numberOfChannels: channels,
      sampleRate,
    });

    const interleaved = new Float32Array(length * channels);

    for (let channel = 0; channel < channels; channel += 1) {
      const data = audioBuffer.getChannelData(channel);

      for (let index = 0; index < length; index += 1) {
        interleaved[index * channels + channel] = data[index];
      }
    }

    const CHUNK = 8192;

    for (let offset = 0; offset < length; offset += CHUNK) {
      const frames = Math.min(CHUNK, length - offset);
      const audioData = new AudioData({
        data: interleaved.subarray(offset * channels, (offset + frames) * channels),
        format: "f32",
        numberOfChannels: channels,
        numberOfFrames: frames,
        sampleRate,
        timestamp: Math.round((offset / sampleRate) * 1e6),
      });

      audioEncoder.encode(audioData);
      audioData.close();
    }

    await audioEncoder.flush();
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
}
