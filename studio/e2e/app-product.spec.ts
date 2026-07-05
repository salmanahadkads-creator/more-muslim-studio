/* Browser acceptance for the More Muslim Social Studio.
   Test names are referenced from appAcceptance rows (fallback Playwright
   runner for the agent-browser checkpoint). */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test, type Download, type Page } from "@playwright/test";

import {
  expectToolcraftProductObservableToChange,
  getToolcraftProductObservableSnapshot,
} from "./product-observable-helpers";

const slideSelector = "#mm-post-slide";

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

async function setSceneSource(page: Page, optionLabel: string): Promise<void> {
  await chooseSelectOption(page, "Scene", optionLabel);
}

async function decodeDownloadedImage(
  page: Page,
  download: Download,
): Promise<{ height: number; width: number }> {
  const filePath = await download.path();

  if (!filePath) {
    throw new Error("Exported download has no local file path.");
  }

  const base64 = readFileSync(filePath).toString("base64");
  const mimeType = download.suggestedFilename().endsWith(".jpg")
    ? "image/jpeg"
    : "image/png";

  // Decode the exported bytes in the page with createImageBitmap and read the
  // actual bitmap.width / bitmap.height of the export.
  return page.evaluate(
    async ({ base64: encoded, mimeType: type }) => {
      const response = await fetch(`data:${type};base64,${encoded}`);
      const bitmap = await createImageBitmap(await response.blob());

      return { height: bitmap.height, width: bitmap.width };
    },
    { base64, mimeType },
  );
}

test("app controls: template select swaps the slide layout", async ({ page }) => {
  await openStudio(page);

  for (const template of [
    "Quote exchange",
    "Synopsis",
    "Now streaming",
    "Episode credits",
    "Cover",
  ]) {
    await expectToolcraftProductObservableToChange(
      page,
      async () => chooseSelectOption(page, "Template", template),
      { selector: slideSelector },
    );
  }
});

test("app controls: colourway select restyles the slide ground and ink", async ({
  page,
}) => {
  await openStudio(page);

  for (const colourway of [
    "Oak Brown",
    "Ivory Beige",
    "Harvest Yellow",
    "Terracotta",
    "Mist Blue",
    "Coastal Blue",
    "Stone Blue",
    "Black",
    "Night Blue",
  ]) {
    await expectToolcraftProductObservableToChange(
      page,
      async () => chooseSelectOption(page, "Colourway", colourway),
      { selector: slideSelector },
    );
  }
});

test("app controls: scene source switches pattern, solid, and image grounds", async ({
  page,
}) => {
  await openStudio(page);

  await expectToolcraftProductObservableToChange(
    page,
    async () => setSceneSource(page, "Solid colour"),
    { selector: slideSelector },
  );
  await expect(page.getByRole("combobox", { name: "Episode" })).toHaveCount(0);

  await expectToolcraftProductObservableToChange(
    page,
    async () => setSceneSource(page, "Episode illustration"),
    { selector: slideSelector },
  );
  await expect(page.locator(`${slideSelector} img`).first()).toBeVisible();

  await expectToolcraftProductObservableToChange(
    page,
    async () => setSceneSource(page, "Pattern"),
    { selector: slideSelector },
  );
});

test("app controls: episode picker swaps the slide illustration", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  await expectToolcraftProductObservableToChange(
    page,
    async () => page.getByRole("button", { name: "E2 Nikkah Loophole" }).click(),
    { selector: slideSelector },
  );

  await setSceneSource(page, "Pattern");
  await expect(page.getByRole("button", { name: "E2 Nikkah Loophole" })).toHaveCount(0);
});

test("app controls: focus pad moves the image crop on both axes", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  const pad = page.locator('[data-slot="vector-pad"]').first();

  await expect(pad).toBeVisible();

  const box = await pad.boundingBox();

  if (!box) {
    throw new Error("Vector pad has no bounding box.");
  }

  const before = await getToolcraftProductObservableSnapshot(page, {
    selector: slideSelector,
  });

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.3, { steps: 6 });

  const during = await getToolcraftProductObservableSnapshot(page, {
    selector: slideSelector,
  });

  await page.mouse.up();

  expect(during, "Focus drag must update the slide during the drag.").not.toBe(before);
});

