# Disallow usage of `page.waitForNavigation` (`no-wait-for-navigation`)

## Rule Details

Example of **incorrect** code for this rule:

```javascript
await page.waitForNavigation()

const navigationPromise = page.waitForNavigation()
await page.getByText('Navigate after timeout').click()
await navigationPromise
```

Examples of **correct** code for this rule:

```javascript
await page.waitForURL('**/target')
await page.click('delayed-navigation')
```
