# Suggest using `toHaveCount()` (`prefer-to-have-count`)

In order to have a better failure message, `toHaveCount()` should be used upon
asserting expectations on locators `count()` method.

## Rule details

This rule triggers a warning if `toBe()`, `toEqual()` or `toStrictEqual()` is
used to assert locators `count()` method.

The following patterns are considered warnings:

```javascript
expect(await files.count()).toBe(1);
expect(await files.count()).toEqual(1);
expect(await files.count()).toStrictEqual(1);
```

The following pattern is **not** a warning:

```javascript
await expect(files).toHaveCount(1);
```
