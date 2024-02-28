# Disallow setup and teardown hooks (`no-hooks`)

Playwright provides global functions for setup and teardown tasks, which are
called before/after each test case and each test suite. The use of these hooks
promotes shared state between tests.

## Rule details

This rule reports for the following function calls:

- `beforeAll`
- `beforeEach`
- `afterAll`
- `afterEach`

Examples of **incorrect** code for this rule:

```js
/* eslint playwright/no-hooks: "error" */

function setupFoo(options) {
  /* ... */
}

function setupBar(options) {
  /* ... */
}

test.describe('foo', () => {
  let foo

  test.beforeEach(() => {
    foo = setupFoo()
  })

  test.afterEach(() => {
    foo = null
  })

  test('does something', () => {
    expect(foo.doesSomething()).toBe(true)
  })

  test.describe('with bar', () => {
    let bar

    test.beforeEach(() => {
      bar = setupBar()
    })

    test.afterEach(() => {
      bar = null
    })

    test('does something with bar', () => {
      expect(foo.doesSomething(bar)).toBe(true)
    })
  })
})
```

Examples of **correct** code for this rule:

```js
/* eslint playwright/no-hooks: "error" */

function setupFoo(options) {
  /* ... */
}

function setupBar(options) {
  /* ... */
}

test.describe('foo', () => {
  test('does something', () => {
    const foo = setupFoo()
    expect(foo.doesSomething()).toBe(true)
  })

  test('does something with bar', () => {
    const foo = setupFoo()
    const bar = setupBar()
    expect(foo.doesSomething(bar)).toBe(true)
  })
})
```

## Options

```json
{
  "playwright/no-hooks": [
    "error",
    {
      "allow": ["afterEach", "afterAll"]
    }
  ]
}
```

### `allow`

This array option controls which Playwright hooks are checked by this rule.
There are four possible values:

- `"beforeAll"`
- `"beforeEach"`
- `"afterAll"`
- `"afterEach"`

By default, none of these options are enabled (the equivalent of
`{ "allow": [] }`).

Examples of **incorrect** code for the `{ "allow": ["afterEach"] }` option:

```js
/* eslint playwright/no-hooks: ["error", { "allow": ["afterEach"] }] */

function setupFoo(options) {
  /* ... */
}

let foo

test.beforeEach(() => {
  foo = setupFoo()
})

test.afterEach(() => {
  playwright.resetModules()
})

test('foo does this', () => {
  // ...
})

test('foo does that', () => {
  // ...
})
```

Examples of **correct** code for the `{ "allow": ["afterEach"] }` option:

```js
/* eslint playwright/no-hooks: ["error", { "allow": ["afterEach"] }] */

function setupFoo(options) {
  /* ... */
}

test.afterEach(() => {
  playwright.resetModules()
})

test('foo does this', () => {
  const foo = setupFoo()
  // ...
})

test('foo does that', () => {
  const foo = setupFoo()
  // ...
})
```

## When Not To Use It

If you prefer using the setup and teardown hooks provided by Playwright, you can
safely disable this rule.
