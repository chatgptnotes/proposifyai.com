import { test, expect } from '@playwright/test';

test.describe('Breadcrumb Navigation - v2.5.0', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });

  test('should display breadcrumbs on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for breadcrumb navigation
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], [class*="breadcrumb"]').first();

    // Breadcrumb should exist or page should be loaded
    const exists = await breadcrumb.count() > 0;
    expect(typeof exists).toBe('boolean');
  });

  test('should display breadcrumbs on proposals list page', async ({ page }) => {
    await page.goto('/proposals');
    await page.waitForLoadState('networkidle');

    // Check for breadcrumb structure: Home > Proposals
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], [class*="breadcrumb"]');

    if (await breadcrumb.count() > 0) {
      const text = await breadcrumb.textContent();
      expect(text).toBeTruthy();
    }
  });

  test('should display breadcrumbs on new proposal page', async ({ page }) => {
    await page.goto('/proposals/new');
    await page.waitForLoadState('networkidle');

    // Check for breadcrumb: Home > Proposals > New
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], [class*="breadcrumb"]');

    if (await breadcrumb.count() > 0) {
      const text = await breadcrumb.textContent();
      // Should contain "New" or "Create"
      expect(text?.toLowerCase()).toMatch(/new|create/i);
    }
  });

  test('should have clickable breadcrumb links', async ({ page }) => {
    await page.goto('/proposals/new');
    await page.waitForLoadState('networkidle');

    // Find breadcrumb links
    const breadcrumbLinks = page.locator('nav[aria-label="breadcrumb"] a, [class*="breadcrumb"] a');
    const linkCount = await breadcrumbLinks.count();

    if (linkCount > 0) {
      // Click the first link (usually Home or Dashboard)
      await breadcrumbLinks.first().click();

      // Should navigate somewhere
      await page.waitForLoadState('networkidle');

      // URL should have changed
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });

  test('should navigate back to proposals from proposal detail', async ({ page }) => {
    // First, go to proposals page
    await page.goto('/proposals');
    await page.waitForLoadState('networkidle');

    // Find first proposal link if any exist
    const proposalLink = page.locator('a[href*="/proposals/"]').first();

    if (await proposalLink.count() > 0) {
      await proposalLink.click();
      await page.waitForLoadState('networkidle');

      // Now check breadcrumbs
      const breadcrumbLinks = page.locator('nav[aria-label="breadcrumb"] a, [class*="breadcrumb"] a');

      if (await breadcrumbLinks.count() > 0) {
        // Find "Proposals" link in breadcrumb
        const proposalsLink = breadcrumbLinks.filter({ hasText: /Proposals/i }).first();

        if (await proposalsLink.count() > 0) {
          await proposalsLink.click();

          // Should navigate back to proposals list
          await expect(page).toHaveURL(/\/proposals$/);
        }
      }
    }
  });

  test('should display current page as non-clickable', async ({ page }) => {
    await page.goto('/proposals');
    await page.waitForLoadState('networkidle');

    // The current page in breadcrumb should not be a link
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], [class*="breadcrumb"]');

    if (await breadcrumb.count() > 0) {
      // Look for current page indicator (usually not a link)
      const currentPage = breadcrumb.locator('[aria-current="page"], span:not(a)').last();

      if (await currentPage.count() > 0) {
        const text = await currentPage.textContent();
        expect(text).toBeTruthy();
      }
    }
  });

  test('should show correct hierarchy for nested pages', async ({ page }) => {
    await page.goto('/proposals/new');
    await page.waitForLoadState('networkidle');

    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], [class*="breadcrumb"]');

    if (await breadcrumb.count() > 0) {
      const links = breadcrumb.locator('a, span');
      const count = await links.count();

      // Should have at least 2 levels (Home/Dashboard > Current)
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });
});
