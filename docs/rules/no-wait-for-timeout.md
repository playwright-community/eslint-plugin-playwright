# Disallow usage of `page.waitForTimeout` (`no-wait-for-timeout`)

## Rule Details

Example of **incorrect** code for this rule:

```javascript
await page.waitForTimeout(5000);
```

Examples of **correct** code for this rule:

```javascript
// Use signals such as network events, selectors becoming visible and others instead.
await page.waitForLoadState();

await page.waitForUrl('/home');

await page.waitForFunction(() => window.innerWidth < 100);
```
