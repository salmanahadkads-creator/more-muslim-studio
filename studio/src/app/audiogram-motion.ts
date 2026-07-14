/* Audiogram motion system — the design-dynamics port.
   Every visual is a pure, time-deterministic function of the timeline time so
   the live DOM preview and the offline Canvas export read identical values at
   any t. Ported from ui_kits/social/audiogram-player.html. Covers the seven
   approved motions: speaker ground crossfade (1), audio-envelope breathing (3),
   living grain (4), active-word colour accent (5), pull-quote highlight (7),
   staggered fade outro (9), and perceptible ground pan / Ken Burns (10). */

import { COLOURWAYS, type ColourwayKey } from "./brand";
import type { CaptionBlock } from "./srt";

/* 12fps stop-motion "vox" cadence for the visual state; the video container
   runs at 24fps and holds each painted frame for two output frames. */
export const AUDIOGRAM_FPS = 12;
/* Captions lead the audio slightly to compensate word fade-in + quantisation. */
export const SYNC_LEAD = 0.12;
/* Ground colourway crossfade length at each speaker hand-off. */
export const GROUND_CROSSFADE = 0.5;
/* Default trailing outro length (branded "now streaming" card). */
export const OUTRO_DURATION = 5;
/* Active-word accent settle timing. */
const ACCENT_SETTLE = 0.3;

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/* Blend two #rrggbb colours; k=0 -> a, k=1 -> b. */
export function hexMix(a: string, b: string, k: number): string {
  if (k <= 0) {
    return a;
  }

  if (k >= 1) {
    return b;
  }

  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) + (((pb >> 16) & 255) - ((pa >> 16) & 255)) * k);
  const g = Math.round(((pa >> 8) & 255) + (((pb >> 8) & 255) - ((pa >> 8) & 255)) * k);
  const bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * k);

  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

export type AudiogramWord = { end: number; start: number; text: string };
export type AudiogramSpeechBlock = {
  end: number;
  speaker: string;
  start: number;
  words: readonly AudiogramWord[];
};

/* Distribute each caption block's words across its [start,end) proportional to
   word length (+1 for the trailing space), then split the stream into speech
   blocks at sentence ends or speaker changes — the same segmentation the legacy
   player used to drive word timing and the ground crossfade. */
