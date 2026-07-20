/* Regression coverage for silent caption loss.

   `decodeCaptionAsset` used to decode base64 payloads via the
   decodeURIComponent(percent-escape) idiom. That throws URIError on any byte
   sequence that is not valid UTF-8 — and the function's own catch turned the
   throw into "". So a Windows-1252 / Latin-1 .srt (a very common subtitle-tool
   output) produced an audiogram with NO captions at all, and no error anywhere
   the client could see it. TextDecoder substitutes U+FFFD instead of throwing,
   so one bad byte costs one glyph rather than the entire transcript. */
import { describe, expect, it } from "vitest";

import { decodeCaptionAsset } from "./post-renderer";
import { parseSrt } from "./srt";

const base64DataUrl = (bytes: readonly number[]) =>
  `data:text/plain;base64,${btoa(String.fromCharCode(...bytes))}`;

const utf8DataUrl = (text: string) =>
  base64DataUrl([...new TextEncoder().encode(text)]);

describe("decodeCaptionAsset", () => {
  it("decodes a plain UTF-8 base64 caption file", () => {
    expect(decodeCaptionAsset(utf8DataUrl("Hello world"))).toBe("Hello world");
  });

  it("keeps non-ASCII UTF-8 intact (Arabic, curly quotes, em dash)", () => {
    const text = "Yassmin — “a more Muslim” السلام";

    expect(decodeCaptionAsset(utf8DataUrl(text))).toBe(text);
  });

  it("still returns the transcript when the file is Latin-1, not UTF-8", () => {
    // 0xE9 is a lone "é" in Windows-1252 — invalid as standalone UTF-8, which
    // is exactly what used to throw and wipe every caption.
    const latin1 = [0x43, 0x61, 0x66, 0xe9, 0x20, 0x74, 0x61, 0x6c, 0x6b]; // "Café talk"
    const decoded = decodeCaptionAsset(base64DataUrl(latin1));

    expect(decoded).not.toBe("");
    expect(decoded).toContain("Caf");
    expect(decoded).toContain("talk");
  });

  it("parses a full Latin-1 SRT into real cues rather than dropping them", () => {
    const srt =
      "1\n00:00:01,000 --> 00:00:03,000\nCafé conversations\n\n" +
      "2\n00:00:03,500 --> 00:00:06,000\nSide Entrances\n";
    // Encode as Latin-1 (one byte per code unit), not UTF-8.
    const bytes = [...srt].map((char) => char.charCodeAt(0));
    const blocks = parseSrt(decodeCaptionAsset(base64DataUrl(bytes)));

    expect(blocks).toHaveLength(2);
    expect(blocks[0]?.start).toBe(1);
    expect(blocks[1]?.text).toBe("Side Entrances");
  });

  it("returns empty string for a malformed data URL rather than throwing", () => {
    expect(decodeCaptionAsset("not-a-data-url")).toBe("");
    expect(decodeCaptionAsset("data:text/plain;base64,!!!not-base64!!!")).toBe("");
  });
});
