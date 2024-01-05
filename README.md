# ESLint Plugin Playwright

[![Test](https://github.com/playwright-community/eslint-plugin-playwright/actions/workflows/test.yml/badge.svg)](https://github.com/playwright-community/eslint-plugin-playwright/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/eslint-plugin-playwright)](https://www.npmjs.com/package/eslint-plugin-playwright)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

ESLint plugin for [Playwright](https://github.com/microsoft/playwright).

## Installation

npm

```bash
npm install -D eslint-plugin-playwright
```

Yarn

```bash
yarn add -D eslint-plugin-playwright
```

pnpm

```bash
pnpm add -D eslint-plugin-playwright
```

## Usage

This plugin bundles two configurations to work with both `@playwright/test` or
`jest-playwright`.

---
📌 **Incomming legacy config deprecation notice**

*Please note that as per eslint 9.0.0, legacy config (**.eslintrc**) will be deprecated. It is advised to use flat config instead (**eslint.config.js**).*

*Learn more:*
- *https://eslint.org/docs/latest/use/configure/configuration-files*
- *https://eslint.org/docs/latest/extend/plugin-migration-flat-config*
---
### With [Playwright test runner](https://playwright.dev/docs/writing-tests)

[Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
(**eslint.config.js**)

```javascript
import playwright from 'eslint-plugin-playwright';

export default [
  playwright.configs['flat/recommended'],
  {
    rules: {
      // Customize Playwright rules
      // ...
    },
  },
];
```

[Legacy config](https://eslint.org/docs/latest/use/configure/configuration-files)
(**.eslintrc**) -*⚠️Will be deprecated as from eslint 9.0.0*

```json
{
  "extends": ["plugin:playwright/recommended"]
}
```

### With [Jest Playwright](https://github.com/playwright-community/jest-playwright)

[Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
(**eslint.config.js**)

```javascript
import playwright from 'eslint-plugin-playwright';
import jest from 'eslint-plugin-jest';

export default [
  playwright.configs['flat/jest-playwright'],
  {
    plugins: {
      jest,
    },
    rules: {
      // Customize Playwright rules
      // ...
    },
  },
];
```

[Legacy config](https://eslint.org/docs/latest/use/configure/configuration-files)
(**.eslintrc**) -*⚠️Will be deprecated as from eslint 9.0.0*

```json
{
  "extends": ["plugin:playwright/jest-playwright"]
}
```

## Global Settings

The plugin reads global settings from your ESLint configuration's shared data
under the `playwright` key. It supports the following settings:

- `additionalAssertFunctionNames`: an array of function names to treat as
  assertion functions for the case of rules like `expect-expect`, which enforces
  the presence of at least one assertion per test case. This allows such rules
  to recognise custom assertion functions as valid assertions. The global
  setting applies to all modules. The
  [`expect-expect` rule accepts an option by the same name](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/expect-expect.md#additionalassertfunctionnames)
  to enable per-module configuration (.e.g, for module-specific custom assert
  functions).

You can configure these settings like so:

[Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
(**eslint.config.js**)

```javascript
export default [
  {
    settings: {
      playwright: {
        additionalAssertFunctionNames: ['assertCustomCondition'],
      },
    },
  },
];
```

[Legacy config](https://eslint.org/docs/latest/use/configure/configuration-files)
(**.eslintrc**) -*⚠️Will be deprecated as from eslint 9.0.0*
```json
{
  "settings": {
    "playwright": {
      "additionalAssertFunctionNames": ["assertCustomCondition"]
    }
  }
}
```

## List of Supported Rules

✔: Enabled in the recommended configuration.\
🔧: Some problems reported by this rule are automatically fixable by the [`--fix`](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix)
command line option.\
💡: Some problems reported by this rule are manually fixable by editor
[suggestions](https://eslint.org/docs/latest/developer-guide/working-with-rules#providing-suggestions).

| ✔  | 🔧  | 💡  | Rule                                                                                                                                                | Description                                                       |
| :-: | :-: | :-: | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| ✔  |     |     | [expect-expect](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/expect-expect.md)                             | Enforce assertion to be made in a test body                       |
| ✔  |     |     | [max-nested-describe](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/max-nested-describe.md)                 | Enforces a maximum depth to nested describe calls                 |
| ✔  | 🔧  |     | [missing-playwright-await](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/missing-playwright-await.md)       | Enforce Playwright APIs to be awaited                             |
| ✔  |     |     | [no-conditional-in-test](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-conditional-in-test.md)           | Disallow conditional logic in tests                               |
| ✔  |     | 💡  | [no-element-handle](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-element-handle.md)                     | Disallow usage of element handles                                 |
| ✔  |     |     | [no-eval](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-eval.md)                                         | Disallow usage of `page.$eval` and `page.$$eval`                  |
| ✔  |     | 💡  | [no-focused-test](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-focused-test.md)                         | Disallow usage of `.only` annotation                              |
| ✔  |     |     | [no-force-option](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-force-option.md)                         | Disallow usage of the `{ force: true }` option                    |
| ✔  |     |     | [no-nested-step](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-nested-step.md)                           | Disallow nested `test.step()` methods                             |
| ✔  |     |     | [no-networkidle](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-networkidle.md)                           | Disallow usage of the `networkidle` option                        |
|     |     |     | [no-nth-methods](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-nth-methods.md)                           | Disallow usage of `first()`, `last()`, and `nth()` methods        |
| ✔  |     |     | [no-page-pause](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-page-pause.md)                             | Disallow using `page.pause`                                       |
|     |     |     | [no-raw-locators](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-raw-locators.md)                         | Disallow using raw locators                                       |
| ✔  | 🔧  |     | [no-useless-await](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-useless-await.md)                       | Disallow unnecessary `await`s for Playwright methods              |
|     |     |     | [no-restricted-matchers](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-restricted-matchers.md)           | Disallow specific matchers & modifiers                            |
| ✔  |     | 💡  | [no-skipped-test](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-skipped-test.md)                         | Disallow usage of the `.skip` annotation                          |
| ✔  | 🔧  |     | [no-useless-not](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-useless-not.md)                           | Disallow usage of `not` matchers when a specific matcher exists   |
| ✔  |     | 💡  | [no-wait-for-timeout](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-wait-for-timeout.md)                 | Disallow usage of `page.waitForTimeout`                           |
|     |     | 💡  | [prefer-strict-equal](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-strict-equal.md)                 | Suggest using `toStrictEqual()`                                   |
|     | 🔧  |     | [prefer-lowercase-title](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-lowercase-title.md)           | Enforce lowercase test names                                      |
|     | 🔧  |     | [prefer-to-be](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-to-be.md)                               | Suggest using `toBe()`                                            |
|     | 🔧  |     | [prefer-to-contain](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-to-contain.md)                     | Suggest using `toContain()`                                       |
|     | 🔧  |     | [prefer-to-have-count](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-to-have-count.md)               | Suggest using `toHaveCount()`                                     |
|     | 🔧  |     | [prefer-to-have-length](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-to-have-length.md)             | Suggest using `toHaveLength()`                                    |
| ✔  | 🔧  |     | [prefer-web-first-assertions](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-web-first-assertions.md) | Suggest using web first assertions                                |
|     |     |     | [require-top-level-describe](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/require-top-level-describe.md)   | Require test cases and hooks to be inside a `test.describe` block |
|     | 🔧  |     | [require-soft-assertions](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/require-soft-assertions.md)         | Require assertions to use `expect.soft()`                         |
| ✔  |     |     | [valid-expect](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/valid-expect.md)                               | Enforce valid `expect()` usage                                    |
| ✔  | 🔧  |     | [valid-title](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/valid-title.md)                                 | Enforce valid titles                                              |
