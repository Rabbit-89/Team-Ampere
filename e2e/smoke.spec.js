import { test, expect } from "@playwright/test";

test("kunden kan logga in och ser sin översikt", async ({ page }) => {
  await page.route("**/api/v2/auth/refresh", (route) =>
    route.fulfill({ status: 401, json: { error: "No active session" } }),
  );
  await page.route("**/api/v2/auth/login", (route) =>
    route.fulfill({ json: { accessToken: "test-token" } }),
  );
  await page.route("**/api/v2/user", (route) =>
    route.fulfill({
      json: { name: "Anna Andersson", contract: "Rörligt pris" },
    }),
  );
  await page.route("**/api/v2/consumption", (route) =>
    route.fulfill({
      json: { unit: "kWh", months: ["Jan"], values: [100], pricePerKwh: 2 },
    }),
  );

  await page.goto("/login");
  await page.getByPlaceholder("E-postadress").fill("anna@example.com");
  await page.getByPlaceholder("Lösenord").fill("hemligt");
  await page.getByRole("button", { name: "Logga in" }).click();

  await page.waitForURL("**/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hej Anna!");
});