export function buildSpeechBlocks(
  captions: readonly CaptionBlock[],
): AudiogramSpeechBlock[] {
  const words: (AudiogramWord & { speaker: string })[] = [];
  let speaker = "";

  for (const cue of captions) {
    if (cue.speaker) {
      speaker = cue.speaker;
    }

    const tokens = cue.text.split(/\s+/).filter(Boolean);
    const weights = tokens.map((token) => token.length + 1);
    const total = weights.reduce((sum, weight) => sum + weight, 0) || 1;
    let accumulated = 0;

    for (let index = 0; index < tokens.length; index += 1) {
      const start = cue.start + (accumulated / total) * (cue.end - cue.start);

      accumulated += weights[index];

      const end = cue.start + (accumulated / total) * (cue.end - cue.start);

      words.push({ end, speaker, start, text: tokens[index] });
    }
  }

  const blocks: (AudiogramSpeechBlock & { words: AudiogramWord[] })[] = [];
  let current: (AudiogramSpeechBlock & { words: AudiogramWord[] }) | null = null;

  for (const word of words) {
    if (!current || current.speaker !== word.speaker) {
      current = { end: word.end, speaker: word.speaker, start: word.start, words: [] };
      blocks.push(current);
    }

    current.words.push({ end: word.end, start: word.start, text: word.text });
    current.end = word.end;

    if (/[.!?]["')\]]*$/.test(word.text)) {
      current = null;
    }
  }

  return blocks;
}

/* The block's words joined back into one line — what the highlight picker
   shows the user so they can recognise the line by its actual wording. */
export function blockText(block: AudiogramSpeechBlock): string {
  return block.words.map((word) => word.text).join(" ");
}

/* One typo fix: `to` replaces the line whose original wording was `from`.
   Keeping the original text alongside the correction makes overrides
   self-invalidating — if a different SRT is uploaded and the line at this
   index no longer reads `from`, the stale fix is ignored instead of
   corrupting the wrong line. */
export type BlockTextOverride = { from: string; to: string };

/* Typo-fix overrides keyed by 0-based block index, applied on top of the
   parsed captions (feature: highlight picker text editing). An override only
   applies while the block's current text still matches its recorded `from`.
   Re-tokenises the corrected line and redistributes word timing
   proportionally across the block's ORIGINAL [start,end) span — the same
   weighting buildSpeechBlocks uses — so a corrected word still lands at
   roughly the moment it's spoken without needing to re-time the whole
   transcript. The uploaded SRT file itself is never rewritten; this is a
   render-time correction layer. */
export function applyBlockTextOverrides(
  blocks: readonly AudiogramSpeechBlock[],
  overrides: Readonly<Record<number, BlockTextOverride>>,
): AudiogramSpeechBlock[] {
  return blocks.map((block, blockIndex) => {
    const override = overrides[blockIndex];

    if (
      override === undefined ||
      override.from !== blockText(block) ||
      override.to === blockText(block)
    ) {
      return block;
    }

    const tokens = override.to.split(/\s+/).filter(Boolean);

    if (tokens.length === 0) {
      return block;
    }

    const weights = tokens.map((token) => token.length + 1);
    const total = weights.reduce((sum, weight) => sum + weight, 0) || 1;
    const words: AudiogramWord[] = [];
    let accumulated = 0;

    for (let index = 0; index < tokens.length; index += 1) {
      const start = block.start + (accumulated / total) * (block.end - block.start);

      accumulated += weights[index];

      const end = block.start + (accumulated / total) * (block.end - block.start);

      words.push({ end, start, text: tokens[index] });
    }

    return { ...block, end: words[words.length - 1].end, words };
  });
}

/* The first two distinct speakers become host and guest. */
export function speakersOf(blocks: readonly AudiogramSpeechBlock[]): {
  guest: string;
  host: string;
} {
  const seen: string[] = [];

  for (const block of blocks) {
    if (block.speaker && !seen.includes(block.speaker)) {
      seen.push(block.speaker);
    }
  }

  return { guest: seen[1] ?? "", host: seen[0] ?? "" };
}

/* Strip an honorific and return the speaker's first name (accent-coloured caps
   label above the caption). */
export function firstName(speaker: string): string {
  if (!speaker) {
    return "";
  }

  return (
    speaker
      .replace(/^(dr|mr|mrs|ms|prof|sheikh|sheikha|imam)\.?\s+/i, "")
      .trim()
      .split(/\s+/)[0] ?? ""
  ).replace(/[^\w'-].*$/, "");
}

export type AudiogramMotionConfig = {
  bgDrift: boolean;
  breathe: boolean;
  /** Caption text scale as a factor (1 = brand size). Keyframeable via the
   *  timeline: automate it to grow the pull-quote into a climax. */
  captionScale: number;
  guestWay: ColourwayKey;
  hasImage: boolean;
  /** "auto" scores the strongest line, "off" disables, a number forces that
   *  0-based caption block as the highlight. */
  highlight: "auto" | "off" | number;
  hostWay: ColourwayKey;
  /** Scales every ambient movement (breathing depth, ground pan, push-in,
   *  Ken Burns drift) as a factor (0 = still frame, 1 = brand default,
   *  2 = double). Keyframeable via the timeline for automation curves. */
  motionScale: number;
  solid: boolean;
  speakerSwap: boolean;
  wordAccent: boolean;
};

export function activeBlockIndex(
  blocks: readonly AudiogramSpeechBlock[],
  timeSeconds: number,
): number {
  const t = timeSeconds + SYNC_LEAD;
  let index = -1;

  for (let i = 0; i < blocks.length; i += 1) {
    if (blocks[i].start <= t) {
      index = i;
    } else {
      break;
    }
  }

  return index;
}

function wayForBlock(
  block: AudiogramSpeechBlock | undefined,
  guest: string,
  config: AudiogramMotionConfig,
): ColourwayKey {
  return block && guest && block.speaker === guest ? config.guestWay : config.hostWay;
}

function swapEnabled(
  guest: string,
  config: AudiogramMotionConfig,
): boolean {
  return (
    config.speakerSwap &&
    !config.hasImage &&
    !!guest &&
    config.guestWay !== config.hostWay
  );
}

export type GroundState = {
  accent: string;
  curWay: ColourwayKey;
  ink: string;
  k: number;
  prevWay: ColourwayKey;
};

/* Speaker ground crossfade (feature 1): the ground colourway follows whoever is
   speaking, crossfading GROUND_CROSSFADE seconds at each hand-off. Ink and
   accent interpolate across the blend so text stays legible mid-transition. */
export function groundState(
  blocks: readonly AudiogramSpeechBlock[],
  guest: string,
  config: AudiogramMotionConfig,
  timeSeconds: number,
): GroundState {
  const t = timeSeconds + SYNC_LEAD;
  let curWay = config.hostWay;
  let prevWay = config.hostWay;
  let k = 1;

  if (swapEnabled(guest, config)) {
    let index = -1;

    for (let i = 0; i < blocks.length; i += 1) {
      if (blocks[i].start <= t) {
        index = i;
      } else {
        break;
      }
    }

    if (index >= 0) {
      curWay = wayForBlock(blocks[index], guest, config);
      prevWay = index > 0 ? wayForBlock(blocks[index - 1], guest, config) : config.hostWay;
      k = prevWay === curWay ? 1 : clamp01((t - blocks[index].start) / GROUND_CROSSFADE);
    }
  }

  const cur = COLOURWAYS[curWay] ?? COLOURWAYS.night;
  const prev = COLOURWAYS[prevWay] ?? cur;

  return {
    accent: hexMix(prev.accent, cur.accent, k),
    curWay,
    ink: hexMix(prev.ink, cur.ink, k),
    k,
    prevWay,
  };
}

/* Which block earns the large italic set-piece treatment (feature 7). "off"
   disables it; "auto" scores blocks by length, punctuation, quotes, and
   position, preferring a punchy line in the back half of the clip. */
export function highlightIndex(
  blocks: readonly AudiogramSpeechBlock[],
  config: AudiogramMotionConfig,
): number {
  if (config.highlight === "off" || blocks.length === 0) {
    return -1;
  }

  if (typeof config.highlight === "number") {
    return config.highlight >= 0 && config.highlight < blocks.length
      ? config.highlight
      : -1;
  }

  const contentEnd = blocks[blocks.length - 1]?.end ?? 0;
  let best = -1;
  let bestScore = -Infinity;

  blocks.forEach((block, index) => {
    const count = block.words.length;
    let score = 0;

    if (count >= 4 && count <= 16) {
      score += 2;
    } else if (count <= 20) {
      score += 1;
    } else {
      score -= 1;
    }

    const last = block.words[count - 1]?.text ?? "";

    if (/[?!]["')\]]*$/.test(last)) {
      score += 1.5;
    }

    if (/["“”‘’]/.test(block.words.map((word) => word.text).join(" "))) {
      score += 0.5;
    }

    if (contentEnd && block.start > 0.4 * contentEnd) {
      score += 1;
    }

    if (score >= bestScore) {
      best = index;
      bestScore = score;
    }
  });

  return best;
}

/* Per-word entrance + active-word accent (feature 5). Each word appears the
   instant its start time is reached — a hard cut, not a fade or rise — then
   carries the accent colour, settling back to ink over ACCENT_SETTLE once the
   next word lands. */
export function wordVisual(
  word: AudiogramWord,
  nextStart: number,
  timeSeconds: number,
  ink: string,
  accent: string,
  wordAccent: boolean,
): { color: string; opacity: number } {
  const t = timeSeconds + SYNC_LEAD;
  const opacity = t >= word.start ? 1 : 0;
  const color = wordAccent ? hexMix(accent, ink, clamp01((t - nextStart) / ACCENT_SETTLE)) : ink;

  return { color, opacity };
}

/* Slow, clip-length-scaled ground motion (feature 10): a gentle push-in on
   everything, a ±24px left-right pan on textured grounds, and a downward Ken
   Burns drift on illustration grounds. Pure solids stay still. */
export function groundMotion(
  config: AudiogramMotionConfig,
  timeSeconds: number,
  durationSeconds: number,
): { scale: number; tx: number; ty: number } {
  const total = Math.max(1, durationSeconds);
  const p = clamp01(timeSeconds / total);
  const motion = config.bgDrift;
  const image = config.hasImage;
  // Motion intensity scales the moving deltas only — the resting push-in base
  // stays put so intensity 0 is a perfectly still (but still zoomed) frame.
  const amount = Math.max(0, config.motionScale);
  const scale = image
    ? motion
      ? 1.09 + 0.05 * p * amount
      : 1.09
    : motion
      ? 1.08 + 0.04 * p * amount
      : 1.08;
  const canPan = motion && (image || (!config.solid && !config.hasImage));
  const tx = canPan ? Math.sin(timeSeconds * 0.18) * 24 * amount : 0;
  const ty = image && motion ? -10 * p * amount : 0;

  return { scale, tx, ty };
}

/* Audio-envelope breathing (feature 3): a per-frame RMS envelope of the decoded
   audio, normalised with fast attack + slow decay, drives the pattern tile's
   opacity so the frame "breathes" with the voice. */
export function computeAudioEnvelope(buffer: AudioBuffer): Float32Array {
  const channel = buffer.getChannelData(0);
  const window = Math.max(1, Math.round(buffer.sampleRate / AUDIOGRAM_FPS));
  const count = Math.max(1, Math.ceil(channel.length / window));
  const out = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    let sum = 0;
    const start = i * window;
    const end = Math.min(channel.length, start + window);

    for (let j = start; j < end; j += 1) {
      sum += channel[j] * channel[j];
    }

    out[i] = Math.sqrt(sum / Math.max(1, end - start));
  }

  for (let i = 1; i < count; i += 1) {
    out[i] = Math.max(out[i], out[i - 1] * 0.82);
  }

  const sorted = Array.from(out).sort((a, b) => a - b);
  const reference = sorted[Math.floor((count - 1) * 0.95)] || 1;

  for (let i = 0; i < count; i += 1) {
    out[i] = clamp01(out[i] / (reference || 1));
  }

  return out;
}

export function envAt(envelope: Float32Array | null, timeSeconds: number): number {
  if (envelope && envelope.length) {
    return envelope[
      Math.min(envelope.length - 1, Math.max(0, Math.floor(timeSeconds * AUDIOGRAM_FPS)))
    ];
  }

  // No audio decoded yet: a slow neutral breathing keeps the frame alive.
  return 0.35 + 0.3 * (0.5 + 0.5 * Math.sin(timeSeconds * 1.4));
}

/* Pattern tile opacity for the current frame, breathing with the envelope. */
export function breatheOpacity(
  config: AudiogramMotionConfig,
  envelope: Float32Array | null,
  timeSeconds: number,
): number {
  if (!config.breathe || config.solid || config.hasImage) {
    return 1;
  }

  // Motion intensity scales the breathing depth around the settled opacity a
  // fully-voiced frame would have (1), so intensity 0 holds the tile steady.
  const depth = clamp01(Math.max(0, config.motionScale) * 0.45);

  return 1 - depth + depth * envAt(envelope, timeSeconds);
}

/* Staggered fade-only outro (feature 9). The branded "now streaming" card fades
   up in the final OUTRO_DURATION seconds; each line fades in on a small delay
   with no movement. */
export function outroStartAt(
  durationSeconds: number,
  contentEndSeconds: number,
): number {
  if (!durationSeconds) {
    return Infinity;
  }

  return Math.max(contentEndSeconds + 0.3, durationSeconds - OUTRO_DURATION);
}

export function outroProgress(timeSeconds: number, outroStart: number): number {
  return Number.isFinite(outroStart) ? clamp01((timeSeconds - outroStart) / 0.6) : 0;
}

export function outroFadeAt(
  timeSeconds: number,
  outroStart: number,
  delay: number,
): number {
  return Number.isFinite(outroStart)
    ? clamp01((timeSeconds - (outroStart + delay)) / 0.5)
    : 0;
}

/* Staggered fade delays for the outro's four elements (episode/now-streaming,
   two body lines, symbol). */
export const OUTRO_FADE_DELAYS = { line1: 0.55, line2: 0.95, symbol: 1.35, title: 0.15 } as const;

