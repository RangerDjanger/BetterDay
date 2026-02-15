import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Wait for auth to resolve and app shell to appear
  await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
});

test('app loads and shows Today page', async ({ page }) => {
  await expect(page.locator('h1').first()).toHaveText('Today');
});

test('bottom nav has all tabs', async ({ page }) => {
  const nav = page.locator('nav');
  await expect(nav.getByText('Today')).toBeVisible();
  await expect(nav.getByText('Reports')).toBeVisible();
  await expect(nav.getByText('Settings')).toBeVisible();
});

test('can navigate between tabs', async ({ page }) => {
  await page.locator('nav').getByText('Reports').click();
  await expect(page.locator('h1')).toHaveText('Reports');

  await page.locator('nav').getByText('Settings').click();
  await expect(page.locator('h1')).toHaveText('Settings');

  await page.locator('nav').getByText('Today').click();
  await expect(page.locator('h1')).toHaveText('Today');
});

test('settings page shows sign out button', async ({ page }) => {
  await page.locator('nav').getByText('Settings').click();
  await expect(page.getByText('Sign out')).toBeVisible();
});
