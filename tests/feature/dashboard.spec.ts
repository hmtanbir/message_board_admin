import { test, expect } from '@playwright/test';

test.describe('Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication by setting localStorage
    await page.addInitScript(() => {
      window.localStorage.setItem('auth_token', 'mock-token');
    });

    // Mock dashboard data
    await page.route('**/api/v1/admin/dashboard', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            total_accounts: 150,
            active_users: 120,
            basic_users: 50,
            standard_users: 40,
            premium_users: 30,
            inactive_users: 30,
            live_projects: 45
          }
        })
      });
    });
  });

  test('should display analytics cards with correct data', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Total Accounts')).toBeVisible();
    await expect(page.locator('text=150')).toBeVisible();

    await expect(page.locator('text=Active Users')).toBeVisible();
    await expect(page.locator('text=120')).toBeVisible();
    await expect(page.locator('text=80% engagement rate')).toBeVisible(); // (120/150)*100

    await expect(page.locator('text=Live Projects')).toBeVisible();
    await expect(page.locator('text=45')).toBeVisible();
  });

  test('should display subscription and status charts', async ({ page }) => {
    await page.goto('/');

    // Check if charts are rendered (Recharts uses SVG)
    await expect(page.locator('text=Subscription Tiers')).toBeVisible();
    await expect(page.locator('text=Account Status')).toBeVisible();

    // Simple check for SVG elements within charts
    const charts = page.locator('.recharts-responsive-container');
    await expect(charts).toHaveCount(2);
  });
});
