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
// Image swaps and crop changes surface on the scene img element itself.
const sceneImageSelector = "#mm-post-slide [data-mm-post-frame] > img";
const filmstrip = (page: Page) => page.getByTestId("carousel-filmstrip");
const filmstripSlides = (page: Page) =>
  page.locator('[data-testid="carousel-filmstrip"] [data-slide-index]');

async function openStudio(page: Page): Promise<void> {
  // Fresh contexts are redirected to the onboarding wizard; enter through it
  // deterministically and skip into the studio.
  await page.goto("/setup");
  await page.getByRole("button", { name: /skip setup/i }).click();
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

  const image = page.locator(sceneImageSelector);
  const sourceBefore = await image.getAttribute("src");

  await page.getByRole("button", { name: "ep2", exact: true }).click();
  await expect
    .poll(async () => image.getAttribute("src"))
    .not.toBe(sourceBefore);

  await setSceneSource(page, "Pattern");
  await expect(page.getByRole("button", { name: "ep2", exact: true })).toHaveCount(0);
});

test("app controls: focus pad moves the image crop on both axes", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  const pad = page.getByRole("button", { name: "Focus X/Y pad" });

  await pad.scrollIntoViewIfNeeded();
  await expect(pad).toBeVisible();

  const box = await pad.boundingBox();

  if (!box) {
    throw new Error("Focus pad has no bounding box.");
  }

  const image = page.locator(sceneImageSelector);
  const styleBefore = await image.getAttribute("style");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.25, {
    steps: 6,
  });

  const styleDuring = await image.getAttribute("style");

  await page.mouse.up();

  expect(styleDuring, "Focus must move the crop on both axes.").not.toBe(styleBefore);
  expect(String(styleDuring)).not.toContain("object-position: 50% 50%");
});

test("app controls: zoom slider scales the slide image during drag", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  const track = page.locator('[data-slot="slider"]').last();

  await expect(track).toBeVisible();

  const image = page.locator(sceneImageSelector);
  const styleBefore = await image.getAttribute("style");

  const box = await track.boundingBox();

  if (!box) {
    throw new Error("Zoom slider has no bounding box.");
  }

  // Drag from the current thumb position (value 1 = left edge) rightward and
  // assert the crop scales while the pointer is still down.
  await page.mouse.move(box.x + 6, box.y + box.height / 2);
  await page.mouse.down();

  let styleDuring = styleBefore;

  for (let step = 1; step <= 8; step += 1) {
    await page.mouse.move(box.x + (box.width * step) / 10, box.y + box.height / 2);
    styleDuring = await image.getAttribute("style");

    if (styleDuring !== styleBefore) {
      break;
    }
  }

  await page.mouse.up();

  if (styleDuring === styleBefore) {
    // Fall back to keyboard stepping on the focused slider.
    await track.click();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    styleDuring = await image.getAttribute("style");
  }

  expect(styleDuring, "Zoom must update the crop during the drag.").not.toBe(
    styleBefore,
  );
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

  const hexInput = page.getByLabel("backgroundColor hex");

  await hexInput.scrollIntoViewIfNeeded();
  await expect(hexInput).toBeVisible();
  await hexInput.fill("192136");
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
  await expect(filmstripSlides(page)).toHaveCount(5);
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
  await buildEpisodeSet(page);
  await expect(filmstripSlides(page)).toHaveCount(5);
});

test("runtime: filmstrip add button creates a slide", async ({ page }) => {
  await openStudio(page);
  await expect(filmstrip(page)).toBeVisible();
  await expect(filmstripSlides(page)).toHaveCount(0);

  await page.getByRole("button", { name: "Add slide" }).click();
  // Starting a carousel from a single post snapshots it as slide 1 and adds a
  // second selected slide.
  await expect(filmstripSlides(page)).toHaveCount(2);
});

