# Valid Test Tags

This rule ensures that test tags in Playwright test files follow the correct
format and meet any configured requirements.

## Rule Details

This rule enforces the following:

1. Tags must start with `@` (e.g., `@e2e`, `@regression`)
2. (Optional, exclusive of 3) Tags must match one of the values in the
   `allowedTags` property
3. (Optional, exclusive of 2) Tags must not match one of the values in the
   `disallowedTags` property

### Examples

```ts
// Valid
test('my test', { tag: '@e2e' }, async ({ page }) => {})
test('my test', { tag: ['@e2e', '@login'] }, async ({ page }) => {})
test.describe('my suite', { tag: '@regression' }, () => {})
test.step('my step', { tag: '@critical' }, async () => {})

// Valid with test.skip, test.fixme, test.only
test.skip('my test', { tag: '@e2e' }, async ({ page }) => {})
test.fixme('my test', { tag: '@e2e' }, async ({ page }) => {})
test.only('my test', { tag: '@e2e' }, async ({ page }) => {})

// Valid with annotation
test(
  'my test',
  {
    tag: '@e2e',
    annotation: { type: 'issue', description: 'BUG-123' },
  },
  async ({ page }) => {},
)

// Valid with array of annotations
test(
  'my test',
  {
    tag: '@e2e',
    annotation: [{ type: 'issue', description: 'BUG-123' }, { type: 'flaky' }],
  },
  async ({ page }) => {},
)

// Invalid
test('my test', { tag: 'e2e' }, async ({ page }) => {}) // Missing @ prefix
test('my test', { tag: ['e2e', 'login'] }, async ({ page }) => {}) // Missing @ prefix
```

## Options

This rule accepts an options object with the following properties:

```ts
type RuleOptions = {
  allowedTags?: (string | RegExp)[] // List of allowed tags or patterns
  disallowedTags?: (string | RegExp)[] // List of disallowed tags or patterns
}
```

### `allowedTags`

When specified, only the listed tags are allowed. You can use either exact
strings or regular expressions to match patterns.

```ts
// Only allow specific tags
{
  "rules": {
    "playwright/valid-test-tags": ["error", { "allowedTags": ["@e2e", "@regression"] }]
  }
}

// Allow tags matching a pattern
{
  "rules": {
    "playwright/valid-test-tags": ["error", { "allowedTags": ["@e2e", /^@my-tag-\d+$/] }]
  }
}
```

### `disallowedTags`

When specified, the listed tags are not allowed. You can use either exact
strings or regular expressions to match patterns.

```ts
// Disallow specific tags
{
  "rules": {
    "playwright/valid-test-tags": ["error", { "disallowedTags": ["@skip", "@todo"] }]
  }
}

// Disallow tags matching a pattern
{
  "rules": {
    "playwright/valid-test-tags": ["error", { "disallowedTags": ["@skip", /^@temp-/] }]
  }
}
```

Note: You cannot use both `allowedTags` and `disallowedTags` together. Choose
one approach based on your needs.

## Further Reading

- [Playwright Test Tags Documentation](https://playwright.dev/docs/test-annotations#tag-tests)
- [Playwright Test Annotations Documentation](https://playwright.dev/docs/test-annotations)
