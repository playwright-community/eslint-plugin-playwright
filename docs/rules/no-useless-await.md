# Disallow unnecessary `await`s for Playwright methods (`no-useless-await`)

Some Playwright methods are frequently, yet incorrectly, awaited when the await
expression has no effect.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
await page.locator('.my-element')
await page.getByRole('.my-element')

await expect(1).toBe(1)
await expect(true).toBeTruthy()
```

Examples of **correct** code for this rule:

```javascript
page.locator('.my-element')
page.getByRole('.my-element')

await page.$('.my-element')
await page.goto('.my-element')

expect(1).toBe(1)
expect(true).toBeTruthy()

await expect(page.locator('.foo')).toBeVisible()
await expect(page.locator('.foo')).toHaveText('bar')
```
