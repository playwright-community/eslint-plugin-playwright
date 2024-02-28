# Enforces a maximum depth to nested describe calls (`max-nested-describe`)

While it's useful to be able to group your tests together within the same file
using `describe()`, having too many levels of nesting throughout your tests make
them difficult to read.

## Rule Details

Examples of **incorrect** code for this rule (with the default option of
`{ "max": 5 }` ):

```javascript
test.describe('foo', () => {
  test.describe('bar', () => {
    test.describe('baz', () => {
      test.describe('qux', () => {
        test.describe('quxx', () => {
          test.describe('too many', () => {
            test('this test', async ({ page }) => {})
          })
        })
      })
    })
  })
})
```

Examples of **correct** code for this rule (with the default option of
`{ "max": 5 }` ):

```javascript
test.describe('foo', () => {
  test.describe('bar', () => {
    test('this test', async ({ page }) => {})
  })
})
```

## Options

```json
{
  "playwright/max-nested-describe": ["error", { "max": 5 }]
}
```

### `max`

Enforces a maximum depth for nested `describe()`.

This has a default value of `5`.

Examples of **correct** code with options set to `{ "max": 2 }`:

```javascript
test.describe('foo', () => {
  test.describe('bar', () => {
    test('this test', async ({ page }) => {})
  })
})
```
