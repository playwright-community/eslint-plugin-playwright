# Require soft assertions (`require-soft-assertions`)

Some find it easier to write longer test that perform more assertions per test.
In cases like these, it can be helpful to require
[soft assertions](https://playwright.dev/docs/test-assertions#soft-assertions)
in your tests.

This rule is not enabled by default and is only intended to be used it if fits
your workflow. If you aren't sure if you should use this rule, you probably
shouldn't 🙂.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
await expect(page.locator('foo')).toHaveText('bar');
await expect(page).toHaveTitle('baz');
```

Examples of **correct** code for this rule:

```javascript
await expect.soft(page.locator('foo')).toHaveText('bar');
await expect.soft(page).toHaveTitle('baz');
```
