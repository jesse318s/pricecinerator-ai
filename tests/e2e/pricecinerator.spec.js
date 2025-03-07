import { test, expect } from "@playwright/test";

test.describe("Pricecinerator AI", () => {
  test("app navigates from the landing page to main app", async ({ page }) => {
    await page.goto("/");
    await page.click('button:has-text("Continue")');
    await expect(
      page.locator('button:has-text("Predict Price")')
    ).toBeVisible();
  });

  test("app navigates from the main app to the landing page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Help")');
    await expect(page.locator('button:has-text("Continue")')).toBeVisible();
  });

  test("predict price button predicts price when clicked", async ({ page }) => {
    await page.goto("/");
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Predict Price")');
    await expect(page.locator('h3:has-text("Price:")')).toBeVisible({
      timeout: 5000,
    });

    const priceText = await page.locator('h3:has-text("Price:")').textContent();

    expect(priceText).not.toContain("?");
    expect(priceText).toContain("$");
  });

  test("predict price button predicts price when clicked in training mode", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/");
    await page.click('button:has-text("Continue")');

    const trainingModeCheckbox = page.locator(
      'input[type="radio"]#training-mode'
    );

    await trainingModeCheckbox.check();
    await page.click('button:has-text("Predict Price")');
    await expect(page.locator('h3:has-text("Price:")')).toBeVisible({
      timeout: 60000,
    });

    const priceText = await page.locator('h3:has-text("Price:")').textContent();

    expect(priceText).not.toContain("?");
    expect(priceText).toContain("$");
  });
});