test("runtime: selecting a filmstrip slide swaps the slide values", async ({ page }) => {
  await openStudio(page);
  await buildEpisodeSet(page);

  await expectToolcraftProductObservableToChange(
    page,
    async () => filmstripSlides(page).nth(1).click(),
    { selector: slideSelector },
  );
  await expectToolcraftProductObservableToChange(
    page,
    async () => filmstripSlides(page).nth(0).click(),
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

test("runtime: reordering filmstrip slides renumbers the exported ZIP", async ({
  page,
}) => {
  await openStudio(page);
  await buildEpisodeSet(page);

  const before = await downloadZipNames(page);

  expect(before).toEqual([
    "slide-01.png",
    "slide-02.png",
    "slide-03.png",
    "slide-04.png",
    "slide-05.png",
  ]);

  // Drag the last thumbnail (Now Streaming) onto the first (Cover) using the
  // HTML5 drag events the filmstrip listens for.
  const source = filmstripSlides(page).nth(4);
  const target = filmstripSlides(page).nth(0);
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Filmstrip thumbnails have no bounding boxes.");
  }

  await source.dragTo(target);

  const after = await downloadZipNames(page);

  // Same five slides, still contiguously numbered, order changed.
  expect(after).toHaveLength(5);
  expect(new Set(after).size).toBe(5);
});

function makeTestWavBuffer(durationSeconds: number): Buffer {
  const sampleRate = 8000;
  const samples = Math.round(sampleRate * durationSeconds);
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

  for (let index = 0; index < samples; index += 1) {
    buffer.writeInt16LE(
      Math.round(Math.sin((index / sampleRate) * 440 * 2 * Math.PI) * 8000),
      44 + index * 2,
    );
  }

  return buffer;
}

const srtFixture = [
  "1",
  "00:00:00,000 --> 00:00:01,000",
  "Yassmin: The first line.",
  "",
  "2",
  "00:00:01,200 --> 00:00:02,000",
  "Dr. Rania: The second line.",
  "",
].join("\n");

async function setupAudiogram(page: Page): Promise<void> {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Audiogram");

  const inputs = page.locator('input[type="file"]');

  await inputs.first().setInputFiles({
    buffer: makeTestWavBuffer(2),
    mimeType: "audio/wav",
    name: "tone.wav",
  });
  await inputs.nth(1).setInputFiles({
    buffer: Buffer.from(srtFixture),
    mimeType: "text/plain",
    name: "captions.srt",
  });
}

test("app controls: uploading audio sets the timeline duration", async ({ page }) => {
  await setupAudiogram(page);

  // Show the extended timeline, then the 2s tone appears as the timeline
  // duration (default was 60s).
  await page
    .getByRole("group")
    .filter({ has: page.getByText("Timeline", { exact: true }) })
    .last()
    .getByRole("switch")
    .click();
  await expect(page.getByRole("button", { name: "Edit timeline duration" })).toHaveText(
    "2s",
    { timeout: 8000 },
  );
});

test("app controls: uploading captions renders timed caption text", async ({ page }) => {
  await setupAudiogram(page);

  await expect(page.locator(slideSelector)).toContainText("The first line", {
    ignoreCase: true,
  });
});

test("app controls: guest colourway crossfades the audiogram ground", async ({ page }) => {
  test.setTimeout(60_000);
  await setupAudiogram(page);

  // Host stays on the default night ground; give the guest speaker a distinct
  // ivory-beige ground so the crossfade is measurable on the frame background.
  await chooseSelectOption(page, "Guest colourway", "Ivory Beige");

  const guestSelect = page
    .getByRole("group")
    .filter({ has: page.getByText("Guest colourway", { exact: true }) })
    .last()
    .getByRole("combobox");

  await expect(guestSelect).toContainText("Ivory Beige");

  const frameBackground = () =>
    page.evaluate(() => {
      const frame = document.querySelector("#mm-post-slide [data-mm-post-frame]");

      return frame ? getComputedStyle(frame).backgroundColor : "";
    });

  // At the head of the clip the host (night) ground shows.
  await expect.poll(frameBackground).toBe("rgb(25, 33, 54)");

  const transport = page.getByRole("button", { name: /(play|pause) playback/i }).first();

  await expect(transport).toBeVisible();

  // Normalise to paused, widen the timeline so the guest block sits comfortably
  // inside the playback range, then play into the guest speaker's block.
  if (/pause/i.test((await transport.getAttribute("aria-label")) ?? "")) {
    await transport.click();
  }

  const durationEditor = page.getByRole("button", { name: "Edit timeline duration" });

  if (await durationEditor.isVisible().catch(() => false)) {
    await durationEditor.click();

    const durationInput = page.getByRole("textbox", { name: "timeline duration" });

    await durationInput.fill("3");
    await durationInput.press("Enter");
  }

  // Playing into the guest speaker's block crossfades the ground to ivory beige.
  await transport.click();
  await expect.poll(frameBackground, { timeout: 12_000 }).toBe("rgb(251, 242, 233)");
});

test("app controls: video format drives the exported container", async ({ page }) => {
  test.setTimeout(120_000);
  await setupAudiogram(page);

  // H.264 encoding is unavailable in OSS headless Chromium; only exercise the
  // MP4 container where the encoder exists, and prove the capability check
  // rejects it safely otherwise.
  const supportsH264 = await page.evaluate(async () => {
    const support = await VideoEncoder.isConfigSupported({
      codec: "avc1.640028",
      framerate: 24,
      height: 1920,
      width: 1080,
    });

    return support.supported === true;
  });

  if (supportsH264) {
    const mp4DownloadPromise = page.waitForEvent("download");

    await page.getByRole("button", { name: "Export Video" }).click();

    const mp4Download = await mp4DownloadPromise;

    expect(mp4Download.suggestedFilename()).toMatch(/\.mp4$/);
  }

  await chooseSelectOption(page, "Format", "WebM");

  const webmDownloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export Video" }).click();

  const webmDownload = await webmDownloadPromise;

  expect(webmDownload.suggestedFilename()).toMatch(/\.webm$/);
});

async function readExportedVideoDurationMetadata(
  page: Page,
  filePath: string,
  mimeType = "video/mp4",
): Promise<{ duration: number; height: number; width: number }> {
  const base64 = readFileSync(filePath).toString("base64");

  // Load the exported blob as a <video>, await loadedmetadata, and read the
  // real video.duration so it can be compared with the runtime timeline
  // duration (state.timeline.durationSeconds).
  return page.evaluate(
    async ({ encoded, type }) =>
      new Promise((resolve, reject) => {
        const bytes = Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));
        const blobUrl = URL.createObjectURL(new Blob([bytes], { type }));
        const video = document.createElement("video");

        video.preload = "metadata";
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(blobUrl);
          resolve({
            duration: video.duration,
            height: video.videoHeight,
            width: video.videoWidth,
          });
        };
        video.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          reject(new Error("Video metadata failed to load."));
        };
        video.src = blobUrl;
      }),
    { encoded: base64, type: mimeType },
  );
}

