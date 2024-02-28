# Disallow usage of the `.skip` annotation (`no-skipped-test`)

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
test.skip('skip this test', async ({ page }) => {})

test.describe.skip('skip two tests', () => {
  test('one', async ({ page }) => {})
  test('two', async ({ page }) => {})
})

test.describe('skip test inside describe', () => {
  test.skip()
})

test.describe('skip test conditionally', async ({ browserName }) => {
  test.skip(browserName === 'firefox', 'Working on it')
})
```

Examples of **correct** code for this rule:

```javascript
test('this test', async ({ page }) => {})

test.describe('two tests', () => {
  test('one', async ({ page }) => {})
  test('two', async ({ page }) => {})
})
```

## Options

```json
{
  "playwright/no-skipped-test": [
    "error",
    {
      "allowConditional": false
    }
  ]
}
```

### `allowConditional`

Setting this option to `true` will allow using `test.skip()` to
[conditionally skip a test](https://playwright.dev/docs/test-annotations#conditionally-skip-a-test).
This can be helpful if you want to prevent usage of `test.skip` being added by
mistake but still allow conditional tests based on browser/environment setup.

Example of **correct** code for the `{ "allowConditional": true }` option:

```javascript
test('foo', ({ browserName }) => {
  test.skip(browserName === 'firefox', 'Still working on it')
})
```
