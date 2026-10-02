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
  await page.route("**/api/v2/invoices", (route) =>
    route.fulfill({ json: [] }),
  );
});

test("navigation between different pages work", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("E-postadress").fill("test@example.com");
  await page.getByPlaceholder("Lösenord").fill("test-password");
  await page.getByRole("button", { name: "Logga in" }).click();
  await page.waitForURL("**/");

  //Översikt(Dashboard)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hej Test!");

  //Fakturor(Invoices)
  await page.getByRole("link", { name: "Fakturor" }).click();
  await page.waitForURL("**/fakturor");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fakturor");

  //Flyttanmälan(MoveForm)
  await page.getByRole("link", { name: "Flyttanmälan" }).click();
  await page.waitForURL("**/flytt");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Flyttanmälan",
  );

  //Mina uppgifter(Profile)
  await page.getByRole("link", { name: "Mina uppgifter" }).click();
  await page.waitForURL("**/profil");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Mina uppgifter",
  );

  //Tillbaks till Översikt(Dashboard)
  await page.getByRole("link", { name: "Översikt" }).click();
  await page.waitForURL("**/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hej Test!");
});
