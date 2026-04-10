import { test, expect } from "@playwright/test";

test.describe("Account Management", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem("auth_token", "mock-token");
    });

    // Mock accounts data
    await page.route(
      "**/api/v1/accounts?role=user&page=1&per_page=10",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [
              {
                appwrite_user_id: "user-1",
                name: "John Doe",
                email: "john@example.com",
                status: "active",
                role: "user",
              },
              {
                appwrite_user_id: "user-2",
                name: "Jane Smith",
                email: "jane@example.com",
                status: "inactive",
                role: "user",
              },
            ],
            current_page: 1,
            total_pages: 1,
            total_count: 2,
          }),
        });
      },
    );
  });

  test("should list all accounts", async ({ page }) => {
    await page.goto("/accounts");

    await expect(page.locator("text=Account Directory")).toBeVisible();
    await expect(page.locator("text=John Doe")).toBeVisible();
    await expect(page.locator("text=Jane Smith")).toBeVisible();
  });

  test("should navigate to add account page", async ({ page }) => {
    await page.goto("/accounts");

    // Using a more specific selector for the add button if possible,
    // but assuming it has "New Account" or similar text
    await page.click('button:has-text("New Account")');

    await expect(page).toHaveURL("/accounts/new");
  });

  test("should show error when failing to load accounts", async ({ page }) => {
    // Override route for this specific test
    await page.route(
      "**/api/v1/accounts?role=user&page=1&per_page=10",
      async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal Server Error" }),
        });
      },
    );

    await page.goto("/accounts");

    await expect(page.locator("text=Error").first()).toBeVisible();
    await expect(
      page.locator("text=Internal Server Error").first(),
    ).toBeVisible();
  });
});
