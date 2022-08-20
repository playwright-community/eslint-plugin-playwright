# Disallow usage of `not` matchers when a specific matcher exists (`no-useless-not`)

Several Playwright matchers are complimentary such as `toBeVisible`/`toBeHidden`
and `toBeEnabled`/`toBeDisabled`. While the `not` variants of each of these
matchers can be used, it's preferred to use the complimentary matcher instead.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
expect(locator).not.toBeVisible();
expect(locator).not.toBeHidden();
expect(locator).not.toBeEnabled();
expect(locator).not.toBeDisabled();
```

Example of **correct** code for this rule:

```javascript
expect(locator).toBeHidden();
expect(locator).toBeVisible();
expect(locator).toBeDisabled();
expect(locator).toBeEnabled();
```
