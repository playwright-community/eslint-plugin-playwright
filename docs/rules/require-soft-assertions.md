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
expect(page.locator('foo')).toHaveText('bar');
expect(page).toHaveTitle('baz');
```

Examples of **correct** code for this rule:

```javascript
expect.soft(page.locator('foo')).toHaveText('bar');
expect.soft(page).toHaveTitle('baz');
```