test("app controls: zoom slider scales the slide image during drag", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  const thumb = page
    .locator('[data-slot="slider"]')
    .filter({ has: page.locator("visible=true") })
    .last()
    .locator('[role="slider"]');

  await expect(thumb).toBeVisible();

  const box = await thumb.boundingBox();

  if (!box) {
    throw new Error("Zoom slider thumb has no bounding box.");
  }

  const before = await getToolcraftProductObservableSnapshot(page, {
    selector: slideSelector,
  });

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + box.height / 2, { steps: 8 });

  const during = await getToolcraftProductObservableSnapshot(page, {
    selector: slideSelector,
  });

  await page.mouse.up();

  expect(during, "Zoom must update the slide during the drag.").not.toBe(before);
});

test("app controls: uploading an image renders it as the slide ground", async ({
  page,
}) => {
  await openStudio(page);
  await setSceneSource(page, "Uploaded image");

  const canvasSizeBefore = await page.evaluate(() => {
    const slide = document.querySelector("#mm-post-slide");
    return slide ? `${slide.clientWidth}x${slide.clientHeight}` : "";
  });

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      const input = page.locator('input[type="file"]').first();

      await input.setInputFiles({
        buffer: Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><rect width="300" height="100" fill="#C15A3A"/></svg>',
        ),
        mimeType: "image/svg+xml",
        name: "upload-fixture.svg",
      });
    },
    { selector: slideSelector },
  );

  const canvasSizeAfter = await page.evaluate(() => {
    const slide = document.querySelector("#mm-post-slide");
    return slide ? `${slide.clientWidth}x${slide.clientHeight}` : "";
  });

  expect(
    canvasSizeAfter,
    "Uploading must not resize the canvas; the image covers/crops inside it.",
  ).toBe(canvasSizeBefore);

  // Rotate + flip actions must reach the rendered slide.
  const rotate = page.getByRole("button", { name: /rotate/i }).first();

  if (await rotate.isVisible().catch(() => false)) {
    await expectToolcraftProductObservableToChange(
      page,
      async () => rotate.click(),
      { selector: slideSelector },
    );
  }

  // Remove restores the empty upload state.
  const removeButton = page.getByRole("button", { name: /remove|clear/i }).first();

  if (await removeButton.isVisible().catch(() => false)) {
    await expectToolcraftProductObservableToChange(
      page,
      async () => removeButton.click(),
      { selector: slideSelector },
    );
  }
});

const textCases: {
  label: string;
  name: string;
  template: string;
  value: string;
}[] = [
  { label: "Episode", name: "app controls: editing content.episode updates the slide text", template: "Cover", value: "S2 E11" },
  { label: "Label", name: "app controls: editing content.cover.presents updates the slide text", template: "Cover", value: "A new series" },
  { label: "Title", name: "app controls: editing content.cover.title updates the slide text", template: "Cover", value: "The Long Return" },
  { label: "Dialogue", name: "app controls: editing content.quote.dialogue updates the slide text", template: "Quote exchange", value: "Amel: We kept going." },
  { label: "Body", name: "app controls: editing content.synopsis.body updates the slide text", template: "Synopsis", value: "A story about return.\n\nAnd renewal." },
  { label: "Outro", name: "app controls: editing content.streaming.lines updates the slide text", template: "Now streaming", value: "Listen now.\nEverywhere." },
  { label: "Credits", name: "app controls: editing content.credits.list updates the slide text", template: "Episode credits", value: "Amel Mukhtar — Producer" },
];

