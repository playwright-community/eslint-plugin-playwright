# ESLint Plugin Playwright

[![Test](https://github.com/playwright-community/eslint-plugin-playwright/actions/workflows/test.yml/badge.svg)](https://github.com/playwright-community/eslint-plugin-playwright/actions/workflows/test.yml)
[![NPM](https://img.shields.io/npm/v/eslint-plugin-playwright)](https://www.npmjs.com/package/eslint-plugin-playwright)

> ESLint plugin for your [Playwright](https://github.com/microsoft/playwright) testing needs.

## Installation

Yarn

```sh
yarn add -D eslint-plugin-playwright
```

NPM

```sh
npm install -D eslint-plugin-playwright
```

## Usage

This plugin bundles two configurations to work with both `@playwright/test` or `jest-playwright`.

### With [Playwright test runner](https://playwright.dev/docs/test-intro)

```json
{
  "extends": ["plugin:playwright/playwright-test"]
}
```

### With [Jest Playwright](https://github.com/playwright-community/jest-playwright)

```json
{
  "extends": ["plugin:playwright/jest-playwright"]
}
```

## Rules

### `missing-playwright-await` 🔧

Identify false positives when async Playwright APIs are not properly awaited.

#### Example

Example of **incorrect** code for this rule:

```js
expect(page).toMatchText("text");

test.step("clicks the button", async () => {
  await page.click("button");
});
```

Example of **correct** code for this rule:

```js
await expect(page).toMatchText("text");

await test.step("clicks the button", async () => {
  await page.click("button");
});
```

#### Options

The rule accepts a non-required option which can be used to specify custom matchers which this rule should also warn about. This is useful when creating your own async `expect` matchers.

```json
{
  "playwright/missing-playwright-await": [
    "error",
    { "customMatchers": ["toBeCustomThing"] }
  ]
}
```
### `no-page-pause`

Prevent usage of `page.pause()`.

#### Example

Example of **incorrect** code for this rule:

```js
await page.click('button');
await page.pause();
```

Example of **correct** code for this rule:

```js
await page.click('button');
```

### `no-element-handle`

Disallow the creation of element handles with `page.$` or `page.$$`.

Examples of **incorrect** code for this rule:

```js
// Element Handle
const buttonHandle = await page.$('button');
await buttonHandle.click();

// Element Handles
const linkHandles = await page.$$('a');
```

Example of **correct** code for this rule:

```js
const buttonLocator = page.locator('button');
await buttonLocator.click();
```

### `no-eval`

Disallow usage of `page.$eval` and `page.$$eval`.

Examples of **incorrect** code for this rule:

```js
const searchValue = await page.$eval('#search', el => el.value);

const divCounts = await page.$$eval('div', (divs, min) => divs.length >= min, 10);

await page.$eval('#search', el => el.value);

await page.$$eval('#search', el => el.value);
```

Example of **correct** code for this rule:

```js
await page.locator('button').evaluate(node => node.innerText);

await page.locator('div').evaluateAll((divs, min) => divs.length >= min, 10);
```

### `no-focused-test`

Disallow usage of `.only()` annotation

Examples of **incorrect** code for this rule:

```js
test.only('focus this test', async ({ page }) => {});

test.describe.only('focus two tests', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe.parallel.only('focus two tests in parallel mode', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe.serial.only('focus two tests in serial mode', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

```

Examples of **correct** code for this rule:

```js
test('this test', async ({ page }) => {});

test.describe('two tests', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe.parallel('two tests in parallel mode', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe.serial('two tests in serial mode', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});
```

### `no-wait-for-timeout`

Disallow usage of `page.waitForTimeout()`.

Example of **incorrect** code for this rule:

```js
await page.waitForTimeout(5000);
```

Examples of **correct** code for this rule:

```js
// Use signals such as network events, selectors becoming visible and others instead.
await page.waitForLoadState();

await page.waitForUrl('/home');

await page.waitForFunction(() => window.innerWidth < 100);
```

### `no-skipped-test`

Disallow usage of the `.skip()` annotation.

Examples of **incorrect** code for this rule:

```js
test.skip('skip this test', async ({ page }) => {});

test.describe.skip('skip two tests', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe('skip test inside describe', () => {
  test.skip();
});

test.describe('skip test conditionally', async ({ browserName }) => {
  test.skip(browserName === 'firefox', 'Working on it');
});

```

Examples of **correct** code for this rule:

```js
test('this test', async ({ page }) => {});

test.describe('two tests', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});
```

### `no-force-option`

Disallow usage of the `{ force: true }` option.

Examples of **incorrect** code for this rule:

```js
await page.locator('button').click({ force: true });

await page.locator('check').check({ force: true });

await page.locator('input').fill('something', { force: true });
```

Examples of **correct** code for this rule:

```js
await page.locator('button').click();

await page.locator('check').check();

await page.locator('input').fill('something');
```
