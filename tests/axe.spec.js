// Test 4: escaneo con axe. No puede haber violaciones "serious" ni "critical".
// Se escanea la página en tres estados: al cargar, con el diálogo abierto
// y con los errores del formulario visibles.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { ui } = require('./helpers');

async function seriousViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.impact}: ${v.id} – ${v.help} (${v.nodes.length} elementos)`);
}

test('axe: no serious or critical violations on page load', async ({ page }) => {
  await page.goto('./');
  await expect(ui(page).birkin).toBeVisible(); // esperar a que carguen los datos
  expect(await seriousViolations(page)).toEqual([]);
});

test('axe: no serious or critical violations with the dialog open', async ({ page }) => {
  await page.goto('./');
  const $ = ui(page);
  await $.birkin.click();
  await expect($.dialog).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});

test('axe: no serious or critical violations with form errors shown', async ({ page }) => {
  await page.goto('./');
  const $ = ui(page);
  await $.signUp.click(); // enviar vacío para que aparezcan los errores
  await expect(page.getByText(/Error:/).first()).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});
