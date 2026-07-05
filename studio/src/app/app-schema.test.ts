import { describe, expect, it } from "vitest";

import { getToolcraftControlOrderTargets } from "./app-acceptance";
import { appPerformance } from "./app-performance";
import { appSchema } from "./app-schema";

describe("appSchema", () => {
  it("publishes the Toolcraft runtime contract for the studio", () => {
    expect(appSchema.canvas.draggable).toBe(true);
    expect(appSchema.canvas.enabled).toBe(true);
    expect(appSchema.canvas.sizing).toEqual({ mode: "editable-output" });
    expect(appSchema.canvas.upload).toBe(false);
    expect(appSchema.canvas.size).toEqual({ height: 1350, unit: "px", width: 1080 });
    expect(appSchema.panels.controls?.sections[0]?.title).toBe("Setup");
    expect(appSchema.panels.controls?.sections[0]?.controls.settingsTransfer).toMatchObject({
      target: "runtime.settingsTransfer",
      type: "settingsTransfer",
    });
    expect(appSchema.panels.controls?.sections[0]?.controls.canvasAspectRatio).toMatchObject({
      target: "canvas.aspectRatio",
      type: "aspectRatio",
    });
    expect(appSchema.panels.layers).toBe(true);
    expect(appSchema.panels.timeline).toBeUndefined();
    expect(appSchema.toolbar).toEqual({
      history: true,
      radar: true,
      theme: true,
      zoom: true,
    });
  });

  it("exposes the studio product sections after runtime setup", () => {
    const sectionTitles =
      appSchema.panels.controls?.sections.map((section) => section.title) ?? [];

    expect(sectionTitles[0]).toBe("Setup");
    expect(sectionTitles).toEqual(
      expect.arrayContaining([
        "Post",
        "Colourway",
        "Scene",
        "Carousel",
        "Background",
        "Image Export",
      ]),
    );
    expect(getToolcraftControlOrderTargets(appSchema)).toEqual([
      "post.template",
      "content.episode",
      "content.cover.presents",
      "content.cover.title",
      "content.quote.dialogue",
      "content.synopsis.body",
      "content.streaming.lines",
      "content.credits.list",
      "post.colourway",
      "scene.source",
      "scene.illustration",
      "scene.upload",
      "scene.imagePosition",
      "scene.imageZoom",
      "carousel.episode",
      "carousel.slides",
      "export.includeBackground",
      "appearance.background",
      "export.image.format",
      "export.image.resolution",
    ]);
  });

  it("does not imply timeline behavior for a still-output product", () => {
    expect(appSchema.assembly.capabilities).not.toContain("timeline.playback");
    expect(appSchema.assembly.capabilities).not.toContain("timeline.keyframes");
    expect(appSchema.assembly.commands).not.toContain("timeline.setCurrentTime");
    expect(appSchema.assembly.commands).not.toContain("timeline.moveKeyframe");
  });

  it("declares performance coverage for the DOM slide renderer", () => {
    expect(appPerformance.usesCustomRenderer).toBe(true);
    expect(appPerformance.rendererStrategy).toBe("dom");
    expect(appPerformance.scenarios.length).toBeGreaterThanOrEqual(4);
  });

  it("performance: zoom drag budget is declared for the image scene", () => {
    const scenario = appPerformance.scenarios.find(
      (entry) => entry.id === "image-zoom-drag",
    );

    expect(scenario?.interaction).toBe("control-drag");
    expect(scenario?.target).toBe("scene.imageZoom");
    expect(scenario?.budget.maxFrameGapMs).toBeLessThanOrEqual(120);
    expect(scenario?.budget.maxInteractionMs).toBeLessThanOrEqual(2000);
    expect(scenario?.stressFixture?.value).toBe(2);
  });

  it("performance: viewport stability budget is declared for the slide canvas", () => {
    const scenario = appPerformance.scenarios.find(
      (entry) => entry.id === "viewport-stability",
    );

    expect(scenario?.interaction).toBe("viewport-stability");
    expect(scenario?.budget.maxFrameGapMs).toBeLessThanOrEqual(120);
  });

  it("performance: media import budget is declared for scene uploads", () => {
    const scenario = appPerformance.scenarios.find(
      (entry) => entry.id === "scene-media-import",
    );

    expect(scenario?.interaction).toBe("media-import");
    expect(scenario?.target).toBe("scene.upload");
    expect(scenario?.workloadFixture?.kind).toBe("media");
  });

  it("performance: export budget is declared for 8K PNG delivery", () => {
    const scenario = appPerformance.scenarios.find(
      (entry) => entry.id === "png-export-8k",
    );

    expect(scenario?.interaction).toBe("export-copy");
    expect(scenario?.budget.maxExportMs).toBeLessThanOrEqual(8000);
    expect(scenario?.stressFixture?.value).toBe("8k");
  });

  it("performance: post.template scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "post-template-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: post.template change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: content.episode scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "content-episode-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: content.episode change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: content.cover.presents scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "content-cover-presents-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: content.cover.presents change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: content.cover.title scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "content-cover-title-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: content.cover.title change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: content.quote.dialogue scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "content-quote-dialogue-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: content.quote.dialogue change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: content.synopsis.body scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "content-synopsis-body-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: content.synopsis.body change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: content.streaming.lines scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "content-streaming-lines-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: content.streaming.lines change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: content.credits.list scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "content-credits-list-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: content.credits.list change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: post.colourway scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "post-colourway-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: post.colourway change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: scene.source scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "scene-source-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: scene.source change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: export.includeBackground scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "export-includeBackground-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: export.includeBackground change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: appearance.background scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "appearance-background-change");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: appearance.background change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: scene.imagePosition scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "focus-drag");

    expect(scenario?.interaction).toBe("control-drag");
    expect(scenario?.browserTestName).toBe("browser perf: scene.imagePosition change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: scene.illustration scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "illustration-workload");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: scene.illustration change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: export.image.format scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "format-workload");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: export.image.format change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: stress preview budget is declared for the largest slide", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "preview-render-stress");

    expect(scenario?.interaction).toBe("preview-render");
    expect(scenario?.browserTestName).toBe("browser perf: preview render stays within budget at the largest canvas");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: viewport zoom stress budget is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "viewport-zoom-stress");

    expect(scenario?.interaction).toBe("viewport-zoom-stress");
    expect(scenario?.browserTestName).toBe("browser perf: canvas zoom keeps frame gaps within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: scene.upload scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "upload-workload");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: scene.upload change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: export.image.resolution scenario is declared", () => {
    const scenario = appPerformance.scenarios.find((entry) => entry.id === "resolution-workload");

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.browserTestName).toBe("browser perf: export.image.resolution change stays within budget");
    expect(Object.keys(scenario?.budget ?? {}).length).toBeGreaterThan(0);
  });

  it("performance: carousel.episode scenario is declared", () => {
    const scenario = appPerformance.scenarios.find(
      (entry) => entry.id === "carousel-episode-change",
    );

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.target).toBe("carousel.episode");
  });

  it("performance: carousel.slides scenario is declared", () => {
    const scenario = appPerformance.scenarios.find(
      (entry) => entry.id === "carousel-slides-actions",
    );

    expect(scenario?.interaction).toBe("control-change");
    expect(scenario?.target).toBe("carousel.slides");
  });

  it("performance: layer interactions budget is declared", () => {
    const scenario = appPerformance.scenarios.find(
      (entry) => entry.id === "layers-interactions-stability",
    );

    expect(scenario?.interaction).toBe("viewport-stability");
    expect(scenario?.target).toBe("layers.interactions");
  });
});
