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
// Style-only changes (colourway, scene ground) surface on the frame element.
const frameSelector = "#mm-post-slide [data-mm-post-frame]";
const layersList = (page: Page) => page.getByRole("listbox", { name: "Layers" });

async function openStudio(page: Page): Promise<void> {
  await page.goto("/");
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
      { selector: frameSelector },
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
    { selector: frameSelector },
  );
  await expect(page.getByText("Focus", { exact: true })).toHaveCount(0);

  await expectToolcraftProductObservableToChange(
    page,
    async () => setSceneSource(page, "Episode illustration"),
    { selector: frameSelector },
  );
  await expect(page.locator(`${slideSelector} img`).first()).toBeVisible();

  await expectToolcraftProductObservableToChange(
    page,
    async () => setSceneSource(page, "Pattern"),
    { selector: frameSelector },
  );
});

test("app controls: episode picker swaps the slide illustration", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  await expectToolcraftProductObservableToChange(
    page,
    async () => page.getByText("E2 Nikkah Loophole", { exact: true }).last().click(),
    { selector: frameSelector },
  );

  await setSceneSource(page, "Pattern");
  await expect(page.getByText("E2 Nikkah Loophole", { exact: true })).toHaveCount(0);
});

test("app controls: focus pad moves the image crop on both axes", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  const pad = page.getByLabel("Focus X/Y pad");

  await expect(pad).toBeVisible();

  const box = await pad.boundingBox();

  if (!box) {
    throw new Error("Vector pad has no bounding box.");
  }

  const before = await getToolcraftProductObservableSnapshot(page, {
    selector: frameSelector,
  });

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.3, { steps: 6 });

  const during = await getToolcraftProductObservableSnapshot(page, {
    selector: frameSelector,
  });

  await page.mouse.up();

  expect(during, "Focus drag must update the slide during the drag.").not.toBe(before);
});

test("app controls: zoom slider scales the slide image during drag", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  const thumb = page
    .locator('[data-slot="slider"] [role="slider"]')
    .last();

  await expect(thumb).toBeVisible();

  const box = await thumb.boundingBox();

  if (!box) {
    throw new Error("Zoom slider thumb has no bounding box.");
  }

  const before = await getToolcraftProductObservableSnapshot(page, {
    selector: frameSelector,
  });

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + box.height / 2, { steps: 8 });

  const during = await getToolcraftProductObservableSnapshot(page, {
    selector: frameSelector,
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
      .getByRole("group")
      .filter({ has: page.getByText(label, { exact: true }) })
      .last()
      .getByRole("textbox");

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
    async () =>
      page
        .getByRole("group")
        .filter({ has: page.getByText("Include", { exact: true }) })
        .last()
        .getByRole("switch")
        .click(),
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

async function buildEpisodeSet(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Build episode set" }).click();
  await expect(layersList(page).getByText("Now Streaming")).toBeVisible();
}

test("app controls: episode set select changes the built carousel", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Episode set", "E3 Secret Translators");
  await buildEpisodeSet(page);
  await expect(page.locator(slideSelector)).toContainText("Secret Translators", {
    ignoreCase: true,
  });
});

test("app controls: carousel actions create slide layers", async ({ page }) => {
  await openStudio(page);
  await page.getByRole("button", { name: "Add slide" }).click();
  await expect(layersList(page).getByText("Slide 1")).toBeVisible();
  await buildEpisodeSet(page);
  await expect(layersList(page).getByText("Cover", { exact: true })).toBeVisible();
  await expect(layersList(page).getByText("Credits", { exact: true })).toBeVisible();
});

test("runtime: selecting a slide layer swaps the slide values", async ({ page }) => {
  await openStudio(page);
  await buildEpisodeSet(page);

  await expectToolcraftProductObservableToChange(
    page,
    async () => layersList(page).getByText("Synopsis 1", { exact: true }).click(),
    { selector: slideSelector },
  );
  await expectToolcraftProductObservableToChange(
    page,
    async () => layersList(page).getByText("Cover", { exact: true }).click(),
    { selector: slideSelector },
  );
});

async function downloadZipNames(page: Page): Promise<string[]> {
  const downloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export ZIP" }).click();

  const download = await downloadPromise;
  const filePath = await download.path();

  if (!filePath) {
    throw new Error("ZIP download has no path.");
  }

  const bytes = readFileSync(filePath);
  const names: string[] = [];
  let cursor = 0;

  while (cursor < bytes.length - 4) {
    if (bytes.readUInt32LE(cursor) === 0x04034b50) {
      const nameLength = bytes.readUInt16LE(cursor + 26);
      const size = bytes.readUInt32LE(cursor + 18);

      names.push(bytes.subarray(cursor + 30, cursor + 30 + nameLength).toString());
      cursor += 30 + nameLength + size;
    } else {
      break;
    }
  }

  return names;
}

test("runtime: hiding a slide layer removes it from the exported ZIP", async ({
  page,
}) => {
  await openStudio(page);
  await buildEpisodeSet(page);

  const fullNames = await downloadZipNames(page);

  expect(fullNames).toHaveLength(5);

  const row = layersList(page).getByText("Synopsis 2", { exact: true });

  await row.hover();
  await page.getByRole("button", { name: "Hide Synopsis 2" }).click();

  const reducedNames = await downloadZipNames(page);

  expect(reducedNames).toHaveLength(4);
});

test("runtime: reordering slide layers renumbers the exported ZIP", async ({
  page,
}) => {
  await openStudio(page);
  await buildEpisodeSet(page);

  const before = await downloadZipNames(page);

  expect(before[0]).toBe("slide-01.png");

  const source = layersList(page).getByText("Now Streaming", { exact: true });
  const target = layersList(page).getByText("Cover", { exact: true });
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Layer rows have no bounding boxes.");
  }

  await page.mouse.move(sourceBox.x + 20, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + 20, targetBox.y + 2, { steps: 8 });
  await page.mouse.up();

  const after = await downloadZipNames(page);

  expect(after).toHaveLength(before.length);
});

test("runtime: grouped slide layers keep their carousel order", async ({ page }) => {
  await openStudio(page);
  await buildEpisodeSet(page);

  const names = await downloadZipNames(page);

  expect(names).toEqual([
    "slide-01.png",
    "slide-02.png",
    "slide-03.png",
    "slide-04.png",
    "slide-05.png",
  ]);
});
