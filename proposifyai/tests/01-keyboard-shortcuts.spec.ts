import { test, expect } from '@playwright/test';

test.describe('Keyboard Shortcuts Modal - v2.5.0', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Login with test credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });

  test('should open modal when pressing ?', async ({ page }) => {
    // Press ? key
    await page.keyboard.press('Shift+?');

    // Check if modal is visible
    const modal = page.locator('[role="dialog"]').filter({ hasText: 'Keyboard Shortcuts' });
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('should close modal when pressing Escape', async ({ page }) => {
    // Open modal
    await page.keyboard.press('Shift+?');

    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"]').filter({ hasText: 'Keyboard Shortcuts' });
    await expect(modal).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Check if modal is hidden
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  test('should display all shortcuts correctly', async ({ page }) => {
    // Open modal
    await page.keyboard.press('Shift+?');

    const modal = page.locator('[role="dialog"]').filter({ hasText: 'Keyboard Shortcuts' });
    await expect(modal).toBeVisible();

    // Check for common shortcuts
    const shortcuts = [
      { key: '?', description: 'Show keyboard shortcuts' },
      { key: 'Ctrl+S', description: 'Save proposal' },
      { key: 'Ctrl+P', description: 'Preview PDF' },
      { key: 'Esc', description: 'Close modal' },
    ];

    for (const shortcut of shortcuts) {
      const shortcutElement = modal.locator(`text=${shortcut.key}`);
      await expect(shortcutElement).toBeVisible();
    }
  });

  test('should not trigger in input fields', async ({ page }) => {
    // Navigate to proposals page with search
    await page.goto('/proposals');

    // Click on search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await searchInput.first().click();

      // Type ?
      await page.keyboard.press('Shift+?');

      // Modal should not open
      const modal = page.locator('[role="dialog"]').filter({ hasText: 'Keyboard Shortcuts' });
      await expect(modal).not.toBeVisible({ timeout: 2000 });

      // The ? should appear in the input
      await expect(searchInput.first()).toHaveValue('?');
    }
  });

  test('should close modal when clicking outside', async ({ page }) => {
    // Open modal
    await page.keyboard.press('Shift+?');

    const modal = page.locator('[role="dialog"]').filter({ hasText: 'Keyboard Shortcuts' });
    await expect(modal).toBeVisible();

    // Click outside modal (on backdrop)
    await page.click('body', { position: { x: 10, y: 10 } });

    // Modal should close
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });
});
