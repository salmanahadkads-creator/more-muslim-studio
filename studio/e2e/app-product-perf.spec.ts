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

  const skipButton = page.getByRole("button", { name: /skip setup/i });

  if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skipButton.click();
  }

  await expect(page.locator(slideSelector)).toBeVisible();
}

async function chooseSelectOption(
  page: Page,
  label: string,
  optionLabel: string,
): Promise<void> {
  const group = page
    .getByRole("group")
    .filter({ has: page.getByText(label, { exact: true }) })
    .last();

  await group.getByRole("combobox").click();

  // The select popup portal does not expose option roles to the test engine;
  // it renders last in the document, so the last exact-text match is the
  // popup option.
  const option = page.getByText(optionLabel, { exact: true }).last();

  await option.waitFor({ state: "visible" });
  await option.click();
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

  const field = page
    .getByRole("group")
    .filter({ has: page.getByText("Episode", { exact: true }) })
    .last()
    .getByRole("textbox");

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("S2 E1");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-episode-change");
});

test("browser perf: content.cover.presents change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Cover");

  const field = page
    .getByRole("group")
    .filter({ has: page.getByText("Label", { exact: true }) })
    .last()
    .getByRole("textbox");

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("A new label");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-cover-presents-change");
});

test("browser perf: content.cover.title change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Cover");

  const field = page
    .getByRole("group")
    .filter({ has: page.getByText("Title", { exact: true }) })
    .last()
    .getByRole("textbox");

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("New Title Here");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-cover-title-change");
});

test("browser perf: content.quote.dialogue change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Quote exchange");

  const field = page
    .getByRole("group")
    .filter({ has: page.getByText("Dialogue", { exact: true }) })
    .last()
    .getByRole("textbox");

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("Host: A new exchange.");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-quote-dialogue-change");
});

test("browser perf: content.synopsis.body change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Synopsis");

  const field = page
    .getByRole("group")
    .filter({ has: page.getByText("Body", { exact: true }) })
    .last()
    .getByRole("textbox");

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("A fresh synopsis paragraph.");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-synopsis-body-change");
});

test("browser perf: content.streaming.lines change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Now streaming");

  const field = page
    .getByRole("group")
    .filter({ has: page.getByText("Outro", { exact: true }) })
    .last()
    .getByRole("textbox");

  await expect(field).toBeVisible();

  const result = await measureToolcraftInteraction(page, async () => {
    await field.fill("Listen today.");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "content-streaming-lines-change");
});

test("browser perf: content.credits.list change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Episode credits");

  const field = page
    .getByRole("group")
    .filter({ has: page.getByText("Credits", { exact: true }) })
    .last()
    .getByRole("textbox");

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
    await page
      .getByRole("group")
      .filter({ has: page.getByText("Include", { exact: true }) })
      .last()
      .getByRole("switch")
      .click();
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "export-includeBackground-change");
});

test("browser perf: appearance.background change stays within budget", async ({ page }) => {
  await openStudio(page);

  const hexInput = page.getByLabel("backgroundColor hex");

  await hexInput.scrollIntoViewIfNeeded();
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

  const handle = page.getByRole("button", { name: "Focus X/Y pad" });

  await handle.scrollIntoViewIfNeeded();

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
    await page.getByRole("button", { name: "ep3", exact: true }).click();
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

  const handle = page.locator('[data-slot="slider"] [role="slider"]').last();

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
  await page.getByRole("button", { name: "ep3", exact: true }).click();

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

test("browser perf: carousel.episode change stays within budget", async ({ page }) => {
  await openStudio(page);

  const result = await measureToolcraftInteraction(page, async () => {
    await chooseSelectOption(page, "Episode set", "E5 Hanabneehu");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "carousel-episode-change");
});

test("browser perf: carousel slide actions stay within budget", async ({ page }) => {
  await openStudio(page);

  const result = await measureToolcraftInteraction(page, async () => {
    await page.getByRole("button", { name: "Add slide" }).click();
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "carousel-slides-actions");
});

test("browser perf: slide layer interactions keep the canvas stable", async ({ page }) => {
  await openStudio(page);
  await page.getByRole("button", { name: "Build episode set" }).click();
  await expect(page.getByRole("listbox", { name: "Layers" }).getByText("Now Streaming")).toBeVisible();

  const canvas = page.getByRole("application", { name: "Canvas viewport" });
  const box = await canvas.boundingBox();

  if (!box) {
    throw new Error("Canvas viewport has no bounding box.");
  }

  const result = await measureToolcraftInteraction(page, async () => {
    await page.getByRole("listbox", { name: "Layers" }).getByText("Synopsis 1", { exact: true }).click();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -300);
    await page.mouse.wheel(0, 300);
    await page.getByRole("listbox", { name: "Layers" }).getByText("Cover", { exact: true }).click();
  });

  expectToolcraftScenarioPerformanceBudget(
    result,
    appPerformance,
    "layers-interactions-stability",
  );
});

function makePerfWav(): Buffer {
  const sampleRate = 8000;
  const samples = sampleRate * 2;
  const buffer = Buffer.alloc(44 + samples * 2);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples * 2, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples * 2, 40);

  return buffer;
}

test("browser perf: audiogram.audio change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Audiogram");

  const result = await measureToolcraftInteraction(page, async () => {
    await page.locator('input[type="file"]').first().setInputFiles({
      buffer: makePerfWav(),
      mimeType: "audio/wav",
      name: "perf-tone.wav",
    });
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "audiogram-audio-workload");
});

test("browser perf: audiogram.captions change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Audiogram");

  const blocks: string[] = [];

  for (let index = 0; index < 200; index += 1) {
    blocks.push(
      `${index + 1}`,
      `00:00:${String(index % 60).padStart(2, "0")},000 --> 00:00:${String((index % 60) + 1).padStart(2, "0")},000`,
      `Speaker: Caption block number ${index + 1}.`,
      "",
    );
  }

  const result = await measureToolcraftInteraction(page, async () => {
    await page.locator('input[type="file"]').nth(1).setInputFiles({
      buffer: Buffer.from(blocks.join("\n")),
      mimeType: "text/plain",
      name: "perf-captions.srt",
    });
  });

  expectToolcraftScenarioPerformanceBudget(
    result,
    appPerformance,
    "audiogram-captions-workload",
  );
});

test("browser perf: export.video.format change stays within budget", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Audiogram");

  const result = await measureToolcraftInteraction(page, async () => {
    await chooseSelectOption(page, "Format", "MP4");
  });

  expectToolcraftScenarioPerformanceBudget(result, appPerformance, "video-format-workload");
});

test("browser perf: export.video.resolution change stays within budget", async ({
  page,
}) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Audiogram");

  const result = await measureToolcraftInteraction(page, async () => {
    await chooseSelectOption(page, "Resolution", "4K");
  });

  expectToolcraftScenarioPerformanceBudget(
    result,
    appPerformance,
    "video-resolution-workload",
  );
});
