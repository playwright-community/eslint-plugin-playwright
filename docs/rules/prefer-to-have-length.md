# Suggest using `toHaveLength()` (`prefer-to-have-length`)

In order to have a better failure message, `toHaveLength()` should be used upon
asserting expectations on objects length property.

## Rule details

This rule triggers a warning if `toBe()`, `toEqual()` or `toStrictEqual()` is
used to assert objects length property.

The following patterns are considered warnings:

```javascript
expect(files.length).toBe(1)
expect(files.length).toEqual(1)
expect(files.length).toStrictEqual(1)
```

The following pattern is **not** a warning:

```javascript
expect(files).toHaveLength(1)
```
