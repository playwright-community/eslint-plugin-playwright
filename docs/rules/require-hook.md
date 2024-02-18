# Require setup and teardown code to be within a hook (`require-hook`)

It's common when writing tests to need to perform setup work that has to happen
before tests run, and finishing work after tests run.

Because Playwright executes all `describe` handlers in a test file _before_ it
executes any of the actual tests, it's important to ensure setup and teardown
work is done inside `before*` and `after*` handlers respectively, rather than
inside the `describe` blocks.

## Rule details

This rule flags any expression that is either at the toplevel of a test file or
directly within the body of a `describe`, _except_ for the following:

- `import` statements
- `const` variables
- `let` _declarations_, and initializations to `null` or `undefined`
- Classes
- Types
- Calls to the standard Playwright globals

This rule flags any function calls within test files that are directly within
the body of a `describe`, and suggests wrapping them in one of the four
lifecycle hooks.

Here is a slightly contrived test file showcasing some common cases that would
be flagged:

```js
const initializeCityDatabase = () => {
  database.addCity('Vienna');
  database.addCity('San Juan');
  database.addCity('Wellington');
};

const clearCityDatabase = () => {
  database.clear();
};

initializeCityDatabase();

test('that persists cities', () => {
  expect(database.cities.length).toHaveLength(3);
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

test.describe('when loading cities from the api', () => {
  clearCityDatabase();

  test('does not duplicate cities', async () => {
    await database.loadCities();
    expect(database.cities).toHaveLength(4);
  });
});

clearCityDatabase();
```

Here is the same slightly contrived test file showcasing the same common cases
but in ways that would be **not** flagged:

```js
const initializeCityDatabase = () => {
  database.addCity('Vienna');
  database.addCity('San Juan');
  database.addCity('Wellington');
};

const clearCityDatabase = () => {
  database.clear();
};

test.beforeEach(() => {
  initializeCityDatabase();
});

test('that persists cities', () => {
  expect(database.cities.length).toHaveLength(3);
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

test.describe('when loading cities from the api', () => {
  test.beforeEach(() => {
    clearCityDatabase();
  });

  test('does not duplicate cities', async () => {
    await database.loadCities();
    expect(database.cities).toHaveLength(4);
  });
});

test.afterEach(() => {
  clearCityDatabase();
});
```

## Options

If there are methods that you want to call outside of hooks and tests, you can
mark them as allowed using the `allowedFunctionCalls` option.

```json
{
  "playwright/require-hook": [
    "error",
    {
      "allowedFunctionCalls": ["enableAutoDestroy"]
    }
  ]
}
```

Examples of **correct** code when using
`{ "allowedFunctionCalls": ["enableAutoDestroy"] }` option:

```js
/* eslint playwright/require-hook: ["error", { "allowedFunctionCalls": ["enableAutoDestroy"] }] */

enableAutoDestroy(test.afterEach);

test.beforeEach(initDatabase);
test.afterEach(tearDownDatabase);

test.describe('Foo', () => {
  test('always returns 42', () => {
    expect(global.getAnswer()).toBe(42);
  });
});
```