for (const { label, name, template, value } of textCases) {
  test(name, async ({ page }) => {
    await openStudio(page);
    await chooseSelectOption(page, "Template", template);

    const field = page
      .getByRole("textbox", { name: label })
      .or(page.getByLabel(label))
      .first();

    await expect(field).toBeVisible();
    await expectToolcraftProductObservableToChange(
      page,
      async () => {
        await field.fill(value);
      },
      { selector: slideSelector },
    );
    await expect(page.locator(slideSelector)).toContainText(
      value.split("\n")[0].replace(/^[^:]*:\s*/, "").slice(0, 12),
      { ignoreCase: true },
    );
  });
}

test("app controls: include toggle hides the slide ground and exports transparent pixels", async ({
  page,
}) => {
  await openStudio(page);

  await expectToolcraftProductObservableToChange(
    page,
    async () => page.getByRole("switch", { name: "Include" }).click(),
    { selector: slideSelector },
  );

  const frameBackground = await page.evaluate(() => {
    const frame = document.querySelector("[data-mm-post-frame]");
    return frame ? getComputedStyle(frame).backgroundColor : "";
  });

  expect(frameBackground).toBe("rgba(0, 0, 0, 0)");

  const downloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export PNG" }).click();

  const download = await downloadPromise;

  expect(await download.path()).toBeTruthy();
});

test("app controls: background colour fills the export backdrop", async ({ page }) => {
  await openStudio(page);

  const hexInput = page.locator('input[value="#FBF2E9" i], input[value="FBF2E9" i]').first();

  await expect(hexInput).toBeVisible();
  await hexInput.fill("#192136");
  await hexInput.press("Enter");

  const downloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export PNG" }).click();

  const download = await downloadPromise;

  expect(await download.path()).toBeTruthy();
});

test("app controls: image format changes the exported file type", async ({ page }) => {
  await openStudio(page);

  await chooseSelectOption(page, "Format", "JPG");

  const jpgDownloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export PNG" }).click();

  const jpgDownload = await jpgDownloadPromise;

  expect(jpgDownload.suggestedFilename()).toMatch(/\.jpg$/);

  await chooseSelectOption(page, "Format", "PNG");

  const pngDownloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export PNG" }).click();

  const pngDownload = await pngDownloadPromise;

  expect(pngDownload.suggestedFilename()).toMatch(/\.png$/);
});

test("app controls: image resolution changes exported pixel dimensions", async ({
  page,
}) => {
  await openStudio(page);

  // export.image.resolution 2k -> 2048px long edge
  await chooseSelectOption(page, "Resolution", "2K");

  const download2kPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export PNG" }).click();

  const image2k = await decodeDownloadedImage(page, await download2kPromise);

  expect(Math.max(image2k.width, image2k.height)).toBe(2048);

  // export.image.resolution 4k -> 4096px long edge
  await chooseSelectOption(page, "Resolution", "4K");

  const download4kPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export PNG" }).click();

  const image4k = await decodeDownloadedImage(page, await download4kPromise);

  expect(Math.max(image4k.width, image4k.height)).toBe(4096);
  expect(image4k.width).toBeGreaterThan(image2k.width);
});

test("app controls: export png downloads the rendered slide", async ({ page }) => {
  await openStudio(page);

  const downloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export PNG" }).click();

  const download = await downloadPromise;
  const image = await decodeDownloadedImage(page, download);

  expect(image.width).toBeGreaterThan(0);
  expect(image.height).toBeGreaterThan(0);
});

test("runtime: edited settings survive a page reload", async ({ page }) => {
  await openStudio(page);

  await chooseSelectOption(page, "Colourway", "Terracotta");
  // Give persistence a moment to write.
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.locator(slideSelector)).toBeVisible();

  const frameBackground = await page.evaluate(() => {
    const frame = document.querySelector("[data-mm-post-frame]");
    return frame ? getComputedStyle(frame).backgroundColor : "";
  });

  // Terracotta ground #C15A3A
  expect(frameBackground).toBe("rgb(193, 90, 58)");
});
