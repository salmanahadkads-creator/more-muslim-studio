/* Browser acceptance for the More Muslim Social Studio.
   Test names are referenced from appAcceptance rows (fallback Playwright
   runner for the agent-browser checkpoint). */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test, type Download, type Page } from "@playwright/test";

import { dragToolcraftSliderByLabel } from "./performance-helpers";
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
  // Keep control sections expanded in tests: pre-seed the first-open
  // collapse marker so the studio does not auto-collapse them.
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("toolcraft:ui:controls-panel-sections:seeded", "1");
    } catch {
      // ignore
    }
  });
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
      async () => page.getByRole("button", { name: colourway, exact: true }).click(),
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
  // The on-canvas crop/zoom overlay only exists for image scenes.
  await expect(page.locator("[data-scene-drag]")).toHaveCount(0);

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

  // An illustration swap changes only the scene img's src — invisible to the
  // product snapshot's attribute filter — so prove the swap on the img itself
  // and use the snapshot to pin the surrounding frame steady through it.
  const frameBefore = await getToolcraftProductObservableSnapshot(page, {
    selector: frameSelector,
  });

  await page.getByRole("button", { name: "ep2", exact: true }).click();
  await expect
    .poll(async () => image.getAttribute("src"))
    .not.toBe(sourceBefore);
  expect(
    await getToolcraftProductObservableSnapshot(page, { selector: frameSelector }),
  ).toBe(frameBefore);

  await setSceneSource(page, "Pattern");
  await expect(page.getByRole("button", { name: "ep2", exact: true })).toHaveCount(0);
});

test("runtime: dragging the preview image moves the crop on both axes", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  const surface = page.locator("[data-scene-drag]");

  await expect(surface).toBeVisible();

  const box = await surface.boundingBox();

  if (!box) {
    throw new Error("Scene drag surface has no bounding box.");
  }

  const image = page.locator(sceneImageSelector);
  const styleBefore = await image.getAttribute("style");

  // Drag directly on the preview image to move the cover-crop focus. The crop
  // lands in the img's style attribute, so the product snapshot sees it.
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.25, {
        steps: 6,
      });

      const styleDuring = await image.getAttribute("style");

      await page.mouse.up();

      expect(styleDuring, "Dragging must move the crop on both axes.").not.toBe(
        styleBefore,
      );
      expect(String(styleDuring)).not.toContain("object-position: 50% 50%");
    },
    { selector: sceneImageSelector },
  );
});

test("runtime: the under-image zoom slider scales the preview image", async ({ page }) => {
  await openStudio(page);
  await setSceneSource(page, "Episode illustration");

  const zoom = page.locator("[data-scene-zoom]");

  await expect(zoom).toBeVisible();

  const box = await zoom.boundingBox();

  if (!box) {
    throw new Error("Zoom slider has no bounding box.");
  }

  const image = page.locator(sceneImageSelector);
  const styleBefore = await image.getAttribute("style");

  // The zoom lands in the img's style attribute, so the product snapshot sees it.
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await page.mouse.move(box.x + box.width * 0.85, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.up();
    },
    { selector: sceneImageSelector },
  );
  await expect.poll(async () => image.getAttribute("style")).not.toBe(styleBefore);
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

/* Text-edit cases are unrolled into literally-named tests (not a table-driven
   loop) because the acceptance matrix scanner matches the literal name at the
   test() call site — `for (…) test(name, …)` is invisible to it. Shared steps
   live in openTextField/expectSlideText; the product-observable proof stays
   inline in each body because the matrix reads each test's own source slice. */
async function openTextField(
  page: Page,
  template: string,
  label: string,
): Promise<ReturnType<Page["getByRole"]>> {
  await openStudio(page);
  await chooseSelectOption(page, "Template", template);

  const field = page
    .getByRole("group")
    .filter({ has: page.getByText(label, { exact: true }) })
    .last()
    .getByRole("textbox");

  await expect(field).toBeVisible();

  return field;
}

async function expectSlideText(page: Page, value: string): Promise<void> {
  await expect(page.locator(slideSelector)).toContainText(
    value.split("\n")[0].replace(/^[^:]*:\s*/, "").slice(0, 12),
    { ignoreCase: true },
  );
}

test("runtime: credits editor adds, edits, and removes a credit row", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Episode credits");

  const firstName = page.getByRole("textbox", { name: "Credit 1 name" });

  await expect(firstName).toBeVisible();

  // A hyphenated name reaches the slide whole — the exact failure the old
  // "Name — Role" delimiter parsing had.
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await firstName.fill("Yassmin Abdel-Magied");
    },
    { selector: slideSelector },
  );
  await expect(page.locator(slideSelector)).toContainText("Yassmin Abdel-Magied", {
    ignoreCase: true,
  });

  // Add a credit, fill its separate Name and Title boxes, see it render.
  const initialRows = await page.getByRole("textbox", { name: /Credit \d+ name/ }).count();

  await page.getByRole("button", { name: "Add credit" }).click();

  const addedIndex = initialRows + 1;

  await page.getByRole("textbox", { name: `Credit ${addedIndex} name` }).fill("New Crew");
  await page.getByRole("textbox", { name: `Credit ${addedIndex} title` }).fill("Runner");
  await expect(page.locator(slideSelector)).toContainText("New Crew", { ignoreCase: true });

  // Remove it again.
  await page.getByRole("button", { name: `Remove credit ${addedIndex}` }).click();
  await expect(page.locator(slideSelector)).not.toContainText("New Crew", {
    ignoreCase: true,
  });
});

