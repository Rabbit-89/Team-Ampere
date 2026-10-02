import { test, expect } from "@playwright/test";

test("användaren kan logga in", async ({ page }) => {
  await page.route("**/api/v2/auth/refresh", (route) =>
    route.fulfill({ status: 401, json: { error: "No active session" } }),
  );
  await page.route("**/api/v2/auth/login", (route) => {
    expect(route.request().postDataJSON()).toEqual({
      email: "test@test.se",
      password: "test123",
    });
    return route.fulfill({ json: { accessToken: "test-token" } });
  });

  await page.goto("http://localhost:5173/login");

  await page.getByPlaceholder("E-postadress").fill("test@test.se");
  await page.getByPlaceholder("Lösenord").fill("test123");

  await page.getByRole("button", { name: "Logga in" }).click();

  await expect(page).toHaveURL("http://localhost:5173/");
  await expect(page.getByText("Mina uppgifter")).toBeVisible();
});
