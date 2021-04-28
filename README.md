# ESLint Jest Playwright

> ESLint plugin for your [Jest](https://jestjs.io/) [Playwright](https://github.com/microsoft/playwright) ([jest-playwright](https://github.com/mmarkelov/jest-playwright/)) installation.

## Installation

Yarn

```txt
yarn add -D eslint-plugin-jest-playwright
```

NPM

```txt
npm install -D eslint-plugin-jest-playwright
```

## Usage

Add `plugin:jest-playwright/recommended` to your extends ESLint configuration. For example:

```json
{
  "extends": ["plugin:jest-playwright/recommended"]
}
```

## Rules

### `missing-playwright-expect` 🔧

Enforce Jest Playwright expect statements to be awaited.

#### Example

Example of **incorrect** code for this rule:

```js
expect(page).toHaveText("text");
```

Example of **correct** code for this rule:

```js
await expect(page).toHaveText("text");
```

#### Options

The rule accepts a non-required option which can be used to specify custom matchers which this rule should also warn about. This is useful when creating your own async matchers.

```json
{
  "@widen/missing-playwright-await": [
    "error",
    { "customMatchers": ["toHaveAttribute"] }
  ]
}
```
