## Disallow usage of element handles (`no-element-handle`)

Disallow the creation of element handles with `page.$` or `page.$$`.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
// Element Handle
const buttonHandle = await page.$('button');
await buttonHandle.click();

// Element Handles
const linkHandles = await page.$$('a');
```

Example of **correct** code for this rule:

```javascript
const buttonLocator = page.locator('button');
await buttonLocator.click();
```
