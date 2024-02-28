# Disallow using `expect` outside of `test` blocks (`no-standalone-expect`)

Prevents `expect` statements outside of a `test` block. An `expect` within a
helper function (but outside of a `test` block) will not trigger this rule.

## Rule details

This rule aims to eliminate `expect` statements outside of `test` blocks to
encourage good testing practices. Using `expect` statements outside of `test`
blocks may partially work, but their intent is to be used within a test as doing
so makes it clear the purpose of each test.

Using `expect` in helper functions is allowed to support grouping several expect
statements into a helper function or page object method. Test hooks such as
`beforeEach` are also allowed to support use cases such as waiting for an
element on the page before each test is executed. While these uses cases are
supported, they should be used sparingly as moving too many `expect` statements
outside of the body of a `test` block can make it difficult to understand the
purpose and primary assertions being made by a given test.

Examples of **incorrect** code for this rule:

```js
// in describe
test.describe('a test', () => {
  expect(1).toBe(1)
})

// below other tests
test.describe('a test', () => {
  test('an it', () => {
    expect(1).toBe(1)
  })

  expect(1).toBe(1)
})
```

Examples of **correct** code for this rule:

```js
// in it block
test.describe('a test', () => {
  test('an it', () => {
    expect(1).toBe(1)
  })
})

// in helper function
test.describe('a test', () => {
  const helper = () => {
    expect(1).toBe(1)
  }

  test('an it', () => {
    helper()
  })
})
```

_Note that this rule will not trigger if the helper function is never used even
though the `expect` will not execute. Rely on a rule like no-unused-vars for
this case._

## When Not To Use It

Don't use this rule on non-playwright test files.
