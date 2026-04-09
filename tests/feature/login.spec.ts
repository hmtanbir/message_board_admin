import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should log in successfully and redirect to dashboard', async ({ page }) => {
    // Mock successful login API
    await page.route('**/api/v1/sessions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: 'mock-auth-token',
          message: 'Welcome to MessageAdmin. Redirecting...'
        })
      });
    });

    // Mock dashboard data fetch after redirect
    await page.route('**/api/v1/dashboard', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            total_accounts: 10,
            active_users: 5,
            basic_users: 3,
            standard_users: 1,
            premium_users: 1,
            inactive_users: 5,
            live_projects: 2
          }
        })
      });
    });

    await page.goto('/login');

    // Fill login form
    await page.fill('input[id="email"]', 'admin@example.com');
    await page.fill('input[id="password"]', 'password123');
    
    // Click login button
    await page.click('button:has-text("Authorize Entry")');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/');
    
    // Verify dashboard content
    await expect(page.locator('h2')).toContainText('Dashboard');
    await expect(page.locator('text=Total Accounts')).toBeVisible();
    await expect(page.locator('text=10')).toBeVisible();
  });

  test('should show error on login failure', async ({ page }) => {
    // Mock failed login API
    await page.route('**/api/v1/sessions', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Authorization failed: invalid username/password'
        })
      });
    });

    await page.goto('/login');

    await page.fill('input[id="email"]', 'wrong@example.com');
    await page.fill('input[id="password"]', 'wrongpassword');
    await page.click('button:has-text("Authorize Entry")');

    // Verify error toast
    await expect(page.locator('text=Authentication Failed').first()).toBeVisible();
    await expect(page.locator('text=Authorization failed: invalid username/password').first()).toBeVisible();
  });
});
