import { expect, test } from '@playwright/test';

test('muestra la portada pública', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Koffi-Soft/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('muestra el apartado público de avisos importantes', async ({ page }) => {
  await page.goto('/avisos');

  await expect(page).toHaveTitle(/Avisos importantes/);
  await expect(page.getByRole('heading', { name: 'Avisos importantes' })).toBeVisible();
});