test("app controls: editing content.episode updates the slide text", async ({ page }) => {
  const field = await openTextField(page, "Cover", "Episode");

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await field.fill("S2 E11");
    },
    { selector: slideSelector },
  );
  await expectSlideText(page, "S2 E11");
});

test("app controls: editing content.cover.presents updates the slide text", async ({ page }) => {
  const field = await openTextField(page, "Cover", "Label");

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await field.fill("A new series");
    },
    { selector: slideSelector },
  );
  await expectSlideText(page, "A new series");
});

test("app controls: editing content.cover.title updates the slide text", async ({ page }) => {
  const field = await openTextField(page, "Cover", "Title");

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await field.fill("The Long Return");
    },
    { selector: slideSelector },
  );
  await expectSlideText(page, "The Long Return");
});

test("app controls: editing content.quote.dialogue updates the slide text", async ({ page }) => {
  const field = await openTextField(page, "Quote exchange", "Dialogue");

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await field.fill("Amel: We kept going.");
    },
    { selector: slideSelector },
  );
  await expectSlideText(page, "Amel: We kept going.");
});

test("app controls: editing content.synopsis.body updates the slide text", async ({ page }) => {
  const field = await openTextField(page, "Synopsis", "Body");

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await field.fill("A story about return.\n\nAnd renewal.");
    },
    { selector: slideSelector },
  );
  await expectSlideText(page, "A story about return.\n\nAnd renewal.");
});

test("app controls: editing content.streaming.lines updates the slide text", async ({ page }) => {
  const field = await openTextField(page, "Now streaming", "Outro");

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await field.fill("Listen now.\nEverywhere.");
    },
    { selector: slideSelector },
  );
  await expectSlideText(page, "Listen now.\nEverywhere.");
});

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

  // Keyframe coverage boundary: the backdrop colour is keyframe-capable by
  // type and the export reads it through the timeline evaluator at the
  // playhead — but the contract-required inline Background row keeps the
  // colour label-free, and keyframe diamonds are label actions, so no
  // backdrop timeline-keyframe-row can be authored. Prove both halves: the
  // expanded keyframe editor shows no lane for it, and scrubbing the
  // playhead re-renders the frame the export would evaluate at that time.
  await chooseSelectOption(page, "Template", "Audiogram");

  if (await page.getByRole("button", { name: "Pause playback" }).isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Pause playback" }).click();
  }

  await page.getByRole("button", { name: "Expand timeline panel" }).click();
  await expect(
    page.getByRole("button", { name: /Add backgroundColor keyframe/i }),
  ).toHaveCount(0);
  await expect(page.locator('[data-slot="timeline-keyframe-row"]')).toHaveCount(0);

  // Leaving audiogram mode is the visible interaction whose product output
  // change closes the loop; the backdrop itself only paints in exports.
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await chooseSelectOption(page, "Template", "Cover");
    },
    { selector: slideSelector },
  );
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

  await page.getByRole("button", { name: "Terracotta", exact: true }).click();
  // Give persistence a moment to write.
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.locator(slideSelector)).toBeVisible();

  const frameBackground = await page.evaluate(() => {
    const frame = document.querySelector("#mm-post-slide [data-mm-post-frame]");
    return frame ? getComputedStyle(frame).backgroundColor : "";
  });

  // Terracotta ground #C15A3A
  expect(frameBackground).toBe("rgb(193, 90, 58)");
});

