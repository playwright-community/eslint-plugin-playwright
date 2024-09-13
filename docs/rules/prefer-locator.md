# Suggest using `page.locator()` (`prefer-locator`)

Instead of using page methods use locator-based e.g. page.fill() use
[locator.fill(value[, options])](https://playwright.dev/docs/api/class-locator#locator-fill)

## Rule details

This rule triggers a warning if page methods are used, instead of locators.

The following patterns are considered warnings:

```javascript
await page.fill('input[type="password"]', 'password')
```

The following pattern is **not** a warning:

```javascript
await page.getByRole('password').fill('password')
await page.locator('input[type="password"]').fill('password')
```
