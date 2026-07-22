import { expect, test, type Page } from "@playwright/test";

/* Fresh contexts are redirected to the onboarding wizard; enter through it
   deterministically and skip into the studio (same entry app-product.spec.ts
   uses), then run the neutral-shell assertions against the runtime app. */
async function openApp(page: Page): Promise<void> {
  await page.goto("/setup");
  await page.getByRole("button", { name: /skip setup/i }).click();
  await expect(page.locator('[data-slot="toolcraft-runtime-app"]')).toBeVisible();
}

test("browser: starter opens as a neutral Toolcraft shell", async ({ page }) => {
  await openApp(page);

  await expect(page.locator('[data-slot="toolcraft-runtime-app"]')).toBeVisible();
  await expect(page.getByRole("application", { name: "Canvas viewport" })).toBeVisible();

  await expect(page.getByText("Toolcraft App Template Controls")).toHaveCount(0);
  await expect(page.getByText("Generation")).toHaveCount(0);
  await expect(page.getByText("Prompt")).toHaveCount(0);
  await expect(page.getByText("Dur:")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Play playback|Pause playback/ })).toHaveCount(0);
});

test("browser: starter canvas ignores drops — uploads go through product controls", async ({
  page,
}) => {
  await openApp(page);

  const upload = await page.evaluateHandle(() => {
    const dataTransfer = new DataTransfer();
    const file = new File(
      [
        '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="96"><rect width="128" height="96" fill="#888"/></svg>',
      ],
      "starter-fixture.svg",
      { type: "image/svg+xml" },
    );

    dataTransfer.items.add(file);
    return dataTransfer;
  });

  await page
    .getByRole("application", { name: "Canvas viewport" })
    .dispatchEvent("drop", { dataTransfer: upload });

  // This app disables canvas media drops on purpose (appSchema canvas
  // upload: false) — media enters through the explicit Scene and Sound &
  // Captions upload controls instead. The drop must import nothing: no
  // floating canvas image, no new slide ground, and the shell stays healthy.
  await page.waitForTimeout(500);
  await expect(page.locator('img[alt="starter-fixture.svg"]')).toHaveCount(0);
  await expect(page.locator("#mm-post-slide [data-mm-post-frame] > img")).toHaveCount(0);
  await expect(page.getByRole("application", { name: "Canvas viewport" })).toBeVisible();
  await expect(page.getByText("Prompt")).toHaveCount(0);
});
