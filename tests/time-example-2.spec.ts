import { test, expect } from "@playwright/test";

test.describe("test second", () => {
  // test("60s - 2", async ({ page }) => {
  //   await page.waitForTimeout(20_000);
  //   await page.locator("#click").click({ timeout: 1000 });
  // });
});

test("10s - 2", async ({ page }) => {
  console.log(process.env.PASSWORD);
  console.log(process.env.CLIENT_SECRET);

  await page.waitForTimeout(10_000);
});

test("30s - 2", async ({ page }) => {
  console.log(process.env.PASSWORD);
  console.log(process.env.CLIENT_SECRET);

  // await page.waitForTimeout(30_000);
});

test("40s - 2", async ({ page }) => {
  console.log(process.env.PASSWORD);
  console.log(process.env.CLIENT_SECRET);

  // await page.waitForTimeout(40_000);
});

// test("120s - 2", async ({ page }) => {
//   await page.waitForTimeout(120_000);
// });

// test("1s - 2", async ({ page }) => {
//   await page.waitForTimeout(1_000);
// });
