# Disallow usage of the `networkidle` option (`no-networkidle`)

Using `networkidle` is discouraged in favor of using
[web first assertions](https://playwright.dev/docs/best-practices#use-web-first-assertions).

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
await page.waitForLoadState('networkidle')
await page.waitForURL('...', { waitUntil: 'networkidle' })
await page.goto('...', { waitUntil: 'networkidle' })
```
