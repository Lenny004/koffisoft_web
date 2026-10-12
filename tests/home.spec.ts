import { expect, test } from '@playwright/test';

test('muestra la portada pública', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Koffi-Soft/);
  await expect(page.getByRole('heading', { name: /^menú$/i })).toBeVisible();
});

test('muestra el apartado público de avisos importantes', async ({ page }) => {
  await page.goto('/avisos');

  await expect(page).toHaveTitle(/Aviso importante/);
  await expect(page.getByRole('heading', { name: 'Aviso importante' })).toBeVisible();
});
