import { test, expect } from '@playwright/test';

test.describe('Project Inventory', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('auth_token', 'mock-token');
    });

    // Mock projects data
    await page.route('**/api/v1/projects?page=1&per_page=10', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { 
              appwrite_project_id: 'proj-123', 
              name: 'Alpha Mission', 
              package_name: 'com.alpha.mission',
              user_name: 'John Doe',
              user_email: 'john@example.com',
              status: 'active',
              android: true,
              apple: false,
              created_at: new Date().toISOString()
            },
            { 
              appwrite_project_id: 'proj-456', 
              name: 'Beta Protocol', 
              package_name: 'com.beta.protocol',
              user_name: 'Jane Smith',
              user_email: 'jane@example.com',
              status: 'inactive',
              android: true,
              apple: true,
              created_at: new Date().toISOString()
            }
          ],
          current_page: 1,
          total_pages: 1,
          total_count: 2
        })
      });
    });
  });

  test('should list all projects', async ({ page }) => {
    await page.goto('/projects');

    await expect(page.locator('text=Project Inventory').first()).toBeVisible();
    await expect(page.locator('text=Alpha Mission').first()).toBeVisible();
    await expect(page.locator('text=Beta Protocol').first()).toBeVisible();
    await expect(page.locator('text=proj-123').first()).toBeVisible();
  });

  test('should navigate to add project page', async ({ page }) => {
    await page.goto('/projects');
    
    // Assuming the button has "New Project" text
    await page.click('button:has-text("New Project")');
    
    await expect(page).toHaveURL('/projects/new');
  });

  test('should show error when failing to load projects', async ({ page }) => {
    // Override route for this specific test to simulate failure
    await page.route('**/api/v1/projects?page=1&per_page=10', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/projects');
    
    await expect(page.locator('text=Error').first()).toBeVisible();
    await expect(page.locator('text=Internal Server Error').first()).toBeVisible();
  });
});
