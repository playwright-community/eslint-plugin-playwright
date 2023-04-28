# Enforces a maximum depth to nested step calls (`max-nested-step`)

While it's useful to be able to group your tests together within the same file
using `step()`, having too many levels of nesting throughout your tests make
them difficult to read.

## Rule Details

Examples of **incorrect** code for this rule (with the default option of
`{ "max": 5 }` ):

```javascript
test('foo', async () => {
  await test.step('step1', async () => {
    await test.step('step2', async () => {
      await test.step('step3', async () => {
        await test.step('step4', async () => {
          await test.step('step5', async () => {
            await test.step('step6', async () => {
              await expect(true).toBe(true);
            });
          });
        });
      });
    });
  });
});
```

Examples of **correct** code for this rule (with the default option of
`{ "max": 5 }` ):

```javascript
test('foo', async () => {
  await test.step('step1', async () => {
    await test.step('step2', async () => {
      await expect(true).toBe(true);
    });
  });
});
```

## Options

```json
{
  "playwright/max-nested-step": ["error", { "max": 5 }]
}
```

### `max`

Enforces a maximum depth for nested `step()`.

This has a default value of `5`.

Examples of **correct** code with options set to `{ "max": 2 }`:

```javascript
test('foo', async () => {
  await test.step('step1', async () => {
    await test.step('step2', async () => {
      await expect(true).toBe(true);
    });
  });
});
```
