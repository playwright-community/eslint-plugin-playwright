# Disallow usage of `page.waitForSelector` (`no-wait-for-selector`)

## Rule Details

Example of **incorrect** code for this rule:

```javascript
await page.waitForSelector('#foo');
```

Examples of **correct** code for this rule:

```javascript
await page.waitForLoadState();
await page.waitForURL('/home');
await page.waitForFunction(() => window.innerWidth < 100);
```
