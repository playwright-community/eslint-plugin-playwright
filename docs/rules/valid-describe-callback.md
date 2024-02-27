# Enforce valid `describe()` callback (`valid-describe-callback`)

Using an improper `describe()` callback function can lead to unexpected test
errors.

## Rule details

This rule validates that the second parameter of a `describe()` function is a
callback function. This callback function:

- should not be
  [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- should not contain any parameters
- should not contain any `return` statements

The following patterns are considered warnings:

```js
// Async callback functions are not allowed
test.describe('myFunction()', async () => {
  // ...
});

// Callback function parameters are not allowed
test.describe('myFunction()', (done) => {
  // ...
});

// No return statements are allowed in block of a callback function
test.describe('myFunction', () => {
  return Promise.resolve().then(() => {
    test('breaks', () => {
      throw new Error('Fail');
    });
  });
});

// Returning a value from a describe block is not allowed
test.describe('myFunction', () =>
  test('returns a truthy value', () => {
    expect(myFunction()).toBeTruthy();
  }));
```

The following patterns are **not** considered warnings:

```js
test.describe('myFunction()', () => {
  test('returns a truthy value', () => {
    expect(myFunction()).toBeTruthy();
  });
});
```
