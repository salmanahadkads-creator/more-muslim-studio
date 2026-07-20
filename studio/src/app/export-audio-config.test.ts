/* Regression coverage for the silent-MP4 bug.

   mp4-muxer builds the MPEG-4 descriptor tree itself and splices
   `decoderConfig.description` in where the bare AudioSpecificConfig belongs.
   Chrome's AAC encoder can hand back a FULL ES_Descriptor instead, which used
   to be passed straight through — nesting a descriptor inside a descriptor.
   Players then read audioObjectType 0 (invalid), the AAC decoder never
   initialises, and the export plays silent even though the audio track, its
   3,106 samples and its 66.26s duration are all present.

   The fixture below is the ACTUAL malformed AudioSpecificConfig recovered from
   a real broken export (more-muslim-audiogram.mp4). */
import { describe, expect, it } from "vitest";

import { toBareAudioSpecificConfig } from "./export-audiogram";

const hex = (value: string) =>
  new Uint8Array((value.match(/../g) ?? []).map((byte) => Number.parseInt(byte, 16)));

describe("AAC decoder config normalisation", () => {
  it("unwraps the nested ES_Descriptor Chrome emits down to the bare config", () => {
    // Exactly what the broken export carried in its DecoderSpecificInfo slot.
    const wrapped = hex(
      "038080802200000004808080144014001800000000000000000005808080021190068080800102",
    );

    const bare = toBareAudioSpecificConfig(wrapped);

    // 0x1190 => AAC-LC (AOT 2), 48 kHz (freqIndex 3), stereo (channelConfig 2).
    expect([...bare]).toEqual([0x11, 0x90]);

    const audioObjectType = (bare[0] >> 3) & 0x1f;
    const frequencyIndex = ((bare[0] & 0x07) << 1) | ((bare[1] >> 7) & 0x01);
    const channelConfig = (bare[1] >> 3) & 0x0f;

    expect(audioObjectType).toBe(2);
    expect(frequencyIndex).toBe(3);
    expect(channelConfig).toBe(2);
  });

  it("leaves an already-bare AudioSpecificConfig untouched", () => {
    expect([...toBareAudioSpecificConfig(hex("1190"))]).toEqual([0x11, 0x90]);
    // 44.1 kHz mono AAC-LC.
    expect([...toBareAudioSpecificConfig(hex("1208"))]).toEqual([0x12, 0x08]);
  });

  it("does not mangle a non-AAC (Opus) description", () => {
    // OpusHead magic — must pass through untouched.
    const opusHead = hex("4f70757348656164");

    expect([...toBareAudioSpecificConfig(opusHead)]).toEqual([...opusHead]);
  });

  it("returns a plain ArrayBuffer-backed copy the muxer can consume", () => {
    const result = toBareAudioSpecificConfig(hex("1190"));

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.buffer).toBeInstanceOf(ArrayBuffer);
  });

  it("falls back to the input when no DecoderSpecificInfo is present", () => {
    // An ES_Descriptor with no tag-5 payload inside.
    const noAsc = hex("030780808002000100");

    expect(toBareAudioSpecificConfig(noAsc).byteLength).toBeGreaterThan(0);
  });
});
