/* SRT caption parsing for the audiogram.
   Caption lines may start with "Speaker: text"; the speaker is split out so
   the slide can render the name in tracked caps above the line. */

/** How long a caption stays on screen past its own end time. */
const CAPTION_HOLD_SECONDS = 0.75;

export type CaptionBlock = {
  end: number;
  speaker: string;
  start: number;
  text: string;
};

function parseTimestamp(value: string): number {
  const match = value.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);

  if (!match) {
    return 0;
  }

  return (
    Number(match[1]) * 3600 +
    Number(match[2]) * 60 +
    Number(match[3]) +
    Number(match[4].padEnd(3, "0").slice(0, 3)) / 1000
  );
}

export function parseSrt(source: string): CaptionBlock[] {
  const blocks: CaptionBlock[] = [];

  for (const rawBlock of source.split(/\r?\n\s*\r?\n/)) {
    const lines = rawBlock
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const timeLineIndex = lines.findIndex((line) => line.includes("-->"));

    if (timeLineIndex === -1) {
      continue;
    }

    const [startRaw, endRaw] = lines[timeLineIndex].split("-->");
    const text = lines.slice(timeLineIndex + 1).join(" ");

    if (!text) {
      continue;
    }

    const speakerMatch = text.match(/^([^:]{1,40}):\s*(.+)$/);

    blocks.push({
      end: parseTimestamp(endRaw ?? ""),
      speaker: speakerMatch ? speakerMatch[1].trim() : "",
      start: parseTimestamp(startRaw ?? ""),
      text: speakerMatch ? speakerMatch[2].trim() : text,
    });
  }

  return blocks.sort((a, b) => a.start - b.start);
}

export function activeCaptionAt(
  blocks: readonly CaptionBlock[],
  timeSeconds: number,
): CaptionBlock | null {
  let active: CaptionBlock | null = null;

  for (const block of blocks) {
    if (block.start <= timeSeconds) {
      active = block;
    } else {
      break;
    }
  }

  // Both branches used to return `active`, so the hold window below was inert
  // and a caption could never expire — it simply stayed on screen until the
  // next cue started. The function has no callers today, so this only matters
  // for the next one, which is exactly when a silently-wrong helper bites.
  return active && timeSeconds <= active.end + CAPTION_HOLD_SECONDS ? active : null;
}
