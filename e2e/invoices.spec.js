import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v2/auth/refresh", (route) =>
    route.fulfill({ status: 401, json: { error: "No active session" } }),
  );
  await page.route("**/api/v2/auth/login", (route) =>
    route.fulfill({ json: { accessToken: "test-token" } }),
  );
  await page.route("**/api/v2/user", (route) =>
    route.fulfill({
      json: {
        name: "Test Testsson",
        email: "test@example.com",
        address: "Testgatan 1",
        contract: "Rörligt pris",
      },
    }),
  );
  await page.route("**/api/v2/consumption", (route) =>
    route.fulfill({
      json: { unit: "kWh", months: ["Jan"], values: [100], pricePerKwh: 2 },
    }),
  );
});

test("fakturasidan visar det API:et svarar – även en faktura servern aldrig haft", async ({
  page,
}) => {
  await page.route("**/api/v2/invoices", (route) =>
    route.fulfill({
      json: [
        {
          id: "F-999",
          period: "December 2019",
          amount: 999,
          status: "Obetald",
          due: "2020-01-01",
        },
      ],
    }),
  );

  await page.goto("/login");
  await page.getByPlaceholder("E-postadress").fill("test@example.com");
  await page.getByPlaceholder("Lösenord").fill("test-password");
  await page.getByRole("button", { name: "Logga in" }).click();
  await page.waitForURL("**/");
  await page.getByRole("link", { name: "Fakturor" }).click();
  await page.waitForURL("**/fakturor");

  await expect(page.getByText("F-999")).toBeVisible();
  await expect(page.getByText("December 2019")).toBeVisible();
});

// Security test
test("skyddad endpoint kräver token", async ({ request }) => {
  const response = await request.get("/api/v2/invoices");

  expect(response.status()).toBe(401);
});

test("API-data renderas inte som HTML", async ({ page }) => {
  await page.route("**/api/v2/invoices", (route) =>
    route.fulfill({
      json: [
        {
          id: "<img src=x onerror=alert('XSS')>",
          period: "<script>alert('XSS')</script>",
          amount: 999,
          status: "Obetald",
          due: "2020-01-01",
        },
      ],
    }),
  );

  await page.goto("/login");

  await page.getByPlaceholder("E-postadress").fill("test@example.com");
  await page.getByPlaceholder("Lösenord").fill("test-password");
  await page.getByRole("button", { name: "Logga in" }).click();

  await page.waitForURL("**/");

  await page.getByRole("link", { name: "Fakturor" }).click();
  await page.waitForURL("**/fakturor");

  await expect(
    page.getByText("<img src=x onerror=alert('XSS')>"),
  ).toBeVisible();

  await expect(page.getByText("<script>alert('XSS')</script>")).toBeVisible();
});