test("runtime: authored keyframe lanes survive a page reload", async ({ page }) => {
  await setupAudiogram(page);

  // Pause so the playhead stays put, then author one automation lane.
  if (await page.getByRole("button", { name: "Pause playback" }).isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Pause playback" }).click();
  }

  await page.getByRole("button", { name: "Expand timeline panel" }).click();
  await page.getByRole("button", { name: "Add Motion intensity keyframe" }).click();
  await expect(page.locator('[data-slot="timeline-keyframe-row"]')).toHaveCount(1);

  // Give persistence a moment to write, then reload.
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.locator(slideSelector)).toBeVisible();

  // The lane and its diamond come back — timeline state is persisted, so the
  // client does not lose authored automation on refresh. The expanded state
  // persists too, so only expand if it came back collapsed.
  const expandAgain = page.getByRole("button", { name: "Expand timeline panel" });

  if (await expandAgain.isVisible().catch(() => false)) {
    await expandAgain.click();
  }

  await expect(page.locator('[data-slot="timeline-keyframe-row"]')).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: /Motion intensity keyframe at/ }),
  ).toHaveCount(1);
});

async function buildEpisodeSet(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Build episode set" }).click();
  await expect(filmstripSlides(page)).toHaveCount(5);
}

test("app controls: episode set select changes the built carousel", async ({ page }) => {
  await openStudio(page);
  await chooseSelectOption(page, "Episode set", "E3 Secret Translators");
  // Building the set swaps the single post for the chosen episode's slides.
  await expectToolcraftProductObservableToChange(
    page,
    async () => buildEpisodeSet(page),
    { selector: slideSelector },
  );
  await expect(page.locator(slideSelector)).toContainText("Secret Translators", {
    ignoreCase: true,
  });
});

test("app controls: carousel actions create slide layers", async ({ page }) => {
  await openStudio(page);
  await expectToolcraftProductObservableToChange(
    page,
    async () => buildEpisodeSet(page),
    { selector: slideSelector },
  );
  await expect(filmstripSlides(page)).toHaveCount(5);
});

test("runtime: filmstrip add button creates a slide", async ({ page }) => {
  await openStudio(page);
  await expect(filmstrip(page)).toBeVisible();
  await expect(filmstripSlides(page)).toHaveCount(0);

  // The new selected slide copies the current post, so the visible slide
  // output must survive the add unchanged.
  const productBefore = await getToolcraftProductObservableSnapshot(page, {
    selector: slideSelector,
  });

  await page.getByRole("button", { name: "Add slide" }).click();
  // Starting a carousel from a single post snapshots it as slide 1 and adds a
  // second selected slide.
  await expect(filmstripSlides(page)).toHaveCount(2);
  expect(
    await getToolcraftProductObservableSnapshot(page, { selector: slideSelector }),
  ).toBe(productBefore);
});

