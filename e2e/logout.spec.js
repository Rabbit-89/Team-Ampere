import { test, expect } from "@playwright/test";

test("logout revokes the browser session and its access token", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-postadress").fill("demo@example.com");
  await page.getByLabel("Lösenord").fill("demo-password");
  const loginResponse = page.waitForResponse((response) =>
    response.url().endsWith("/api/v2/auth/login"),
  );
  await page.getByRole("button", { name: "Logga in" }).click();
  const { accessToken } = await (await loginResponse).json();
  await page.waitForURL("**/");

  await page.getByRole("button", { name: "Logga ut" }).click();
  await expect(page).toHaveURL(/\/login$/);

  const statuses = await page.evaluate(async (token) => {
    const refresh = await fetch("/api/v2/auth/refresh", { method: "POST" });
    const invoices = await fetch("/api/v2/invoices", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { refresh: refresh.status, invoices: invoices.status };
  }, accessToken);

  expect(statuses).toEqual({ refresh: 401, invoices: 401 });
});

test("401 from logout counts as success", async ({ page }) => {
  await page.route("**/api/v2/auth/refresh", (route) =>
    route.fulfill({ status: 401, json: { error: "No active session" } }),
  );
  await page.route("**/api/v2/auth/login", (route) =>
    route.fulfill({ json: { accessToken: "test-access-token" } }),
  );
  await page.route("**/api/v2/auth/logout", (route) =>
    route.fulfill({ status: 401, json: { error: "Session already expired" } }),
  );
  await page.route("**/api/v2/user", (route) =>
    route.fulfill({
      json: {
        name: "Test User",
        email: "test@example.com",
        address: "Test Street 1",
        contract: "Fixed",
      },
    }),
  );
  await page.route("**/api/v2/consumption", (route) =>
    route.fulfill({
      json: { unit: "kWh", months: ["Jan"], values: [100], pricePerKwh: 2 },
    }),
  );

  await page.goto("/login");
  await page.getByLabel("E-postadress").fill("test@example.com");
  await page.getByLabel("Lösenord").fill("test-password");
  await page.getByRole("button", { name: "Logga in" }).click();
  await page.waitForURL("**/");

  await page.getByRole("button", { name: "Logga ut" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("alert")).toHaveCount(0);

  await page.goto("/fakturor");
  await expect(page).toHaveURL(/\/login$/);
});

test("network failure still logs the browser out and clears the error after next login", async ({
  page,
}) => {
  await page.route("**/api/v2/auth/refresh", (route) =>
    route.fulfill({ status: 401, json: { error: "No active session" } }),
  );
  await page.route("**/api/v2/auth/login", (route) =>
    route.fulfill({ json: { accessToken: "test-access-token" } }),
  );
  await page.route("**/api/v2/auth/logout", (route) => route.abort());
  await page.route("**/api/v2/user", (route) =>
    route.fulfill({
      json: {
        name: "Test User",
        email: "test@example.com",
        address: "Test Street 1",
        contract: "Fixed",
      },
    }),
  );
  await page.route("**/api/v2/consumption", (route) =>
    route.fulfill({
      json: { unit: "kWh", months: ["Jan"], values: [100], pricePerKwh: 2 },
    }),
  );

  await page.goto("/login");
  await page.getByLabel("E-postadress").fill("test@example.com");
  await page.getByLabel("Lösenord").fill("test-password");
  await page.getByRole("button", { name: "Logga in" }).click();
  await page.waitForURL("**/");

  await page.getByRole("button", { name: "Logga ut" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("alert")).toContainText(
    "servern kunde inte bekräfta",
  );

  await page.getByLabel("E-postadress").fill("test@example.com");
  await page.getByLabel("Lösenord").fill("test-password");
  await page.getByRole("button", { name: "Logga in" }).click();
  await page.waitForURL("**/");
  await expect(page.getByRole("alert")).toHaveCount(0);
});
