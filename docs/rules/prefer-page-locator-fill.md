# Suggest using `page.locator()` (`prefer-page-locator-fill`)

Use locator-based [locator.fill(value[, options])](https://playwright.dev/docs/api/class-locator#locator-fill)
instead of page.fill().

## Rule details

This rule triggers a warning if `page.fill()` is used.

The following patterns are considered warnings:

```javascript
await page.fill("input[type=\"password\"]", "password");
```

The following pattern is **not** a warning:

```javascript
await page.getByRole("password").fill("password");
await page.locator("input[type=\"password\"]").fill("password");
```
