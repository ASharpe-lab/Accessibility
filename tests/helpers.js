// Funciones compartidas por los tests.
const { expect } = require('@playwright/test');

// Pulsa una tecla (Tab por defecto) hasta que `locator` tenga el foco.
// Falla si no lo consigue en `max` pulsaciones.
async function pressUntilFocused(page, locator, key = 'Tab', max = 6) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press(key);
    if (await locator.evaluate((el) => el === document.activeElement).catch(() => false)) {
      return;
    }
  }
  await expect(locator, `${key} ×${max} no llegó al elemento esperado`).toBeFocused();
}

// Comprueba que un elemento está dentro de una región que se lee en voz alta
// (aria-live, role="status" o role="alert").
async function expectInLiveRegion(locator) {
  const inLive = await locator.evaluate(
    (el) => !!el.closest('[aria-live]:not([aria-live="off"]), [role="status"], [role="alert"]')
  );
  expect(inLive, 'El texto no está en una región aria-live / status / alert').toBe(true);
}

// Localizadores con los nombres de prompt.md y spec.md.
const ui = (page) => ({
  skipLink: page.getByRole('link', { name: 'Skip to main content' }),
  search: page.getByLabel('Search', { exact: true }),
  birkin: page.getByRole('button', { name: 'Birkin', exact: true }),
  saveBirkin: page.getByRole('button', { name: 'Save Birkin', exact: true }),
  dialog: page.getByRole('dialog'),
  close: page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }),
  name: page.getByLabel('Name', { exact: true }),
  email: page.getByLabel('Email', { exact: true }),
  firstStyle: page.getByRole('radio', { name: 'Tote', exact: true }),
  consent: page.getByRole('checkbox', { name: 'I agree to receive emails' }),
  signUp: page.getByRole('button', { name: 'Sign up', exact: true }),
});

module.exports = { pressUntilFocused, expectInLiveRegion, ui };
