# Disallow nested step methods (`no-nested-step`)

Nesting `test.step()` methods can make your tests difficult to read.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
test('foo', async () => {
  await test.step('step1', async () => {
    await test.step('nest step', async () => {
      await expect(true).toBe(true);
    });
  });
});
```

Examples of **correct** code for this rule:

```javascript
test('foo', async () => {
  await test.step('step1', async () => {
    await expect(true).toBe(true);
  });
  await test.step('step2', async () => {
    await expect(true).toBe(true);
  });
});
```
