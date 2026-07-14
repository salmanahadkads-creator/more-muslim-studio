/* Automated product coverage for the More Muslim Social Studio schema.
   Each test name is referenced from appAcceptance rows. */

import { describe, expect, it } from "vitest";

import type {
  ResolvedToolcraftAppSchema,
  ToolcraftControlSchema,
} from "@/toolcraft/runtime";

import { COLOURWAY_KEYS, COLOURWAYS, EPISODE_ILLUSTRATIONS } from "./brand";
import { appSchema } from "./app-schema";
import { appAcceptance } from "./app-acceptance";
import { evaluateToolcraftTimelineValue } from "@/toolcraft/runtime";

import {
  applyBlockTextOverrides,
  blockText,
  buildSpeechBlocks,
  groundMotion,
  type AudiogramMotionConfig,
} from "./audiogram-motion";
import { buildEpisodeSetSnapshots, SLIDE_VALUE_TARGETS } from "./carousel";
import { readCredits, readCreditsDraft } from "./credits";
import { parseSrt } from "./srt";

function findControl(
  schema: ResolvedToolcraftAppSchema,
  target: string,
): ToolcraftControlSchema | null {
  for (const section of schema.panels.controls?.sections ?? []) {
    for (const control of Object.values(section.controls)) {
      if (control.target === target) {
        return control;
      }
    }
  }

  return null;
}

function optionValues(control: ToolcraftControlSchema | null): string[] {
  return (control?.options ?? []).map((option) =>
    typeof option === "string" ? option : String(option.value),
  );
}

