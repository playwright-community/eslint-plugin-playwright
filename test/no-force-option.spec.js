const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-force-option');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

const invalid = (code) => ({
  code,
  errors: [{ messageId: 'noForceOption' }],
});

new RuleTester().run('no-force-option', rule, {
  invalid: [
    invalid(`test('should work', async ({ page }) =>  { await page.locator('check').check({ force: true }) });`),
    invalid(`test('should work', async ({ page }) =>  { await page.locator('check').uncheck({ force: true }) });`),
    invalid(`test('should work', async ({ page }) =>  { await page.locator('button').click({ force: true }) });`),
    invalid(
      `test('should work', async ({ page }) =>  { const button = page.locator('button'); await button.click({ force: true }) });`
    ),
    invalid(
      `test('should work', async ({ page }) =>  { await page.locator('button').locator('btn').click({ force: true }) });`
    ),
    invalid(`test('should work', async ({ page }) =>  { await page.locator('button').dblclick({ force: true }) });`),
    invalid(`test('should work', async ({ page }) =>  { await page.locator('input').dragTo({ force: true }) });`),
    invalid(
      `test('should work', async ({ page }) =>  { await page.locator('input').fill('something', { force: true }) });`
    ),
    invalid(`test('should work', async ({ page }) =>  { await page.locator('elm').hover({ force: true }) });`),
    invalid(
      `test('should work', async ({ page }) =>  { await page.locator('select').selectOption({ label: 'Blue' }, { force: true }) });`
    ),
    invalid(`test('should work', async ({ page }) =>  { await page.locator('select').selectText({ force: true }) });`),
    invalid(
      `test('should work', async ({ page }) =>  { await page.locator('checkbox').setChecked(true, { force: true }) });`
    ),
    invalid(`test('should work', async ({ page }) =>  { await page.locator('button').tap({ force: true }) });`),
  ],
  valid: [
    `test('should work', async ({ page }) =>  { await page.locator('check').check() });`,
    `test('should work', async ({ page }) =>  { await page.locator('check').uncheck() });`,
    `test('should work', async ({ page }) =>  { await page.locator('button').click() });`,
    `test('should work', async ({ page }) =>  { await page.locator('button').locator('btn').click() });`,
    `test('should work', async ({ page }) =>  { await page.locator('button').click({ delay: 500, noWaitAfter: true }) });`,
    `test('should work', async ({ page }) =>  { await page.locator('button').dblclick() });`,
    `test('should work', async ({ page }) =>  { await page.locator('input').dragTo() });`,
    `test('should work', async ({ page }) =>  { await page.locator('input').fill('something', { timeout: 1000 }) });`,
    `test('should work', async ({ page }) =>  { await page.locator('elm').hover() });`,
    `test('should work', async ({ page }) =>  { await page.locator('select').selectOption({ label: 'Blue' }) });`,
    `test('should work', async ({ page }) =>  { await page.locator('select').selectText() });`,
    `test('should work', async ({ page }) =>  { await page.locator('checkbox').setChecked(true) });`,
    `test('should work', async ({ page }) =>  { await page.locator('button').tap() });`,
    `doSomething({ force: true });`,
    `test('should work', async ({ page }) =>  { await doSomething({ force: true }) });`,
  ],
});