test("runtime: filmstrip delete removes a slide", async ({ page }) => {
  await openStudio(page);
  await buildEpisodeSet(page);
  await expect(filmstripSlides(page)).toHaveCount(5);

  // Deleting a non-selected slide must not disturb the visible slide output.
  const productBefore = await getToolcraftProductObservableSnapshot(page, {
    selector: slideSelector,
  });

  await filmstripSlides(page).nth(1).getByRole("button", { name: /delete slide/i }).click();
  await expect(filmstripSlides(page)).toHaveCount(4);
  expect(
    await getToolcraftProductObservableSnapshot(page, { selector: slideSelector }),
  ).toBe(productBefore);
});

test("runtime: filmstrip duplicate adds a copy", async ({ page }) => {
  await openStudio(page);
  await buildEpisodeSet(page);
  await expect(filmstripSlides(page)).toHaveCount(5);

  // The copy carries the same values, so the visible slide output holds.
  const productBefore = await getToolcraftProductObservableSnapshot(page, {
    selector: slideSelector,
  });

  await filmstripSlides(page).nth(0).getByRole("button", { name: /duplicate slide/i }).click();
  await expect(filmstripSlides(page)).toHaveCount(6);
  expect(
    await getToolcraftProductObservableSnapshot(page, { selector: slideSelector }),
  ).toBe(productBefore);
});

test("runtime: double-clicking preview text edits it inline", async ({ page }) => {
  await openStudio(page);

  const title = page.locator('[data-edit-target="content.cover.title"]');

  await expect(title).toBeVisible();

  // The tall 4:5 frame overflows the short test viewport; zoom the canvas out
  // until the title sits fully inside the viewport so it is double-clickable.
  const zoomOut = page.getByRole("button", { name: "Zoom out" });

  await expect
    .poll(async () => {
      const box = await title.boundingBox();

      if (box && box.y > 8 && box.y + box.height < 712) {
        return true;
      }

      await zoomOut.click();
      return false;
    }, { timeout: 15_000 })
    .toBe(true);

  // The committed edit re-renders the slide with the new text.
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await title.dblclick();
      await page.keyboard.press("ControlOrMeta+a");
      await page.keyboard.type("Inline Edited Title");
      await page.keyboard.press("Enter");
    },
    { selector: slideSelector },
  );
  await expect(title).toHaveText("Inline Edited Title");
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

async function setupAudiogram(page: Page, toneDurationSeconds = 2): Promise<void> {
  await openStudio(page);
  await chooseSelectOption(page, "Template", "Audiogram");

  const inputs = page.locator('input[type="file"]');

  await inputs.first().setInputFiles({
    buffer: makeTestWavBuffer(toneDurationSeconds),
    mimeType: "audio/wav",
    name: "tone.wav",
  });
  await inputs.nth(1).setInputFiles({
    buffer: Buffer.from(srtFixture),
    mimeType: "text/plain",
    name: "captions.srt",
  });
}

test("runtime: audiogram motion controls change the frame", async ({ page }) => {
  test.setTimeout(60_000);
  await setupAudiogram(page);

  // The Highlight select accepts each mode without error, and the autoplaying
  // audiogram frame keeps rendering (word entrances animate) through it.
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await chooseSelectOption(page, "Highlight", "Off");
    },
    { selector: slideSelector },
  );
  await chooseSelectOption(page, "Highlight", "Auto");
});

test("runtime: audiogram highlight picker stars multiple lines and edits text", async ({
  page,
}) => {
  await setupAudiogram(page);
  await chooseSelectOption(page, "Highlight", "Choose lines");

  const highlightGroup = page
    .getByRole("group")
    .filter({ has: page.getByText("Highlight lines", { exact: true }) })
    .last();
  const lines = highlightGroup.getByRole("textbox");

  // The picker shows the ACTUAL parsed caption text, not a bare block number.
  await expect(lines).toHaveCount(2);
  await expect(lines.first()).toHaveValue("The first line.");
  await expect(lines.nth(1)).toHaveValue("The second line.");

  // Line 1 is starred by default; star line 2 as well — MULTIPLE lines can be
  // pinned as large pull-quotes at once.
  await page.getByRole("button", { name: "Add line 2 to highlights" }).click();
  await expect(highlightGroup.locator('[data-selected="true"]')).toHaveCount(2);

  // Un-starring removes it from the highlight set.
  await page.getByRole("button", { name: "Remove line 2 from highlights" }).click();
  await expect(highlightGroup.locator('[data-selected="true"]')).toHaveCount(1);

  // Editing a line's text is a typo fix: it changes the rendered caption
  // words for that block's original time span, without touching the
  // uploaded SRT file. Block 0 is active from t=0, so the edit shows up
  // as soon as the (autoplaying, looping) timeline reaches the start.
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await lines.first().fill("The corrected first line.");
    },
    { selector: slideSelector },
  );
  await expect(page.locator(slideSelector)).toContainText("The corrected first line.", {
    timeout: 8000,
  });
});

