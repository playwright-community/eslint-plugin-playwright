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
`jest-playwright`. The recommended setup is to use the `files` field to target
only Playwright test files. In the examples below, this is done by targeting
files in the `tests` directory and only applying the Playwright rules to those
files. In your project, you may need to change the `files` field to match your
Playwright test file patterns.

### With [Playwright test runner](https://playwright.dev/docs/writing-tests)

[Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
(**eslint.config.js**)

```javascript
import playwright from 'eslint-plugin-playwright'

export default [
  {
    ...playwright.configs['flat/playwright'],
    files: ['tests/**'],
  },
  {
    files: ['tests/**'],
    rules: {
      // Customize Playwright rules
      // ...
    },
  },
]
```

[Legacy config](https://eslint.org/docs/latest/use/configure/configuration-files)
(**.eslintrc**)

```json
{
  "overrides": [
    {
      "files": "tests/**",
      "extends": "plugin:playwright/recommended"
    }
  ]
}
```

### With [Jest Playwright](https://github.com/playwright-community/jest-playwright)

[Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
(**eslint.config.js**)

```javascript
import playwright from 'eslint-plugin-playwright'
import jest from 'eslint-plugin-jest'

export default [
  {
    ...playwright.configs['flat/jest-playwright'],
    files: ['tests/**'],
  },
  {
    files: ['tests/**'],
    plugins: { jest },
    rules: {
      // Customize Playwright rules
      // ...
    },
  },
]
```

[Legacy config](https://eslint.org/docs/latest/use/configure/configuration-files)
(**.eslintrc**)

```json
{
  "overrides": [
    {
      "files": "tests/**",
      "extends": "plugin:playwright/jest-playwright"
    }
  ]
}
```

### Aliased Playwright Globals

If you import Playwright globals (e.g. `test`, `expect`) with a custom name, you
can configure this plugin to be aware of these additional names.

```json
{
  "settings": {
    "playwright": {
      "globalAliases": {
        "test": ["myTest"],
        "expect": ["myExpect"]
      }
    }
  }
}
```

## Rules

✅ Set in the `recommended` configuration\
🔧 Automatically fixable by the [`--fix`](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix)
CLI option\
💡 Manually fixable by
[editor suggestions](https://eslint.org/docs/latest/developer-guide/working-with-rules#providing-suggestions)

| Rule                                                                                                                                          | Description                                                | ✅  | 🔧  | 💡  |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | :-: | :-: | :-: |
| [expect-expect](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/expect-expect.md)                       | Enforce assertion to be made in a test body                | ✅  |     |     |
| [max-expects](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/max-expects.md)                           | Enforces a maximum number assertion calls in a test body   | ✅  |     |     |
| [max-nested-describe](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/max-nested-describe.md)           | Enforces a maximum depth to nested describe calls          | ✅  |     |     |
| [missing-playwright-await](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/missing-playwright-await.md) | Enforce Playwright APIs to be awaited                      | ✅  | 🔧  |     |
| [no-commented-out-tests](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-commented-out-tests.md)     | Disallow commented out tests                               |     |     |     |
| [no-conditional-expect](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-conditional-expect.md)       | Disallow calling `expect` conditionally                    | ✅  |     |     |
| [no-conditional-in-test](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-conditional-in-test.md)     | Disallow conditional logic in tests                        | ✅  |     |     |
| [no-duplicate-hooks](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-duplicate-hooks.md)             | Disallow duplicate setup and teardown hooks                |     |     |     |
| [no-element-handle](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-element-handle.md)               | Disallow usage of element handles                          | ✅  |     | 💡  |
| [no-eval](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-eval.md)                                   | Disallow usage of `page.$eval()` and `page.$$eval()`       | ✅  |     |     |
| [no-focused-test](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-focused-test.md)                   | Disallow usage of `.only` annotation                       | ✅  |     | 💡  |
| [no-force-option](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-force-option.md)                   | Disallow usage of the `{ force: true }` option             | ✅  |     |     |
| [no-hooks](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-hooks.md)                                 | Disallow setup and teardown hooks                          |     |     |     |
| [no-nested-step](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-nested-step.md)                     | Disallow nested `test.step()` methods                      | ✅  |     |     |
| [no-networkidle](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-networkidle.md)                     | Disallow usage of the `networkidle` option                 | ✅  |     |     |
| [no-nth-methods](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-nth-methods.md)                     | Disallow usage of `first()`, `last()`, and `nth()` methods |     |     |     |
| [no-page-pause](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-page-pause.md)                       | Disallow using `page.pause()`                              | ✅  |     |     |
| [no-unsafe-references](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-unsafe-references.md)         | Prevent unsafe variable references in `page.evaluate()`    | ✅  | 🔧  |     |

|
[no-get-by-title](https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-get-by-title.md)
