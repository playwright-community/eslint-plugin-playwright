# Enforce assertion to be made in a test body (`expect-expect`)

Ensure that there is at least one `expect` call made in a test.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
test('should be a test', () => {
  console.log('no assertion');
});

test('should assert something', () => {});
```

Examples of **correct** code for this rule:

```javascript
test('should be a test', async () => {
  await expect(page).toHaveTitle('foo');
});

test('should work with callbacks/async', async () => {
  await test.step('step 1', async () => {
    await expect(page).toHaveTitle('foo');
  });
});
```

## Options

```json
{
  "playwright/expect-expect": [
    "error",
    {
      "additionalAssertFunctionNames": ["assertCustomCondition"]
    }
  ]
}
```

### `additionalAssertFunctionNames`

An array of function names to treat as assertion functions. Only standalone functions are supported. Configure globally acceptable assert function names using [the global setting](../global-settings.md). The rule's option is recommended to be used at a module level to add module-specific assert function names. For example: 

```ts
/* eslint playwright/expect-expect: ["error", { "additionalAssertFunctionNames": ["assertScrolledToBottom"] }] */

function assertScrolledToBottom(page) {
  // ...
}

describe('scrolling', () => {
  test('button click', async ({ page }) => {
    // ...
    await assertScrolledToBottom(page)
  })

  test('another way to scroll', async ({ page }) => {
    // ...
    await assertScrolledToBottom(page)
  })
})
```

The rule option and the global setting are merged. On a module level, both are considered.