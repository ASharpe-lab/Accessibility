// Configuración de Playwright.
// Sirve todo el repo en http://localhost:4173 y ejecuta los mismos tests
// contra dos "proyectos": a/ (sin skill) y b/ (con skill).
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
  },
  projects: [
    { name: 'a', use: { baseURL: 'http://localhost:4173/a/' } },
    { name: 'b', use: { baseURL: 'http://localhost:4173/b/' } },
  ],
  // Arranca un servidor local antes de los tests.
  webServer: {
    command: 'npx http-server . -p 4173 -c-1 --silent',
    url: 'http://localhost:4173/items.json',
    reuseExistingServer: !process.env.CI,
  },
});
