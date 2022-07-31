# Disallow usage of the `{ force: true }` option (`no-force-option`)

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
await page.locator('button').click({ force: true });
await page.locator('check').check({ force: true });
await page.locator('input').fill('something', { force: true });
```

Examples of **correct** code for this rule:

```javascript
await page.locator('button').click();
await page.locator('check').check();
await page.locator('input').fill('something');
```
