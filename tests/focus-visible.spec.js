// Test 2: el foco es visible.
// Recorre la página con Tab y comprueba que cada elemento enfocado tiene
// un indicador visible: un outline de al menos 2 px o un box-shadow.
const { test, expect } = require('@playwright/test');
const { ui } = require('./helpers');

// Devuelve una descripción del elemento enfocado y si su foco se ve.
async function focusedInfo(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { name: '(body)', visible: false };
    const s = getComputedStyle(el);
    const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2;
    const shadow = s.boxShadow && s.boxShadow !== 'none';
    const name =
      el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 30) || el.id || el.tagName;
    return { name: `<${el.tagName.toLowerCase()}> ${name}`, visible: outline || !!shadow };
  });
}

test('focus is visible on every element reached with Tab', async ({ page }) => {
  await page.goto('./');

  const notVisible = [];
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    const info = await focusedInfo(page);
    if (!info.visible) notVisible.push(info.name);
  }
  expect(notVisible, 'Elementos sin foco visible').toEqual([]);
});

test('focus is visible on the Close button in the dialog', async ({ page }) => {
  await page.goto('./');
  const $ = ui(page);

  await $.birkin.focus();
  await page.keyboard.press('Enter');
  await expect($.dialog).toBeVisible();

  // Llevar el foco a "Close" con el teclado y comprobarlo.
  for (let i = 0; i < 6; i++) {
    if (await $.close.evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect($.close).toBeFocused();
  const info = await focusedInfo(page);
  expect(info.visible, `Foco no visible en ${info.name}`).toBe(true);
});