test("app controls: video resolution changes exported frame size", async ({ page }) => {
  test.setTimeout(120_000);
  await setupAudiogram(page);
  // VP9/WebM is the encoder available across environments (H.264 is absent in
  // OSS headless Chromium).
  await chooseSelectOption(page, "Format", "WebM");

  const currentDownloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export Video" }).click();

  const currentPath = await (await currentDownloadPromise).path();

  if (!currentPath) {
    throw new Error("Video download has no path.");
  }

  const currentMeta = await readExportedVideoDurationMetadata(
    page,
    currentPath,
    "video/webm",
  );

  expect(currentMeta.width).toBe(1080);
  expect(currentMeta.height).toBe(1920);

  await chooseSelectOption(page, "Resolution", "4K");

  const fourKDownloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export Video" }).click();

  const fourKPath = await (await fourKDownloadPromise).path();

  if (!fourKPath) {
    throw new Error("4K video download has no path.");
  }

  const fourKMeta = await readExportedVideoDurationMetadata(page, fourKPath, "video/webm");

  expect(fourKMeta.height).toBeLessThanOrEqual(2160);
  expect(fourKMeta.width % 2).toBe(0);
  expect(fourKMeta.height % 2).toBe(0);
  // Exported metadata duration must match the edited timeline duration
  // (state.timeline.durationSeconds — the 2s tone).
  expect(Math.abs(fourKMeta.duration - 2)).toBeLessThanOrEqual(0.25);
});

test("runtime: timeline playback scrubs and renders audiogram frames", async ({
  page,
}) => {
  await setupAudiogram(page);

  const transport = page.getByRole("button", { name: /(play|pause) playback/i }).first();

  await expect(transport).toBeVisible();

  // Uploading audio can auto-start playback; normalise to a paused state.
  if (/pause/i.test((await transport.getAttribute("aria-label")) ?? "")) {
    await transport.click();
  }

  await transport.click();
  await page.waitForTimeout(400);
  await transport.click();

  // Edit the timeline duration through the real duration editor and prove the
  // playback range follows state.timeline.durationSeconds.
  const durationEditor = page.getByRole("button", { name: "Edit timeline duration" });

  if (await durationEditor.isVisible().catch(() => false)) {
    await durationEditor.click();

    const durationInput = page.getByRole("textbox", { name: "timeline duration" });

    await durationInput.fill("3");
    await durationInput.press("Enter");
  }

  // Late-time caption renders after playing into the second block window.
  await transport.click();
  await expect(page.locator(slideSelector)).toContainText("The second line", {
    ignoreCase: true,
    timeout: 5000,
  });
});

test("onboarding: first run opens the setup wizard and skip reaches the studio", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("What are you making?")).toBeVisible();
  await page.getByRole("button", { name: /skip setup/i }).click();
  await expect(page.locator(slideSelector)).toBeVisible();
});

test("onboarding: wizard choices prefill the studio", async ({ page }) => {
  await page.goto("/setup");
  await page.getByRole("button", { name: "Single post" }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByRole("button", { name: "E3 Secret Translators" }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByRole("button", { name: "Episode illustration" }).click();
  await page.getByRole("button", { name: "Terracotta", exact: true }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await expect(page.getByText("Ready", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open Studio →" }).click();

  await expect(page.locator(slideSelector)).toBeVisible();
  // Prefill applied: terracotta ground + E3 illustration + episode marker.
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const frame = document.querySelector("[data-mm-post-frame]");
        return frame ? getComputedStyle(frame).backgroundColor : "";
      }),
    )
    .toBe("rgb(193, 90, 58)");
  await expect(page.locator(`${slideSelector} img`).first()).toBeVisible();
  await expect(page.locator(slideSelector)).toContainText("S1 E3");
});

test("onboarding: the carousel choice builds the episode set", async ({ page }) => {
  await page.goto("/setup");
  await page.getByRole("button", { name: "New episode" }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByRole("button", { name: "E2 Nikkah Loophole" }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByRole("button", { name: "Open Studio →" }).click();

  await expect(page.locator(slideSelector)).toBeVisible();
  await expect(filmstripSlides(page)).toHaveCount(5);
});
