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
import { buildEpisodeSetSnapshots, SLIDE_VALUE_TARGETS } from "./carousel";

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
    ]);
  });

  it("schema: post.colourway covers all nine approved pairings", () => {
    const control = findControl(appSchema, "post.colourway");

    expect(control?.type).toBe("select");
    expect(control?.defaultValue).toBe("night");
    expect(optionValues(control)).toEqual([...COLOURWAY_KEYS]);

    for (const key of COLOURWAY_KEYS) {
      expect(COLOURWAYS[key].bg).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(COLOURWAYS[key].ink).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("schema: scene.source gates illustration, upload, and crop controls", () => {
    const source = findControl(appSchema, "scene.source");
    const illustration = findControl(appSchema, "scene.illustration");
    const upload = findControl(appSchema, "scene.upload");
    const position = findControl(appSchema, "scene.imagePosition");
    const zoom = findControl(appSchema, "scene.imageZoom");

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
    expect(position?.visibleWhen).toEqual({
      oneOf: ["illustration", "upload"],
      target: "scene.source",
    });
    expect(zoom?.visibleWhen).toEqual({
      oneOf: ["illustration", "upload"],
      target: "scene.source",
    });
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

  it("schema: scene.imagePosition is a screen-space vector with 50/50 default", () => {
    const control = findControl(appSchema, "scene.imagePosition");

    expect(control?.type).toBe("vector");
    expect(control?.defaultValue).toEqual({ x: 50, y: 50 });
  });

  it("schema: scene.imageZoom is a live 1-2 slider", () => {
    const control = findControl(appSchema, "scene.imageZoom");

    expect(control?.type).toBe("slider");
    expect(control?.min).toBe(1);
    expect(control?.max).toBe(2);
    expect(control?.defaultValue).toBe(1);
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
  it("schema: content.credits.list is a visible code control with a default", () => {
    const control = findControl(appSchema, "content.credits.list");

    expect(control?.type).toBe("code");
    expect(typeof control?.defaultValue).toBe("string");
    expect(String(control?.defaultValue)).not.toBe("");
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

  it("schema: carousel actions add slides and build the episode set", () => {
    const control = findControl(appSchema, "carousel.slides");
    const actionValues = (control?.actions ?? []).map((action) =>
      typeof action === "string" ? action : action.value,
    );

    expect(control?.type).toBe("actions");
    expect(actionValues).toEqual(["carousel-add-slide", "carousel-build-episode-set"]);

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

  it("schema: layers panel is enabled for slide navigation", () => {
    expect(appSchema.panels.layers).toBe(true);
    expect(
      appAcceptance.some((entry) => entry.layerCoverage === "selection"),
    ).toBe(true);
  });

  it("schema: hidden slide layers are excluded from the carousel ZIP", () => {
    const row = appAcceptance.find((entry) => entry.layerCoverage === "visibility");

    expect(row?.evidence).toBe("exported-bytes");
    expect(row?.expectedObservable).toMatch(/exclud/i);
  });

  it("schema: slide layer order drives carousel numbering", () => {
    const row = appAcceptance.find((entry) => entry.layerCoverage === "reorder");

    expect(row?.evidence).toBe("exported-bytes");
    expect(row?.expectedObservable).toMatch(/slide-NN|position|renumber|order/i);
  });

  it("schema: slide layers support grouping without breaking export order", () => {
    const row = appAcceptance.find((entry) => entry.layerCoverage === "grouping");

    expect(row?.evidence).toBe("exported-bytes");
    expect(row?.expectedObservable).toMatch(/group/i);
  });
});
