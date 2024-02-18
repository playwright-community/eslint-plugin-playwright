# Disallow duplicate setup and teardown hooks (`no-duplicate-hooks`)

A `describe` block should not contain duplicate hooks.

## Rule details

Examples of **incorrect** code for this rule

```js
/* eslint playwright/no-duplicate-hooks: "error" */

test.describe('foo', () => {
  test.beforeEach(() => {
    // some setup
  });
  test.beforeEach(() => {
    // some setup
  });
  test('foo_test', () => {
    // some test
  });
});

// Nested describe scenario
test.describe('foo', () => {
  test.beforeEach(() => {
    // some setup
  });
  test('foo_test', () => {
    // some test
  });
  test.describe('bar', () => {
    test('bar_test', () => {
      test.afterAll(() => {
        // some teardown
      });
      test.afterAll(() => {
        // some teardown
      });
    });
  });
});
```

Examples of **correct** code for this rule

```js
/* eslint playwright/no-duplicate-hooks: "error" */

test.describe('foo', () => {
  test.beforeEach(() => {
    // some setup
  });
  test('foo_test', () => {
    // some test
  });
});

// Nested describe scenario
test.describe('foo', () => {
  test.beforeEach(() => {
    // some setup
  });
  test('foo_test', () => {
    // some test
  });
  test.describe('bar', () => {
    test('bar_test', () => {
      test.beforeEach(() => {
        // some setup
      });
    });
  });
});
```
