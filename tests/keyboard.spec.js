// Test 1: la tarea principal solo con teclado
// (Tab, Shift+Tab, Enter, Space y Escape), siguiendo el orden de spec.md.
const { test, expect } = require('@playwright/test');
const { pressUntilFocused, expectInLiveRegion, ui } = require('./helpers');

test('main task with the keyboard only: search Birkin, open, close, save, sign up', async ({ page }) => {
  await page.goto('./');
  const $ = ui(page);

  // 1. El primer Tab llega al skip link. Enter salta al main.
  await page.keyboard.press('Tab');
  await expect($.skipLink).toBeFocused();
  await page.keyboard.press('Enter');

  // 2. Tab al campo "Search" y escribir "Birkin".
  await pressUntilFocused(page, $.search);
  await page.keyboard.type('Birkin');

  // El número de resultados cambia a "1 result" y se lee en voz alta.
  const count = page.getByText(/^\s*1 result\s*$/);
  await expect(count).toBeVisible();
  await expectInLiveRegion(count);

  // 3. Tab al resultado "Birkin".
  await pressUntilFocused(page, $.birkin);

  // 4. Enter abre el diálogo y el foco entra en él.
  await page.keyboard.press('Enter');
  await expect($.dialog).toBeVisible();
  await expect($.dialog).toContainText('1984');
  const focusInDialog = await $.dialog.evaluate((d) => d.contains(document.activeElement));
  expect(focusInDialog, 'El foco no está dentro del diálogo').toBe(true);

  // 5. Escape cierra el diálogo y el foco vuelve a "Birkin".
  await page.keyboard.press('Escape');
  await expect($.dialog).toBeHidden();
  await expect($.birkin).toBeFocused();

  // 6. Tab a "Save Birkin". Shift+Tab vuelve atrás y Tab avanza otra vez.
  await pressUntilFocused(page, $.saveBirkin);
  await page.keyboard.press('Shift+Tab');
  await expect($.birkin).toBeFocused();
  await pressUntilFocused(page, $.saveBirkin);

  // Space guarda el bolso.
  await page.keyboard.press('Space');
  await expect($.saveBirkin).toHaveAttribute('aria-pressed', 'true');

  // 7-8. Nombre y email.
  await pressUntilFocused(page, $.name, 'Tab', 15);
  await page.keyboard.type('Aretha');
  await page.keyboard.press('Tab');
  await expect($.email).toBeFocused();
  await page.keyboard.type('aretha@example.com');

  // 9. Tab al grupo "Favourite style". Space marca la primera opción.
  await page.keyboard.press('Tab');
  await expect($.firstStyle).toBeFocused();
  await page.keyboard.press('Space');
  await expect($.firstStyle).toBeChecked();

  // 10. Tab a la casilla de consentimiento. Space la marca.
  await page.keyboard.press('Tab');
  await expect($.consent).toBeFocused();
  await page.keyboard.press('Space');
  await expect($.consent).toBeChecked();

  // 11. Tab a "Sign up". Enter envía el formulario.
  await page.keyboard.press('Tab');
  await expect($.signUp).toBeFocused();
  await page.keyboard.press('Enter');

  // 12. Aparece el mensaje de éxito y se lee en voz alta.
  const success = page.getByText('Thanks! You are signed up.');
  await expect(success).toBeVisible();
  await expectInLiveRegion(success);
});
