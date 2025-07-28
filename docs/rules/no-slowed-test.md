# Disallow usage of the `.slow` annotation (`no-slowed-test`)

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
test.slow('slow this test', async ({ page }) => {})

test.describe('slow test inside describe', () => {
  test.slow()
})

test.describe('slow test conditionally', async ({ browserName }) => {
  test.slow(browserName === 'firefox', 'Working on it')
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
  "playwright/no-slowed-test": [
    "error",
    {
      "allowConditional": false
    }
  ]
}
```

### `allowConditional`

Setting this option to `true` will allow using `test.slow()` to conditionally
mark a test as slow. This can be helpful if you want to prevent usage of
`test.slow` being added by mistake but still allow slow tests based on
browser/environment setup.

Examples of **incorrect** code for the `{ "allowConditional": true }` option:

```javascript
test.slow('foo', ({}) => {
  expect(1).toBe(1)
})

test('foo', ({}) => {
  test.slow()
  expect(1).toBe(1)
})
```

Example of **correct** code for the `{ "allowConditional": true }` option:

```javascript
test('foo', ({ browserName }) => {
  test.slow(browserName === 'firefox', 'Still working on it')
  expect(1).toBe(1)
})
```