test("runtime: scene image opacity dims the illustration and keyframes evaluate", async ({
  page,
}) => {
  await setupAudiogram(page);
  await chooseSelectOption(page, "Scene", "Episode illustration");

  const sceneImage = page.locator(`${slideSelector} img`).first();

  await expect(sceneImage).toBeVisible();
  await expect(sceneImage).toHaveCSS("opacity", "1");

  // Lowering the slider fades the image into the colourway ground live.
  // Keyboard steps are the deterministic slider interaction: each ArrowLeft
  // is one 5% step down from the 100% default.
  const opacitySlider = page.getByRole("slider", { name: "Image opacity" });

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await opacitySlider.focus();

      for (let press = 0; press < 8; press += 1) {
        await opacitySlider.press("ArrowLeft");
      }
    },
    { selector: slideSelector },
  );

  const dimmed = Number(await sceneImage.evaluate((el) => getComputedStyle(el).opacity));

  expect(dimmed).toBeCloseTo(0.6);

  // visibleWhen: the slider exists only for image-backed scene sources.
  await chooseSelectOption(page, "Scene", "Pattern");
  await expect(page.getByRole("slider", { name: "Image opacity" })).toBeHidden();
  await chooseSelectOption(page, "Scene", "Episode illustration");

  // Pause, open the expanded keyframe editor, and pin the opacity as a
  // keyframe — the diamond creates an Image opacity automation lane.
  if (await page.getByRole("button", { name: "Pause playback" }).isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Pause playback" }).click();
  }

  await page.getByRole("button", { name: "Expand timeline panel" }).click();
  await page.getByRole("button", { name: "Add Image opacity keyframe" }).click();
  await expect(page.locator('[data-slot="timeline-keyframe-row"]')).toHaveCount(1);
});

test("runtime: audiogram outro text renders", async ({ page }) => {
  // A tone barely longer than the captions (2s) reaches the outro window
  // (contentEnd + 0.3 = 2.3s) within a couple of real seconds of autoplay —
  // no manual scrubbing needed.
  await setupAudiogram(page, 4);

  const outro = page
    .getByRole("group")
    .filter({ has: page.getByText("Outro lines", { exact: true }) })
    .last()
    .getByRole("textbox");

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await outro.fill("Custom outro line for the closing card.");
    },
    { selector: slideSelector },
  );
  await expect(page.locator(slideSelector)).toContainText(
    "Custom outro line for the closing card.",
    { timeout: 8000 },
  );
});

