import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("All 3 route() in one test", async ({ page }) => {
  const fakerTitle = faker.lorem.words(5);
  const realUser = {
    email: "psp@gm.com",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDA0OGQxZGI0MTIyYTUwNGYzZDNkNyIsInVzZXJuYW1lIjoicHNwIiwiZXhwIjoxNzcxMDA3MDg3LCJpYXQiOjE3NjU4MjMwODd9.cz-UgaRvSUke2DKlAUhhMowVuyjSVOLs3OwcwAsWKe8",
    username: "psp",
    password: "1234",
    bio: "I'm a mocked user!",
    image: "https://api.realworld.io/images/smiley-cyrus.jpg",
  };

  await page.route("**/api/users/login", async (route, request) => {
    await route.continue({
      headers: { ...request.headers() },
      postData: {
        user: { email: realUser.email, password: realUser.password },
      },
      method: "POST",
    });
  });

  await page.route("**/api/articles", async (route, request) => {
    if (request.method() === "POST") {
      await route.continue({
        headers: { ...request.headers() },
        method: "POST",
        postData: JSON.stringify({
          article: {
            slug: faker.helpers.slugify(fakerTitle).toLowerCase(),
            title: fakerTitle,
            description: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(2),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tagList: ["qa-automation"],
            favorited: false,
            favoritesCount: 0,
            author: {
              username: realUser.username,
              bio: realUser.bio,
              image: realUser.image,
              following: false,
            },
          },
        }),
      });
    }
  });

  await page.route("**/api/user", async (route, request) => {
    const response = await route.fetch();

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      json: await response.json(),
      headers: { ...response.headers() },
    });
  });

  // ROUTE 2: Створення артіклу з faker title

  // КРОК 1: Логін з РАНДОМНИМИ неправильними кредами
  await page.goto("https://demo.learnwebdriverio.com/login");

  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password();

  console.log(`Trying with: ${randomEmail} / ${randomPassword}`);

  await page.locator('input[type="email"]').fill(randomEmail);
  await page.locator('input[type="password"]').fill(randomPassword);
  await page.locator('button:has-text("Sign in")').click();

  await expect(page.locator('a:has-text("New Article")')).toBeVisible();
  console.log(`Logged in as "${realUser.username}" with random credentials!`);

  // КРОК 2: Створення артіклу (title замінюється на faker)
  await page.locator('a:has-text("New Article")').click();

  await page.locator('input[placeholder*="Article Title"]').fill("Original");
  await page.locator('input[placeholder*="about"]').fill("Description");
  await page.locator("textarea").fill("Body text");

  const articlePromise = page.waitForResponse("**/api/articles");
  await page.locator('button:has-text("Publish Article")').click();
  const articleResponse = await articlePromise;

  const articleData = await articleResponse.json();
  expect(articleData.article.title).toBe(fakerTitle);
  console.log(`Article is updated with faker title!`);

  // КРОК 3: Апдейт профайлу (завжди 200 НАВІТЬ з невалідними даними)
  await page.locator('a:has-text("Settings")').click();

  // Генеруємо НЕВАЛІДНИЙ email (без @)
  const invalidEmail = faker.internet.username() + "_invalid_email";
  const invalidUrl = "this-is-not-a-url";

  await page
    .locator('input[placeholder="URL of profile picture"]')
    .fill(invalidUrl);
  await page
    .locator('textarea[placeholder="Short bio about you"]')
    .fill("<script>alert('xss')</script>");
  await page.locator('input[placeholder="Email"]').fill(invalidEmail);

  const profilePromise = page.waitForResponse("**/api/user");
  await page.locator('button:has-text("Update Settings")').click();
  const profileResponse = await profilePromise;

  expect(profileResponse.status()).toBe(200);
  console.log(`User profile is updated`);
});

test("10s", async ({ page }) => {
  await page.waitForTimeout(10_000);
});

test("30s", async ({ page }) => {
  await page.waitForTimeout(30_000);
});

test("40s", async ({ page }) => {
  await page.waitForTimeout(40_000);
});

test("120s", async ({ page }) => {
  await page.waitForTimeout(120_000);
});

test("1s", async ({ page }) => {
  await page.waitForTimeout(1_000);
});
