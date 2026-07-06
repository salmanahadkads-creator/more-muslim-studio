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
  getToolcraftVideoExportSize,
  shouldIncludeToolcraftExportBackground,
  type ToolcraftState,
} from "@/toolcraft/runtime";

import { COLOURWAYS, POST_SIZES, SYMBOLS, TEXT_WIDTH, type ColourwayKey } from "./brand";
import { activeCaptionAt, parseSrt, type CaptionBlock } from "./srt";

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

function wrapLines(context: PaintContext, text: string, maxWidth: number): string[] {
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

type AudiogramFrameAssets = {
  symbol: HTMLImageElement;
  tile: HTMLImageElement | null;
};

function paintAudiogramFrame(
  context: PaintContext,
  {
    assets,
    captions,
    durationSeconds,
    episode,
    timeSeconds,
    way,
  }: {
    assets: AudiogramFrameAssets;
    captions: readonly CaptionBlock[];
    durationSeconds: number;
    episode: string;
    timeSeconds: number;
    way: ColourwayKey;
  },
): void {
  const c = COLOURWAYS[way];
  const { h, w } = POST_SIZES.story;
  const textWidth = TEXT_WIDTH.story;
  const centerX = w / 2;

  context.fillStyle = c.bg;
  context.fillRect(0, 0, w, h);

  if (assets.tile) {
    context.save();
    context.globalAlpha = c.tileOpacity;

    const tileScale = Math.max(w / assets.tile.width, h / assets.tile.height);

    context.drawImage(
      assets.tile,
      0,
      0,
      assets.tile.width * tileScale,
      assets.tile.height * tileScale,
    );
    context.restore();
  }

  context.fillStyle = c.ink;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Eyebrow
  setFont(context, 32, { tracked: true });
  context.fillText(episode.toUpperCase(), centerX, 370 + 16);

  // Active caption
  const caption = activeCaptionAt(captions, timeSeconds);

  if (caption) {
    let y = h / 2 - 120;

    if (caption.speaker) {
      setFont(context, 64, { tracked: true });
      context.fillText(caption.speaker.toUpperCase(), centerX, y);
      y += 64 * 1.2 + 48;
    }

    setFont(context, 56, { italic: true });

    for (const line of wrapLines(context, caption.text, textWidth)) {
      context.fillText(line, centerX, y);
      y += 56 * 1.2;
    }
  }

  // Progress rule + symbol footer
  const progress =
    durationSeconds > 0 ? Math.min(1, Math.max(0, timeSeconds / durationSeconds)) : 0;
  const ruleY = h - 370 - 200;
  const ruleLeft = centerX - textWidth / 2;

  context.fillStyle = c.sub;
  context.fillRect(ruleLeft, ruleY, textWidth, 3);
  context.fillStyle = c.ink;
  context.fillRect(ruleLeft, ruleY, textWidth * progress, 3);
  context.drawImage(assets.symbol, centerX - 80, ruleY + 40, 160, 160);
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
  const colourway = COLOURWAYS[way] ?? COLOURWAYS.night;
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

  // Decode audio for the AAC track; its duration drives the video duration.
  let audioBuffer: AudioBuffer | null = null;

  if (audioAsset) {
    const bytes = await (await fetch(audioAsset.dataUrl)).arrayBuffer();
    const audioContext = new AudioContext();

    audioBuffer = await audioContext.decodeAudioData(bytes);
    await audioContext.close();
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

  const assets: AudiogramFrameAssets = {
    symbol: await loadImage(SYMBOLS[colourway.logo]),
    tile: colourway.tile ? await loadImage(colourway.tile) : null,
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

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex += 1) {
    paintAudiogramFrame(slideContext, {
      assets,
      captions,
      durationSeconds,
      episode,
      timeSeconds: frameIndex / FPS,
      way,
    });
    frameContext.drawImage(slideCanvas, 0, 0, width, height);

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
