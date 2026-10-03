import { expect, test } from '@playwright/test';

test('muestra la página inicial placeholder', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Koffi-Soft/);
  await expect(page.getByRole('heading', { name: /base digital/i })).toBeVisible();
});
