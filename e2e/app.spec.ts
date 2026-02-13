import { test, expect } from '@playwright/test';

test('app loads and shows Today page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('h1')).toHaveText('Today');
});

test('bottom nav has all tabs', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const nav = page.locator('nav');
  await expect(nav.getByText('Today')).toBeVisible();
  await expect(nav.getByText('Reports')).toBeVisible();
  await expect(nav.getByText('Reflect')).toBeVisible();
  await expect(nav.getByText('Settings')).toBeVisible();
});

test('can navigate between tabs', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.getByText('Reports').click();
  await expect(page.locator('h1')).toHaveText('Reports');

  await page.getByText('Reflect').click();
  await expect(page.locator('h1')).toHaveText('Reflect');

  await page.getByText('Settings').click();
  await expect(page.locator('h1')).toHaveText('Settings');

  await page.getByText('Today').click();
  await expect(page.locator('h1')).toHaveText('Today');
});

test('settings page shows sign out button', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await expect(page.getByText('Sign out')).toBeVisible();
});
