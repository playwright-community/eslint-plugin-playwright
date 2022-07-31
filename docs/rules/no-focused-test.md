# Disallow usage of `.only()` annotation (`no-focused-test`)

Examples of **incorrect** code for this rule:

```js
test.only('focus this test', async ({ page }) => {});

test.describe.only('focus two tests', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe.parallel.only('focus two tests in parallel mode', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe.serial.only('focus two tests in serial mode', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});
```

Examples of **correct** code for this rule:

```js
test('this test', async ({ page }) => {});

test.describe('two tests', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe.parallel('two tests in parallel mode', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe.serial('two tests in serial mode', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});
```
