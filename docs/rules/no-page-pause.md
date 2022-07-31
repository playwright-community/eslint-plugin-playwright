## Disallow using `page.pause` (`no-page-pause`)

Prevent usage of `page.pause()`.

## Rule Details

Example of **incorrect** code for this rule:

```javascript
await page.click('button');
await page.pause();
```

Example of **correct** code for this rule:

```javascript
await page.click('button');
```