describe("More Muslim Social Studio schema", () => {
  it("schema: post.template covers all five brand layouts", () => {
    const control = findControl(appSchema, "post.template");

    expect(control?.type).toBe("select");
    expect(control?.defaultValue).toBe("cover");
    expect(optionValues(control)).toEqual([
      "cover",
      "quote",
      "synopsis",
      "streaming",
      "credits",
      "audiogram",
    ]);
  });

  it("schema: post.colourway covers all nine approved pairings", () => {
    const control = findControl(appSchema, "post.colourway");

    expect(control?.type).toBe("imagePicker");
    expect(control?.defaultValue).toBe("night");
    expect(control?.items?.map((item) => item.value)).toEqual([...COLOURWAY_KEYS]);

    for (const key of COLOURWAY_KEYS) {
      expect(COLOURWAYS[key].bg).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(COLOURWAYS[key].ink).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("schema: scene.source gates illustration and upload controls", () => {
    const source = findControl(appSchema, "scene.source");
    const illustration = findControl(appSchema, "scene.illustration");
    const upload = findControl(appSchema, "scene.upload");

    expect(optionValues(source)).toEqual([
      "pattern",
      "solid",
      "illustration",
      "upload",
    ]);
    expect(source?.defaultValue).toBe("pattern");
    expect(illustration?.visibleWhen).toEqual({
      equals: "illustration",
      target: "scene.source",
    });
    expect(upload?.visibleWhen).toEqual({ equals: "upload", target: "scene.source" });

    // Crop + zoom are no longer panel controls — they live on the canvas.
    expect(findControl(appSchema, "scene.imagePosition")).toBeNull();
    expect(findControl(appSchema, "scene.imageZoom")).toBeNull();
  });

  it("runtime: dragging the image repositions its crop", () => {
    const row = appAcceptance.find((entry) => entry.id === "runtime.sceneImage.crop");

    expect(row?.kind).toBe("runtime");
    expect(row?.expectedObservable).toMatch(/drag.*image|crop/i);
  });

  it("runtime: the under-image zoom slider scales the image", () => {
    const row = appAcceptance.find((entry) => entry.id === "runtime.sceneImage.zoom");

    expect(row?.kind).toBe("runtime");
    expect(row?.expectedObservable).toMatch(/zoom|scale/i);
  });

  it("runtime: double-click edits preview text", () => {
    const row = appAcceptance.find((entry) => entry.id === "runtime.inlineText.edit");

    expect(row?.kind).toBe("runtime");
    expect(row?.expectedObservable).toMatch(/double-click|edit/i);
  });

  it("schema: scene.illustration lists all ten episode artworks", () => {
    const control = findControl(appSchema, "scene.illustration");
    const items = (control?.items ?? []).map((item) => item.value);

    expect(control?.type).toBe("imagePicker");
    expect(items).toEqual(EPISODE_ILLUSTRATIONS.map((entry) => entry.value));
    expect(EPISODE_ILLUSTRATIONS).toHaveLength(10);

    for (const entry of EPISODE_ILLUSTRATIONS) {
      expect(entry.src).toBeTruthy();
    }
  });

  it("schema: scene.upload is a single-image fileDrop", () => {
    const control = findControl(appSchema, "scene.upload");

    expect(control?.type).toBe("fileDrop");
    expect(control?.assetKind).toBe("image");
    expect(control?.multiple).toBe(false);
  });

  it("schema: content.episode is a visible text control with a default", () => {
    const control = findControl(appSchema, "content.episode");

    expect(control?.type).toBe("text");
    expect(typeof control?.defaultValue).toBe("string");
    expect(String(control?.defaultValue)).not.toBe("");
  });
  it("schema: content.cover.presents is a visible text control with a default", () => {
    const control = findControl(appSchema, "content.cover.presents");

    expect(control?.type).toBe("text");
    expect(typeof control?.defaultValue).toBe("string");
    expect(String(control?.defaultValue)).not.toBe("");
  });
  it("schema: content.cover.title is a visible text control with a default", () => {
    const control = findControl(appSchema, "content.cover.title");

    expect(control?.type).toBe("text");
    expect(typeof control?.defaultValue).toBe("string");
    expect(String(control?.defaultValue)).not.toBe("");
  });
  it("schema: content.quote.dialogue is a visible code control with a default", () => {
    const control = findControl(appSchema, "content.quote.dialogue");

    expect(control?.type).toBe("code");
    expect(typeof control?.defaultValue).toBe("string");
    expect(String(control?.defaultValue)).not.toBe("");
  });
  it("schema: content.synopsis.body is a visible code control with a default", () => {
    const control = findControl(appSchema, "content.synopsis.body");

    expect(control?.type).toBe("code");
    expect(typeof control?.defaultValue).toBe("string");
    expect(String(control?.defaultValue)).not.toBe("");
  });
  it("schema: content.streaming.lines is a visible code control with a default", () => {
    const control = findControl(appSchema, "content.streaming.lines");

    expect(control?.type).toBe("code");
    expect(typeof control?.defaultValue).toBe("string");
    expect(String(control?.defaultValue)).not.toBe("");
  });
  it("audiogram: a typo override applies only while the line still reads its recorded original", () => {
    const srt =
      "1\n00:00:00,000 --> 00:00:01,000\nYassmin: The frist line.\n\n2\n00:00:01,200 --> 00:00:02,000\nRania: The second line.\n";
    const blocks = buildSpeechBlocks(parseSrt(srt));
    const fix = { 0: { from: blockText(blocks[0]), to: "The first line." } };

    expect(blockText(applyBlockTextOverrides(blocks, fix)[0])).toBe("The first line.");

    // Same fix against a re-uploaded SRT whose first line differs: stale, ignored.
    const otherSrt =
      "1\n00:00:00,000 --> 00:00:01,000\nYassmin: A different opener.\n\n2\n00:00:01,200 --> 00:00:02,000\nRania: The second line.\n";
    const otherBlocks = buildSpeechBlocks(parseSrt(otherSrt));

    expect(blockText(applyBlockTextOverrides(otherBlocks, fix)[0])).toBe("A different opener.");
  });

  it("credits: structured entries pass through and empty rows drop from the render", () => {
    expect(
      readCredits([
        { name: "Yassmin Abdel-Magied", title: "Reporter" },
        { name: "", title: "" },
        { name: "  Sohaira Siddiqui  ", title: " Host " },
      ]),
    ).toEqual([
      { name: "Yassmin Abdel-Magied", title: "Reporter" },
      { name: "Sohaira Siddiqui", title: "Host" },
    ]);
  });

  it("credits: legacy string lines keep hyphenated names whole", () => {
    expect(
      readCredits("Yassmin Abdel-Magied — Reporter\nSarah Qari: Story Editor\nAmel Mukhtar - Exec. Producer"),
    ).toEqual([
      { name: "Yassmin Abdel-Magied", title: "Reporter" },
      { name: "Sarah Qari", title: "Story Editor" },
      { name: "Amel Mukhtar", title: "Exec. Producer" },
    ]);
  });

  it("credits: draft read keeps empty rows and never trims mid-typing text", () => {
    expect(
      readCreditsDraft([
        { name: "Salman Ahad ", title: "" },
        { name: "", title: "" },
      ]),
    ).toEqual([
      { name: "Salman Ahad ", title: "" },
      { name: "", title: "" },
    ]);
  });

  it("schema: content.credits.list is a visible creditsEditor control with a default", () => {
    const control = findControl(appSchema, "content.credits.list");

    expect(control?.type).toBe("creditsEditor");
    expect(Array.isArray(control?.defaultValue)).toBe(true);

    const defaults = control?.defaultValue as { name: string; title: string }[];

    expect(defaults.length).toBeGreaterThan(0);

    for (const credit of defaults) {
      expect(typeof credit.name).toBe("string");
      expect(credit.name).not.toBe("");
      expect(typeof credit.title).toBe("string");
    }
  });

  it("schema: export.includeBackground defaults to true", () => {
    const control = findControl(appSchema, "export.includeBackground");

    expect(control?.type).toBe("switch");
    expect(control?.defaultValue).toBe(true);
  });

  it("schema: appearance.background defaults to ivory beige", () => {
    const control = findControl(appSchema, "appearance.background");

    expect(control?.type).toBe("color");
    expect(control?.defaultValue).toEqual({ hex: "#FBF2E9" });
  });

  it("schema: export.image.format offers png and jpg", () => {
    const control = findControl(appSchema, "export.image.format");

    expect(optionValues(control)).toEqual(["png", "jpg"]);
    expect(control?.defaultValue).toBe("png");
  });

  it("schema: export.image.resolution offers current, 2k, 4k, and 8k", () => {
    const control = findControl(appSchema, "export.image.resolution");

    expect(optionValues(control)).toEqual(["current", "2k", "4k", "8k"]);
    expect(control?.defaultValue).toBe("4k");
  });

  it("schema: sticky footer exposes the Export PNG action", () => {
    const actionSections = (appSchema.panels.controls?.sections ?? []).filter(
      (section) => section.actionGroup,
    );
    const actions = actionSections.flatMap((section) =>
      Object.values(section.controls).flatMap((control) => control.actions ?? []),
    );
    const values = actions.map((action) =>
      typeof action === "string" ? action : action.value,
    );

    expect(values).toContain("export-png");
  });

  it("schema: persistence stores values, canvas, and panels in localStorage", () => {
    const persistence = appSchema.persistence;

    expect(persistence.storage).toBe("localStorage");

    if (persistence.storage !== "localStorage") {
      throw new Error("Persistence must use localStorage.");
    }

    expect(persistence.include).toEqual(
      expect.arrayContaining(["values", "canvas", "panels"]),
    );
  });

  it("schema: carousel.episode lists all ten episode sets", () => {
    const control = findControl(appSchema, "carousel.episode");

    expect(control?.type).toBe("select");
    expect(optionValues(control)).toEqual(
      EPISODE_ILLUSTRATIONS.map((entry) => entry.value),
    );
  });

  it("schema: carousel action builds the episode set", () => {
    const control = findControl(appSchema, "carousel.slides");
    const actionValues = (control?.actions ?? []).map((action) =>
      typeof action === "string" ? action : action.value,
    );

    expect(control?.type).toBe("actions");
    expect(actionValues).toEqual(["carousel-build-episode-set"]);

    const set = buildEpisodeSetSnapshots({}, "ep3");

    expect(set.map((slide) => slide.snapshot["post.template"])).toEqual([
      "cover",
      "synopsis",
      "synopsis",
      "credits",
      "streaming",
    ]);
    expect(set[0].snapshot["scene.illustration"]).toBe("ep3");
    expect(set[0].snapshot["content.cover.title"]).toBe("Secret Translators");
    expect(SLIDE_VALUE_TARGETS).toContain("post.template");
  });

  it("schema: the carousel uses the filmstrip, not the layers panel", () => {
    expect(appSchema.panels.layers).toBeUndefined();
    expect(
      appAcceptance.some((entry) => entry.id === "runtime.filmstrip.add"),
    ).toBe(true);
    expect(
      appAcceptance.some((entry) => entry.id === "runtime.filmstrip.selection"),
    ).toBe(true);
  });

  it("schema: filmstrip reorder drives carousel numbering", () => {
    const row = appAcceptance.find((entry) => entry.id === "runtime.filmstrip.reorder");

    expect(row?.evidence).toBe("exported-bytes");
    expect(row?.expectedObservable).toMatch(/slide-NN|position|renumber|order/i);
  });

  it("schema: audiogram.audio is a single audio fileDrop", () => {
    const control = findControl(appSchema, "audiogram.audio");

    expect(control?.type).toBe("fileDrop");
    expect(control?.accept).toBe("audio/*");
    expect(control?.multiple).toBe(false);
    expect(control?.visibleWhen).toEqual({
      equals: "audiogram",
      target: "post.template",
    });
  });

  it("schema: audiogram.captions is an SRT fileDrop", () => {
    const control = findControl(appSchema, "audiogram.captions");

    expect(control?.type).toBe("fileDrop");
    expect(control?.accept).toBe(".srt,.txt");
    expect(control?.visibleWhen).toEqual({
      equals: "audiogram",
      target: "post.template",
    });
  });

  it("schema: audiogram.guestColourway offers all nine colourways", () => {
    const control = findControl(appSchema, "audiogram.guestColourway");

    expect(control?.type).toBe("select");
    expect(optionValues(control)).toEqual([...COLOURWAY_KEYS]);
    expect(control?.visibleWhen).toEqual({
      equals: "audiogram",
      target: "post.template",
    });
  });

  it("schema: audiogram.crossfade toggles the speaker crossfade", () => {
    expect(findControl(appSchema, "audiogram.crossfade")?.type).toBe("switch");
  });

  it("schema: audiogram.breathing toggles envelope breathing and drift", () => {
    expect(findControl(appSchema, "audiogram.breathing")?.type).toBe("switch");
  });

  it("schema: audiogram.wordAccent toggles the spoken-word accent", () => {
    expect(findControl(appSchema, "audiogram.wordAccent")?.type).toBe("switch");
  });

  it("schema: audiogram.highlight offers auto, off, and choose", () => {
    const control = findControl(appSchema, "audiogram.highlight");

    expect(control?.type).toBe("select");
    expect(optionValues(control)).toEqual(["auto", "off", "choose"]);
  });

  it("schema: audiogram.highlightLine picks the highlighted caption block", () => {
    const control = findControl(appSchema, "audiogram.highlightLine");

    expect(control?.type).toBe("audiogramHighlightPicker");
    expect(control?.visibleWhen).toEqual({ equals: "choose", target: "audiogram.highlight" });
  });

  it("schema: audiogram.outro sets the closing-card lines", () => {
    expect(findControl(appSchema, "audiogram.outro")?.type).toBe("code");
  });

  it("schema: export.video.format offers mp4 and webm containers", () => {
    const control = findControl(appSchema, "export.video.format");

    expect(optionValues(control)).toEqual(["mp4", "webm"]);
    expect(control?.defaultValue).toBe("mp4");
  });

  it("schema: export.video.resolution offers current and 4k", () => {
    const control = findControl(appSchema, "export.video.resolution");

    expect(optionValues(control)).toEqual(["current", "4k"]);
    expect(control?.defaultValue).toBe("current");
  });

  it("schema: timeline playback drives the audiogram frame", () => {
    expect(appSchema.panels.timeline).toMatchObject({
      defaultDurationSeconds: 60,
      mode: "keyframes",
    });

    const row = appAcceptance.find((entry) => entry.id === "runtime.timeline.playback");

    expect(row?.timelineCoverage).toBe("playback");
  });

  it("schema: keyframed audiogram values evaluate through the timeline evaluator", () => {
    const row = appAcceptance.find((entry) => entry.id === "runtime.timeline.keyframes");

    expect(row?.timelineCoverage).toBe("keyframes");

    // The evaluator interpolates a keyframed slider value at the playhead —
    // the exact call both renderers make per frame.
    const state = {
      timeline: {
        currentTimeSeconds: 1,
        keyframeGroups: [
          {
            controlId: "audiogram.motionIntensity",
            keyframes: [
              {
                controlId: "audiogram.motionIntensity",
                controlLabel: "Motion intensity",
                id: "k1",
                timeSeconds: 0,
                value: 0,
                valueLabel: "0",
              },
              {
                controlId: "audiogram.motionIntensity",
                controlLabel: "Motion intensity",
                easing: { type: "linear" },
                id: "k2",
                timeSeconds: 2,
                value: 200,
                valueLabel: "200",
              },
            ],
            label: "Motion intensity",
          },
        ],
      },
      values: { "audiogram.motionIntensity": 100 },
    } as unknown as Parameters<typeof evaluateToolcraftTimelineValue>[0];

    const midpoint = evaluateToolcraftTimelineValue(state, "audiogram.motionIntensity", 1);

    expect(typeof midpoint).toBe("number");
    expect(midpoint as number).toBeGreaterThan(0);
    expect(midpoint as number).toBeLessThan(200);
    expect(evaluateToolcraftTimelineValue(state, "audiogram.motionIntensity", 0)).toBe(0);
    expect(evaluateToolcraftTimelineValue(state, "audiogram.motionIntensity", 2)).toBe(200);
  });

  it("schema: audiogram.motionIntensity scales the frame's ambient movement", () => {
    const control = findControl(appSchema, "audiogram.motionIntensity");

    expect(control?.type).toBe("slider");
    expect(control?.defaultValue).toBe(100);

    const base: AudiogramMotionConfig = {
      bgDrift: true,
      breathe: true,
      captionScale: 1,
      guestWay: "oak",
      hasImage: false,
      highlight: "off",
      hostWay: "night",
      motionScale: 1,
      solid: false,
      speakerSwap: true,
      wordAccent: true,
    };
    const still = groundMotion({ ...base, motionScale: 0 }, 5, 60);
    const brand = groundMotion(base, 5, 60);
    const doubled = groundMotion({ ...base, motionScale: 2 }, 5, 60);

    // Intensity 0 stops the pan entirely; higher intensity pans further.
    expect(still.tx).toBe(0);
    expect(Math.abs(doubled.tx)).toBeGreaterThan(Math.abs(brand.tx));
    expect(doubled.scale).toBeGreaterThan(brand.scale);
  });

  it("schema: audiogram.captionSize scales the caption text", () => {
    const control = findControl(appSchema, "audiogram.captionSize");

    expect(control?.type).toBe("slider");
    expect(control?.defaultValue).toBe(100);
    expect(control?.min).toBe(50);
    expect(control?.max).toBe(150);
  });

  it("filmstrip: the add button appends a slide", () => {
    const row = appAcceptance.find((entry) => entry.id === "runtime.filmstrip.add");

    expect(row?.kind).toBe("runtime");
    expect(row?.expectedObservable).toMatch(/\+ tile|append|add/i);
  });

  it("filmstrip: hidden while the audiogram template is selected", () => {
    const row = appAcceptance.find(
      (entry) => entry.id === "runtime.filmstrip.audiogram-hidden",
    );

    expect(row?.kind).toBe("runtime");
    expect(row?.expectedObservable).toMatch(/removes the filmstrip|hidden/i);
    expect(row?.expectedObservable).toMatch(/add-slide tile/i);
  });

  it("timeline: selecting the audiogram opens the extended transport", () => {
    const row = appAcceptance.find(
      (entry) => entry.id === "runtime.timeline.audiogram-extended",
    );

    expect(row?.kind).toBe("runtime");
    expect(row?.expectedObservable).toMatch(/extended/i);
    expect(row?.expectedObservable).toMatch(/scrubber/i);
  });

  it("filmstrip: selecting a thumbnail swaps the slide", () => {
    const row = appAcceptance.find(
      (entry) => entry.id === "runtime.filmstrip.selection",
    );

    expect(row?.kind).toBe("runtime");
    expect(row?.expectedObservable).toMatch(/thumbnail|select/i);
  });

  it("filmstrip: drag reorder renumbers the carousel ZIP", () => {
    const row = appAcceptance.find((entry) => entry.id === "runtime.filmstrip.reorder");

    expect(row?.evidence).toBe("exported-bytes");
    expect(row?.expectedObservable).toMatch(/drag|reorder|position/i);
  });

  it("filmstrip: delete removes a slide", () => {
    const row = appAcceptance.find((entry) => entry.id === "runtime.filmstrip.delete");

    expect(row?.kind).toBe("runtime");
    expect(row?.expectedObservable).toMatch(/delete|remove/i);
  });

  it("filmstrip: duplicate copies a slide", () => {
    const row = appAcceptance.find((entry) => entry.id === "runtime.filmstrip.duplicate");

    expect(row?.kind).toBe("runtime");
    expect(row?.expectedObservable).toMatch(/duplicate|copy/i);
  });
});
