# Prefer web first assertions (`prefer-web-first-assertions`)

Playwright supports many web first assertions to assert properties or conditions
on elements. These assertions are preferred over instance methods as the web
first assertions will automatically wait for the conditions to be fulfilled
resulting in more resilient tests.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
expect(await page.locator('.tweet').isVisible()).toBe(true)
expect(await page.locator('.tweet').isEnabled()).toBe(true)
expect(await page.locator('.tweet').innerText()).toBe('bar')
```

Example of **correct** code for this rule:

```javascript
await expect(page.locator('.tweet')).toBeVisible()
await expect(page.locator('.tweet')).toBeEnabled()
await expect(page.locator('.tweet')).toHaveText('bar')
```
