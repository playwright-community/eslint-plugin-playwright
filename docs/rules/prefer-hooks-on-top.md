# Suggest having hooks before any test cases (`prefer-hooks-on-top`)

While hooks can be setup anywhere in a test file, they are always called in a
specific order, which means it can be confusing if they're intermixed with test
cases.

This rule helps to ensure that hooks are always defined before test cases.

## Rule details

Examples of **incorrect** code for this rule

```js
/* eslint playwright/prefer-hooks-on-top: "error" */

test.describe('foo', () => {
  test.beforeEach(() => {
    seedMyDatabase()
  })

  test('accepts this input', () => {
    // ...
  })

  test.beforeAll(() => {
    createMyDatabase()
  })

  test('returns that value', () => {
    // ...
  })

  test.describe('when the database has specific values', () => {
    const specificValue = '...'

    test.beforeEach(() => {
      seedMyDatabase(specificValue)
    })

    test('accepts that input', () => {
      // ...
    })

    test('throws an error', () => {
      // ...
    })

    test.afterEach(() => {
      clearLogger()
    })

    test.beforeEach(() => {
      mockLogger()
    })

    test('logs a message', () => {
      // ...
    })
  })

  test.afterAll(() => {
    removeMyDatabase()
  })
})
```

Examples of **correct** code for this rule

```js
/* eslint playwright/prefer-hooks-on-top: "error" */

test.describe('foo', () => {
  test.beforeAll(() => {
    createMyDatabase()
  })

  test.beforeEach(() => {
    seedMyDatabase()
  })

  test.afterAll(() => {
    clearMyDatabase()
  })

  test('accepts this input', () => {
    // ...
  })

  test('returns that value', () => {
    // ...
  })

  test.describe('when the database has specific values', () => {
    const specificValue = '...'

    beforeEach(() => {
      seedMyDatabase(specificValue)
    })

    beforeEach(() => {
      mockLogger()
    })

    afterEach(() => {
      clearLogger()
    })

    test('accepts that input', () => {
      // ...
    })

    test('throws an error', () => {
      // ...
    })

    test('logs a message', () => {
      // ...
    })
  })
})
```
