/* Fallback Playwright performance coverage for the More Muslim Social Studio.
   The preferred runner is the agent-controlled browser; these tests are the
   playwright-fallback for the same scenario budgets. */

import { expect, test, type Page } from "@playwright/test";

import { appPerformance } from "../src/app/app-performance";

import {
  expectToolcraftScenarioPerformanceBudget,
  measureToolcraftInteraction,
} from "./performance-helpers";

const slideSelector = "#mm-post-slide";

function makeLargeTestImage(): Buffer {
  // 1920x1080-equivalent vector source; matches the media workload fixture.
  return Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#C15A3A"/><circle cx="960" cy="540" r="400" fill="#FBF2E9"/></svg>',
  );
}

async function openStudio(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.locator(slideSelector)).toBeVisible();
}

async function chooseSelectOption(
  page: Page,
  label: string,
  optionLabel: string,
): Promise<void> {
  await page.getByRole("combobox", { name: label }).click();
  await page.getByRole("option", { name: optionLabel, exact: true }).click();
}

test("browser perf: post.template change stays within budget", async ({ page }) => {
  await openStudio(page);

  const result = await measureToolcraftInteraction(page, async () => {
    await chooseSelectOption(page, "Template", "Synopsis");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "post-template-change");
});

test("browser perf: content.episode change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Cover");

  const field = page.getByRole("textbox", { name: "Episode" }).or(page.getByLabel("Episode")).first();

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("S2 E1");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-episode-change");
});

test("browser perf: content.cover.presents change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Cover");

  const field = page.getByRole("textbox", { name: "Label" }).or(page.getByLabel("Label")).first();

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("A new label");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-cover-presents-change");
});

test("browser perf: content.cover.title change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Cover");

  const field = page.getByRole("textbox", { name: "Title" }).or(page.getByLabel("Title")).first();

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("New Title Here");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-cover-title-change");
});

test("browser perf: content.quote.dialogue change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Quote exchange");

  const field = page.getByRole("textbox", { name: "Dialogue" }).or(page.getByLabel("Dialogue")).first();

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("Host: A new exchange.");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-quote-dialogue-change");
});

test("browser perf: content.synopsis.body change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Synopsis");

  const field = page.getByRole("textbox", { name: "Body" }).or(page.getByLabel("Body")).first();

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("A fresh synopsis paragraph.");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-synopsis-body-change");
});

test("browser perf: content.streaming.lines change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Now streaming");

  const field = page.getByRole("textbox", { name: "Outro" }).or(page.getByLabel("Outro")).first();

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("Listen today.");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-streaming-lines-change");
});

test("browser perf: content.credits.list change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Episode credits");

  const field = page.getByRole("textbox", { name: "Credits" }).or(page.getByLabel("Credits")).first();

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("Someone New — Editor");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-credits-list-change");
});

test("browser perf: post.colourway change stays within budget", async ({ page }) => {
  await openStudio(page);

  const result = await measureToolcraftInteraction(page, async () => {
    await chooseSelectOption(page, "Colourway", "Terracotta");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "post-colourway-change");
});

test("browser perf: scene.source change stays within budget", async ({ page }) => {
  await openStudio(page);

  const result = await measureToolcraftInteraction(page, async () => {
    await chooseSelectOption(page, "Scene", "Solid colour");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "scene-source-change");
});

test("browser perf: export.includeBackground change stays within budget", async ({ page }) => {
  await openStudio(page);

  const result = await measureToolcraftInteraction(page, async () => {
    await page.getByRole("switch", { name: "Include" }).click();
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "export-includeBackground-change");
});

test("browser perf: appearance.background change stays within budget", async ({ page }) => {
  await openStudio(page);

  const hexInput = page
    .locator('input[value="#FBF2E9" i], input[value="FBF2E9" i]')
    .first();

  await expect(hexInput).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await hexInput.fill("#192136");
    await hexInput.press("Enter");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "appearance-background-change");
});

test("browser perf: scene.imagePosition change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Scene", "Episode illustration");

  const handle = page.locator('[data-slot="vector-pad"]').last();

  await expect(handle).toBeVisible();

  const box = await handle.boundingBox();

  if (!box) {
    throw new Error("Drag handle has no bounding box.");
  }

  const result = await measureToolcraftInteraction(page, async () => {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2 - 20, { steps: 8 });
    await page.mouse.up();
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "focus-drag");
});

