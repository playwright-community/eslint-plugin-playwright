# ESLint Playwright

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

Enforce Playwright expect statements to be awaited.

#### Example

Example of **incorrect** code for this rule:

```js
expect(page).toMatchText("text");
```

Example of **correct** code for this rule:

```js
await expect(page).toMatchText("text");
```

#### Options

The rule accepts a non-required option which can be used to specify custom matchers which this rule should also warn about. This is useful when creating your own async matchers.

```json
{
  "playwright/missing-playwright-await": [
    "error",
    { "customMatchers": ["toBeCustomThing"] }
  ]
}
```
