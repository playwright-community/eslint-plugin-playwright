# Disallow usage of the `.skip` annotation (`no-skipped-test`)

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
test.skip('skip this test', async ({ page }) => {});

test.describe.skip('skip two tests', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});

test.describe('skip test inside describe', () => {
  test.skip();
});

test.describe('skip test conditionally', async ({ browserName }) => {
  test.skip(browserName === 'firefox', 'Working on it');
});
```

Examples of **correct** code for this rule:

```javascript
test('this test', async ({ page }) => {});

test.describe('two tests', () => {
  test('one', async ({ page }) => {});
  test('two', async ({ page }) => {});
});
```