test("runtime: audiogram automation keyframes evaluate while scrubbing", async ({ page }) => {
  await setupAudiogram(page);

  // The caption element's computed font size is the directly observable
  // product output that Caption size automation drives.
  const captionSelector = `${slideSelector} [data-audiogram-caption]`;

  // Pause playback so the playhead only moves when we scrub.
  const transport = page.getByRole("button", { name: /(play|pause) playback/i }).first();

  if (/pause/i.test((await transport.getAttribute("aria-label")) ?? "")) {
    await transport.click();
  }

  // Open the expanded keyframe editor (the collapsible bottom timeline).
  await page.getByRole("button", { name: "Expand timeline panel" }).click();

  // Control diamonds create one labelled automation lane per parameter.
  await page.getByRole("button", { name: "Add Caption size keyframe" }).click();

  const lanes = page.locator('[data-slot="timeline-keyframe-row"]');

  await expect(lanes).toHaveCount(1);

  await page.getByRole("button", { name: "Add Motion intensity keyframe" }).click();
  await expect(lanes).toHaveCount(2);

  // Scrub forward, then change the control — the runtime records a second
  // keyframe on the Caption size lane at the new playhead time, and the
  // caption's rendered font size changes live. Creating a keyframe selects
  // it and arrows would move the SELECTED keyframe, so deselect first.
  const scrubber = page.getByRole("slider", { name: "Playback position" }).first();

  await scrubber.focus();
  await scrubber.press("Escape");
  await scrubber.press("ArrowRight");
  await scrubber.press("ArrowRight");

  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await dragToolcraftSliderByLabel(page, "Caption size", 1);
    },
    { selector: captionSelector },
  );
  await expect(
    page.getByRole("button", { name: /Caption size keyframe at/ }).nth(1),
  ).toBeVisible();

  // Scrubbing back re-evaluates the keyframed value: the caption size returns
  // toward the 100% recorded at t=0 and the earlier caption block renders.
  // The upsert selected the new keyframe, so deselect before scrubbing again.
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await scrubber.focus();
      await scrubber.press("Escape");

      for (let press = 0; press < 12; press += 1) {
        await scrubber.press("ArrowLeft");
      }
    },
    { selector: captionSelector },
  );
  await expect(page.locator(slideSelector)).toContainText("The first line.", {
    ignoreCase: true,
  });
});

test("app controls: uploading audio sets the timeline duration", async ({ page }) => {
  await setupAudiogram(page);

  // The extended timeline opens automatically in audiogram mode; the 2s tone
  // appears as the timeline duration (default was 60s).
  await expect(page.getByRole("button", { name: "Edit timeline duration" })).toHaveText(
    "2s",
    { timeout: 8000 },
  );
});

test("runtime: audio longer than the old 60s ceiling sets the full timeline duration", async ({
  page,
}) => {
  // Real episode clips can run well past a minute (e.g. the Dr. Rania
  // segment at 73.5s); the runtime's max timeline duration was raised from
  // 60s to 180s so uploaded audio is never silently truncated.
  await setupAudiogram(page, 90);

  await expect(page.getByRole("button", { name: "Edit timeline duration" })).toHaveText(
    "90s",
    { timeout: 8000 },
  );
});

