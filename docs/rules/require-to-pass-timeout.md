# Require a timeout for `toPass()` (`require-to-pass-timeout`)

`toPass()` is used to retry blocks of code until they pass successfully, such as
in `await expect(async () => { ... }).toPass()`. However, if no timeout is
defined, the test may run indefinitely until the test timeout. Requiring a
timeout ensures that the test will fail early if it does not pass within the
specified time.

## Rule details

This rule triggers a warning if `toPass()` is used without a timeout.

The following patterns are considered warnings:

```js
await expect(async () => {
  const response = await page.request.get('https://api.example.com')
  expect(response.status()).toBe(200)
}).toPass()
```

The following patterns are not considered warnings:

```js
await expect(async () => {
  const response = await page.request.get('https://api.example.com')
  expect(response.status()).toBe(200)
}).toPass({
  timeout: 60000,
})
```
