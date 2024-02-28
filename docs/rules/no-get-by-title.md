## Disallow using `getByTitle()` (`no-get-by-title`)

The HTML `title` attribute does not provide a fully accessible tooltip for
elements so relying on it to identify elements can hide accessibility issues in
your code. This rule helps to prevent that by disallowing use of the
`getByTitle` method.

## Rule Details

Example of **incorrect** code for this rule:

```javascript
await page.getByTitle('Delete product').click()
```

Example of **correct** code for this rule:

```javascript
await page.getByRole('button', { name: 'Delete product' }).click()
```