test("browser perf: scene.illustration change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Scene", "Episode illustration");

  const result = await measureToolcraftInteraction(page, async () => {
    await page.getByRole("button", { name: "E3 Secret Translators" }).click();
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "illustration-workload");
});

test("browser perf: export.image.format change stays within budget", async ({ page }) => {
  await openStudio(page);

  const result = await measureToolcraftInteraction(page, async () => {
    await chooseSelectOption(page, "Format", "JPG");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "format-workload");
});

test("browser perf: zoom slider drag stays responsive on an illustration slide", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Scene", "Episode illustration");

  const handle = page.locator('[role="slider"]').last();

  await expect(handle).toBeVisible();

  const box = await handle.boundingBox();

  if (!box) {
    throw new Error("Drag handle has no bounding box.");
  }

  const result = await measureToolcraftInteraction(page, async () => {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2 - 20, { steps: 8 });
    await page.mouse.up();
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "image-zoom-drag");
});

test("browser perf: preview render stays within budget at the largest canvas", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Scene", "Episode illustration");
  await page.getByRole("button", { name: "E3 Secret Translators" }).click();

  const result = await measureToolcraftInteraction(page, async () => {
    await chooseSelectOption(page, "Template", "Synopsis");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "preview-render-stress");
});

test("browser perf: canvas pan and zoom stay stable with a rendered slide", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Scene", "Episode illustration");

  const canvas = page.getByRole("application", { name: "Canvas viewport" });
  const box = await canvas.boundingBox();

  if (!box) {
    throw new Error("Canvas viewport has no bounding box.");
  }

  const result = await measureToolcraftInteraction(page, async () => {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -400);
    await page.mouse.wheel(0, 400);
    await page.mouse.wheel(0, -400);
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "viewport-stability");
});

test("browser perf: canvas zoom keeps frame gaps within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Scene", "Episode illustration");

  const canvas = page.getByRole("application", { name: "Canvas viewport" });
  const box = await canvas.boundingBox();

  if (!box) {
    throw new Error("Canvas viewport has no bounding box.");
  }

  const result = await measureToolcraftInteraction(page, async () => {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -400);
    await page.mouse.wheel(0, 400);
    await page.mouse.wheel(0, -400);
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "viewport-zoom-stress");
});

test("browser perf: uploading a large image decodes within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Scene", "Uploaded image");

  const input = page.locator('input[type="file"]').first();
  const result = await measureToolcraftInteraction(page, async () => {
    await input.setInputFiles({
      buffer: makeLargeTestImage(),
      mimeType: "image/svg+xml",
      name: "perf-import-1920x1080.svg",
    });
    await expect(page.locator("#mm-post-slide img").first()).toBeVisible();
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "scene-media-import");
});

test("browser perf: scene.upload change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Scene", "Uploaded image");

  const input = page.locator('input[type="file"]').first();
  const result = await measureToolcraftInteraction(page, async () => {
    await input.setInputFiles({
      buffer: makeLargeTestImage(),
      mimeType: "image/svg+xml",
      name: "perf-import-1920x1080.svg",
    });
    await expect(page.locator("#mm-post-slide img").first()).toBeVisible();
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "upload-workload");
});

test("browser perf: export.image.resolution change stays within budget", async ({ page }) => {
  await openStudio(page);

  const result = await measureToolcraftInteraction(page, async () => {
    await chooseSelectOption(page, "Resolution", "8K");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "resolution-workload");
});

test("browser perf: 8K PNG export completes within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Scene", "Episode illustration");
  await chooseSelectOption(page, "Resolution", "8K");

  const downloadPromise = page.waitForEvent("download");
  const result = await measureToolcraftInteraction(page, async () => {
    await page.getByRole("button", { name: "Export PNG" }).click();
    await downloadPromise;
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "png-export-8k");
});
