# Disallow specific matchers & modifiers (`no-restricted-matchers`)

This rule bans specific matchers & modifiers from being used, and can suggest
alternatives.

## Rule Details

Bans are expressed in the form of a map, with the value being either a string
message to be shown, or `null` if the default rule message should be used.

Both matchers, modifiers, and chains of the two are checked, allowing for
specific variations of a matcher to be banned if desired.

By default, this map is empty, meaning no matchers or modifiers are banned.

For example:

```json
{
  "playwright/no-restricted-matchers": [
    "error",
    {
      "toBeFalsy": "Use `toBe(false)` instead.",
      "not": null,
      "not.toHaveText": null
    }
  ]
}
```

Examples of **incorrect** code for this rule with the above configuration

```javascript
test('is false', () => {
  expect(a).toBeFalsy();
});

test('not', () => {
  expect(a).not.toBe(true);
});

test('chain', async () => {
  await expect(foo).not.toHaveText('bar');
});
```
