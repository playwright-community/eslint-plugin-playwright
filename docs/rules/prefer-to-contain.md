# Suggest using `toContain()` (`prefer-to-contain`)

In order to have a better failure message, `toContain()` should be used upon
asserting expectations on an array containing an object.

## Rule Details

Example of **incorrect** code for this rule:

```javascript
expect(a.includes(b)).toBe(true)
expect(a.includes(b)).not.toBe(true)
expect(a.includes(b)).toBe(false)
expect(a.includes(b)).toEqual(true)
expect(a.includes(b)).toStrictEqual(true)
```

Example of **correct** code for this rule:

```javascript
expect(a).toContain(b)
expect(a).not.toContain(b)
```
