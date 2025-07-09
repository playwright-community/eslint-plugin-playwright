## Prevent unsafe variable references in `page.evaluate()` and `page.addInitScript()` (`no-unsafe-references`)

This rule prevents common mistakes when using `page.evaluate()` or
`page.addInitScript()` with variables referenced from the parent scope. When
referencing variables from the parent scope with these methods, you must pass
them as an argument so Playwright can properly serialize and send them to the
browser page where the function being evaluated is executed.

## Rule Details

Example of **incorrect** code for this rule:

```javascript
const x = 7
const y = 8
await page.evaluate(() => Promise.resolve(x * y), [])
await page.addInitScript(() => Promise.resolve(x * y), [])
```

Example of **correct** code for this rule:

```javascript
await page.evaluate(([x, y]) => Promise.resolve(x * y), [7, 8])
await page.addInitScript(([x, y]) => Promise.resolve(x * y), [7, 8])

const x = 7
const y = 8
await page.evaluate(([x, y]) => Promise.resolve(x * y), [x, y])
await page.addInitScript(([x, y]) => Promise.resolve(x * y), [x, y])
```
