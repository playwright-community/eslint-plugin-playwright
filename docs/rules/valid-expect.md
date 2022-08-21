# Enforce valid `expect()` usage (`valid-expect`)

Ensure `expect()` is called with a matcher.

## Rule details

Examples of **incorrect** code for this rule:

```javascript
expect();
expect('something');
expect(true).toBeDefined;
```

Example of **correct** code for this rule:

```javascript
expect(locator).toHaveText('howdy');
expect('something').toBe('something');
expect(true).toBeDefined();
```

## Options

```json
{
  "minArgs": 1,
  "maxArgs": 2
}
```

### `minArgs` & `maxArgs`

Enforces the minimum and maximum number of arguments that `expect` can take, and
is required to take.

`minArgs` defaults to 1 while `maxArgs` deafults to `2` to support custom expect
messages. If you want to enforce `expect` always or never has a custom message,
you can adjust these two option values to your preference.
