# Prefer having hooks in a consistent order (`prefer-hooks-in-order`)

While hooks can be setup in any order, they're always called by `playwright` in
this specific order:

1. `beforeAll`
1. `beforeEach`
1. `afterEach`
1. `afterAll`

This rule aims to make that more obvious by enforcing grouped hooks be setup in
that order within tests.

## Rule details

Examples of **incorrect** code for this rule

```js
/* eslint playwright/prefer-hooks-in-order: "error" */

test.describe('foo', () => {
  test.beforeEach(() => {
    seedMyDatabase()
  })

  test.beforeAll(() => {
    createMyDatabase()
  })

  test('accepts this input', () => {
    // ...
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
/* eslint playwright/prefer-hooks-in-order: "error" */

test.describe('foo', () => {
  test.beforeAll(() => {
    createMyDatabase()
  })

  test.beforeEach(() => {
    seedMyDatabase()
  })

  test('accepts this input', () => {
    // ...
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

    test.beforeEach(() => {
      mockLogger()
    })

    test.afterEach(() => {
      clearLogger()
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

## Also See

- [`prefer-hooks-on-top`](prefer-hooks-on-top.md)
