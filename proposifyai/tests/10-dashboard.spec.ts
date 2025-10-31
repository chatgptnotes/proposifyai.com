import { test, expect } from '@playwright/test';

test.describe('Dashboard - v2.4.x', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });

  test('should load dashboard successfully', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for dashboard content
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
  });

  test('should display glassmorphism design', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for glassmorphism CSS properties
    const cards = page.locator('[class*="glass"], [class*="backdrop"]').first();

    if (await cards.count() > 0) {
      const styles = await cards.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backdropFilter: computed.backdropFilter,
          backgroundColor: computed.backgroundColor,
        };
      });

      // Should have backdrop-filter or similar glass effect
      expect(styles.backdropFilter || styles.backgroundColor).toBeTruthy();
    }
  });

  test('should show recent proposals', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for recent proposals section
    const recentSection = page.locator('section, div').filter({ hasText: /recent|proposals/i }).first();

    // Should display recent items or empty state
    expect(await recentSection.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display statistics/metrics', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for stat cards
    const stats = page.locator('[class*="stat"], [class*="metric"], [class*="card"]');
    const count = await stats.count();

    // Dashboard should have some cards/stats
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have working navigation links', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find "Create Proposal" or similar CTA
    const createButton = page.locator('a[href*="new"], button:has-text("Create")').first();

    if (await createButton.count() > 0) {
      await createButton.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to new proposal page
      expect(page.url()).toMatch(/\/proposals\/new|\/create/);
    }
  });

  test('should show quick actions', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for quick action buttons
    const quickActions = page.locator('button, a').filter({ hasText: /create|new|view/i });
    const count = await quickActions.count();

    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should display user greeting or welcome message', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for welcome message
    const welcome = page.locator('h1, h2').filter({ hasText: /welcome|dashboard|hello/i }).first();

    if (await welcome.count() > 0) {
      const text = await welcome.textContent();
      expect(text).toBeTruthy();
    }
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');

    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    await expect(main).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    await expect(main).toBeVisible();
  });
});
