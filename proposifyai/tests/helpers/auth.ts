import { Page } from '@playwright/test';

export async function login(page: Page, email: string = 'test@example.com', password: string = 'testpassword123') {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  try {
    await page.waitForURL('/dashboard', { timeout: 10000 });
  } catch (error) {
    // If login fails, we might be on error page or still on login
    console.log('Login navigation timeout - user might not exist or credentials invalid');
  }
}

export async function logout(page: Page) {
  // Look for logout button
  const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign out")');

  if (await logoutButton.count() > 0) {
    await logoutButton.first().click();
    await page.waitForURL('/login', { timeout: 5000 }).catch(() => {});
  }
}

export function getTestCredentials() {
  return {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'testpassword123',
  };
}
