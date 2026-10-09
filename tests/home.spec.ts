import { expect, test } from '@playwright/test';

test('muestra la portada pública', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Koffi-Soft/);
  await expect(page.getByRole('heading', { name: /pausa con vista/i })).toBeVisible();
});
