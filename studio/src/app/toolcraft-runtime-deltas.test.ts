/* Regeneration guard for sanctioned edits inside src/toolcraft/.
   ------------------------------------------------------------------
   The Toolcraft runtime shell (src/toolcraft/) is normally "do not edit"
   (see AGENTS.md / assembly-workflow.md) and is meant to be regenerated from
   the base template. This app carries a small number of DELIBERATE runtime
   deltas that the schema cannot express. If the runtime is ever regenerated,
   those deltas revert silently — and the integrity check will NOT catch it,
   because a regeneration re-hashes the manifest to match the reverted code.

   This test is the guard: it fails loudly the moment a delta is lost, and its
   messages tell the next agent exactly what to re-apply. It lives in
   src/app/ (app-owned, survives a src/toolcraft/ regeneration) and runs in
   `pnpm test` via `vitest run src`.

   THE SANCTIONED src/toolcraft DELTAS (keep this list and AGENTS.md in sync):
   1. No timeline duration ceiling. The upper `maxTimelineDurationSeconds`
      clamp was removed from all three duration-normalising sites so a clip is
      as long as its audio (a 3-hour cut must not truncate). Only the 1s floor
      and the isFinite guard remain. The schema exposes no max-duration option,
      so this can only live in the runtime. */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { toolcraftReducer } from "@/toolcraft/runtime";

import { appSchema } from "./app-schema";

const appDir = dirname(fileURLToPath(import.meta.url));
const toolcraftDir = join(appDir, "../toolcraft");

const durationClampSites = [
  "runtime/state/reducer.ts",
  "runtime/schema/define-toolcraft.ts",
  "runtime/react/timeline-panel.tsx",
];

describe("src/toolcraft runtime deltas (regeneration guard)", () => {
  it("keeps the timeline duration ceiling removed in every runtime clamp site", () => {
    // Strip line comments first so the marker comments (which name the
    // constant to explain its absence) don't trip the check — only real code
    // reintroducing the ceiling should fail this.
    const stripLineComments = (source: string) =>
      source.replace(/(^|[^:])\/\/.*$/gm, "$1");

    for (const relative of durationClampSites) {
      const code = stripLineComments(readFileSync(join(toolcraftDir, relative), "utf8"));

      expect(
        code,
        `${relative} reintroduced a timeline duration ceiling. A Toolcraft ` +
          `regeneration reverted a sanctioned delta. Re-remove the ` +
          `maxTimelineDurationSeconds constant and its Math.min(...) upper ` +
          `clamp so a clip is as long as its audio. See AGENTS.md ` +
          `"Sanctioned runtime deltas" and the worklog (Iterations 12/14).`,
      ).not.toMatch(/maxTimelineDurationSeconds/);
    }
  });

  it("still enforces the 1s floor and the finite guard the runtime kept", () => {
    const setDuration = (durationSeconds: number) =>
      toolcraftReducer(
        {
          canvas: { size: { height: 1920, width: 1080 } },
          defaults: {},
          history: { redo: [], undo: [] },
          layers: [],
          mediaAssets: [],
          panels: { timeline: {} },
          schema: appSchema,
          selectedLayerId: null,
          timeline: {
            currentTimeSeconds: 0,
            durationSeconds: 60,
            expanded: false,
            isLooping: true,
            isPlaying: false,
            keyframeGroups: [],
            selectedKeyframeId: null,
          },
          values: {},
        } as unknown as Parameters<typeof toolcraftReducer>[0],
        { durationSeconds, type: "timeline.setDuration" },
      ).timeline.durationSeconds;

    // A very long cut survives unclamped (proves the ceiling is truly gone),
    // while the floor and finite guard still hold.
    expect(setDuration(10_800)).toBe(10_800);
    expect(setDuration(500_000)).toBe(500_000);
    expect(setDuration(0.2)).toBe(1);
    expect(setDuration(Number.POSITIVE_INFINITY)).toBe(1);
    expect(setDuration(Number.NaN)).toBe(1);
  });
});
