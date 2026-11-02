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
