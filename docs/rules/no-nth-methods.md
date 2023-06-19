# Disallow usage of `nth` methods (`no-nth-methods`)

This rule prevents the usage of `nth` methods (`first()`, `last()`, and
`nth()`). These methods can be prone to flakiness if the DOM structure changes.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
page.locator('button').first();
page.locator('button').last();
page.locator('button').nth(3);
```
