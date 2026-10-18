import { expect, test } from '@playwright/test';

test('permite buscar el asunto en el formulario de contacto', async ({ page }) => {
  await page.goto('/contacto');

  await page.getByRole('combobox', { name: /asunto/i }).click();
  await page.getByPlaceholder(/buscar asunto/i).fill('Reserva');
  await page.getByRole('option', { name: 'Reserva' }).click();

  await expect(page.getByRole('combobox', { name: /asunto/i })).toContainText('Reserva');
});

test('filtra la carta por categoría con el combobox', async ({ page }) => {
  await page.goto('/carta');

  await page.getByText('Filtrar', { exact: true }).click();
  await page.getByRole('combobox', { name: /categoría/i }).click();
  await page.getByPlaceholder(/buscar categoría/i).fill('Postres');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Aplicar' }).click();

  await expect(page).toHaveURL(/category=postres/);
});

test('permite buscar el tipo de evento', async ({ page }) => {
  await page.goto('/eventos');

  await page.getByRole('combobox', { name: /tipo de evento/i }).click();
  await page.getByPlaceholder(/buscar tipo de evento/i).fill('Boda');
  await page.getByRole('option', { name: 'Boda' }).click();

  await expect(page.getByRole('combobox', { name: /tipo de evento/i })).toContainText('Boda');
});
