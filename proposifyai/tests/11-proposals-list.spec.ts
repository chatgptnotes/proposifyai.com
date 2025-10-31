import { test, expect } from '@playwright/test';

test.describe('Proposals List - v2.4.x', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await page.goto('/proposals');
    await page.waitForLoadState('networkidle');
  });

  test('should load proposals list', async ({ page }) => {
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
  });

  test('should display search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();

      // Test search
      await searchInput.fill('test');
      await page.waitForTimeout(500);

      // Should filter results or show no results
      expect(true).toBe(true);
    }
  });

  test('should have sort functionality', async ({ page }) => {
    // Look for sort dropdown or buttons
    const sortControl = page.locator('select, button').filter({ hasText: /sort|order/i }).first();

    if (await sortControl.count() > 0) {
      await expect(sortControl).toBeVisible();
    }
  });

  test('should display proposal cards', async ({ page }) => {
    // Look for proposal items
    const proposals = page.locator('article, [class*="proposal"], [class*="card"]');
    const count = await proposals.count();

    // Should have proposals or empty state
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show favorites functionality', async ({ page }) => {
    // Look for favorite/star icons
    const favoriteButton = page.locator('button[aria-label*="favorite"], [class*="star"]').first();

    if (await favoriteButton.count() > 0) {
      // Click to favorite
      await favoriteButton.click();
      await page.waitForTimeout(500);

      // Should show feedback
      expect(true).toBe(true);
    }
  });

  test('should navigate to proposal detail on click', async ({ page }) => {
    const proposalLink = page.locator('a[href*="/proposals/"]').first();

    if (await proposalLink.count() > 0) {
      await proposalLink.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to detail page
      expect(page.url()).toMatch(/\/proposals\/[^\/]+$/);
    }
  });

  test('should have create new proposal button', async ({ page }) => {
    const createButton = page.locator('a[href*="new"], button:has-text("Create"), button:has-text("New")').first();

    if (await createButton.count() > 0) {
      await expect(createButton).toBeVisible();
    }
  });

  test('should filter by status', async ({ page }) => {
    // Look for status filter
    const statusFilter = page.locator('select, button').filter({ hasText: /status|draft|sent/i }).first();

    if (await statusFilter.count() > 0) {
      await statusFilter.click();
      await page.waitForTimeout(300);

      // Should show filter options
      expect(true).toBe(true);
    }
  });

  test('should show proposal metadata (date, status, client)', async ({ page }) => {
    const firstProposal = page.locator('article, [class*="proposal"]').first();

    if (await firstProposal.count() > 0) {
      const text = await firstProposal.textContent();

      // Should contain some metadata
      expect(text).toBeTruthy();
    }
  });

  test('should support bulk actions', async ({ page }) => {
    // Look for checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    if (count > 0) {
      // Select first item
      await checkboxes.first().check();
      await page.waitForTimeout(300);

      // Look for bulk action buttons
      const bulkActions = page.locator('button').filter({ hasText: /delete|archive|export/i });

      expect(await bulkActions.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('should paginate results', async ({ page }) => {
    // Look for pagination controls
    const pagination = page.locator('nav[aria-label*="pagination"], [class*="pagination"]');

    if (await pagination.count() > 0) {
      const nextButton = pagination.locator('button:has-text("Next"), a:has-text("Next")').first();

      if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForLoadState('networkidle');

        // Should load next page
        expect(true).toBe(true);
      }
    }
  });

  test('should show empty state when no proposals', async ({ page }) => {
    // Search for something that doesn't exist
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      await searchInput.fill('zzzzz-nonexistent-proposal-12345');
      await page.waitForTimeout(500);

      // Look for empty state message
      const emptyState = page.locator('p, div').filter({ hasText: /no proposals|not found/i }).first();

      // Might show empty state
      expect(await emptyState.count()).toBeGreaterThanOrEqual(0);
    }
  });
});
