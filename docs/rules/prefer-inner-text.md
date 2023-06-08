# Suggest using `innerText()` (`prefer-inner-text`)

The `textContent()` method is similar to the `innerText()` method, but the
`innerText()` method shows only human readable elements, while `textContent()`
also includes text hidden by CSS and the contents of script/style tags.

## Rule details

This rule triggers a warning if `textContent()` is called on a `locator`
element.

The following patterns are considered warnings:

```javascript
page.locator("div").textContent();
```

The following pattern is **not** a warning:

```javascript
page.locator("div").innerText();
```