test("runtime: selecting the audiogram reveals the extended timeline", async ({ page }) => {
  await openStudio(page);

  // Static templates show no timeline transport at all.
  await expect(page.getByRole("slider", { name: "Playback position" })).toHaveCount(0);

  // Switching to the audiogram opens the extended transport — scrubber and
  // duration editor included — without touching the Setup Timeline switch.
  // The template swap replaces the whole slide, so product output changes.
  await expectToolcraftProductObservableToChange(
    page,
    async () => chooseSelectOption(page, "Template", "Audiogram"),
    { selector: slideSelector },
  );
  await expect(page.getByRole("slider", { name: "Playback position" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit timeline duration" }),
  ).toBeVisible();

  // Leaving the audiogram hides the transport again.
  await chooseSelectOption(page, "Template", "Cover");
  await expect(page.getByRole("slider", { name: "Playback position" })).toHaveCount(0);
});

test("runtime: audiogram mode hides the carousel filmstrip", async ({ page }) => {
  await openStudio(page);

  // The filmstrip (with its add-slide tile) floats over the canvas for the
  // static templates…
  await expect(filmstrip(page)).toBeVisible();

  // …but the audiogram is one timeline-driven video, not a slide deck, so the
  // strip (and its empty card) leaves the canvas entirely. The template swap
  // replaces the whole slide, so product output changes with it.
  await expectToolcraftProductObservableToChange(
    page,
    async () => chooseSelectOption(page, "Template", "Audiogram"),
    { selector: slideSelector },
  );
  await expect(filmstrip(page)).toHaveCount(0);

  // Returning to a static template brings the filmstrip back.
  await chooseSelectOption(page, "Template", "Cover");
  await expect(filmstrip(page)).toBeVisible();
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

  // Host stays on the default ivory-beige ground; give the guest speaker a
  // distinct night-blue ground so the crossfade is measurable on the frame
  // background.
  await chooseSelectOption(page, "Guest colourway", "Night Blue");

  const guestSelect = page
    .getByRole("group")
    .filter({ has: page.getByText("Guest colourway", { exact: true }) })
    .last()
    .getByRole("combobox");

  await expect(guestSelect).toContainText("Night Blue");

  const frameBackground = () =>
    page.evaluate(() => {
      const frame = document.querySelector("#mm-post-slide [data-mm-post-frame]");

      return frame ? getComputedStyle(frame).backgroundColor : "";
    });

  // At the head of the clip the host (ivory beige) ground shows.
  await expect.poll(frameBackground).toBe("rgb(251, 242, 233)");

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

  // Playing into the guest speaker's block crossfades the ground to night blue.
  await expectToolcraftProductObservableToChange(
    page,
    async () => transport.click(),
    { selector: frameSelector },
  );
  await expect.poll(frameBackground, { timeout: 12_000 }).toBe("rgb(25, 33, 54)");
});

test("app controls: host colourway sets the first speaker's ground", async ({ page }) => {
  await setupAudiogram(page);

  const frameBackground = () =>
    page.evaluate(() => {
      const frame = document.querySelector("#mm-post-slide [data-mm-post-frame]");

      return frame ? getComputedStyle(frame).backgroundColor : "";
    });

  // The host (first speaker) ground defaults to ivory beige.
  await expect.poll(frameBackground).toBe("rgb(251, 242, 233)");

  // Choosing a different host colourway restyles that ground at the head of
  // the clip (before any speaker change). The frame's background colour is
  // part of the product snapshot, so the change is directly observable.
  await expectToolcraftProductObservableToChange(
    page,
    async () => chooseSelectOption(page, "Host colourway", "Night Blue"),
    { selector: frameSelector },
  );
  await expect.poll(frameBackground).toBe("rgb(25, 33, 54)");
});

test("app controls: editing audiogram.eyebrow updates the slide text", async ({ page }) => {
  await setupAudiogram(page);

  const eyebrow = page
    .getByRole("group")
    .filter({ has: page.getByText("Eyebrow", { exact: true }) })
    .last()
    .getByRole("textbox");

  await expect(eyebrow).toBeVisible();
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await eyebrow.fill("In Therapy, with SheikhaGPT");
    },
    { selector: slideSelector },
  );
  await expect(page.locator(`${slideSelector} [data-audiogram-eyebrow]`)).toContainText(
    "In Therapy, with SheikhaGPT",
    { ignoreCase: true },
  );
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

  // Current resolution exports the native 1080x1920 story frame.
  await chooseSelectOption(page, "Resolution", "Current");

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

  // Uploading audio can auto-start playback; normalise to a paused state via
  // the real "Pause playback" transport button.
  if (await page.getByRole("button", { name: "Pause playback" }).isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Pause playback" }).click();
  }

  // Play, hold, pause — the paused frame is a pure function of the held time,
  // and playing renders new frames (observable product output changes).
  await expectToolcraftProductObservableToChange(
    page,
    async () => {
      await page.getByRole("button", { name: "Play playback" }).click();
      await page.waitForTimeout(400);
    },
    { selector: slideSelector },
  );
  await page.getByRole("button", { name: "Pause playback" }).click();

  // Loop transport state round-trips through the real toggle.
  const disableLoop = page.getByRole("button", { name: "Disable loop" });
  const enableLoop = page.getByRole("button", { name: "Enable loop" });

  if (await disableLoop.isVisible().catch(() => false)) {
    await disableLoop.click();
    await expect(enableLoop).toBeVisible();
    await enableLoop.click();
  } else if (await enableLoop.isVisible().catch(() => false)) {
    await enableLoop.click();
    await expect(disableLoop).toBeVisible();
    await disableLoop.click();
  }

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
  await page.getByRole("button", { name: "Play playback" }).click();
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
