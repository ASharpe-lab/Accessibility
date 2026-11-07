// Test 3: el foco vuelve al resultado cuando el diálogo se cierra,
// tanto con Escape como con el botón "Close", y también con el ratón.
const { test, expect } = require('@playwright/test');
const { ui } = require('./helpers');

test('focus returns to the result after closing the dialog with Escape', async ({ page }) => {
  await page.goto('./');
  const $ = ui(page);

  await $.birkin.focus();
  await page.keyboard.press('Enter');
  await expect($.dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect($.dialog).toBeHidden();
  await expect($.birkin).toBeFocused();
});

test('focus returns to the result after closing the dialog with the Close button', async ({ page }) => {
  await page.goto('./');
  const $ = ui(page);

  await $.birkin.focus();
  await page.keyboard.press('Enter');
  await expect($.dialog).toBeVisible();

  // Según spec.md, el foco empieza en "Close".
  await expect($.close).toBeFocused();
  await page.keyboard.press('Enter');
  await expect($.dialog).toBeHidden();
  await expect($.birkin).toBeFocused();
});

test('focus returns to the result after clicking it and clicking Close', async ({ page }) => {
  await page.goto('./');
  const $ = ui(page);

  await $.birkin.click();
  await expect($.dialog).toBeVisible();
  await $.close.click();
  await expect($.dialog).toBeHidden();
  await expect($.birkin).toBeFocused();
});
