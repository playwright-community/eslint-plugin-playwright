# Disallow using `expect` outside of `test` blocks (`no-standalone-expect`)

Prevents `expect` statements outside of a `test` block. An `expect` within a
helper function (but outside of a `test` block) will not trigger this rule.

## Rule details

This rule aims to eliminate `expect` statements that will not be executed. An
`expect` inside of a `describe` block but outside of a `test` block or outside a
`test.describe` will not execute and therefore will trigger this rule. It is
viable, however, to have an `expect` in a helper function that is called from
within a `test` block so `expect` statements in a function will not trigger this
rule.

Statements like `expect.hasAssertions()` will NOT trigger this rule since these
calls will execute if they are not in a test block.

Examples of **incorrect** code for this rule:

```js
// in describe
test.describe('a test', () => {
  expect(1).toBe(1);
});

// below other tests
test.describe('a test', () => {
  test('an it', () => {
    expect(1).toBe(1);
  });

  expect(1).toBe(1);
});
```

Examples of **correct** code for this rule:

```js
// in it block
test.describe('a test', () => {
  test('an it', () => {
    expect(1).toBe(1);
  });
});

// in helper function
test.describe('a test', () => {
  const helper = () => {
    expect(1).toBe(1);
  };

  test('an it', () => {
    helper();
  });
});

test.describe('a test', () => {
  expect.hasAssertions(1);
});
```

_Note that this rule will not trigger if the helper function is never used even
though the `expect` will not execute. Rely on a rule like no-unused-vars for
this case._

## When Not To Use It

Don't use this rule on non-playwright test files.
