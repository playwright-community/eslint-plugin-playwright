# Enforce valid titles (`valid-title`)

Checks that the title of test blocks are valid by ensuring that titles are:

- not empty,
- is a string,
- not prefixed with their block name,
- have no leading or trailing spaces

## Rule details

### `emptyTitle`

An empty title is not informative, and serves little purpose.

Examples of **incorrect** code for this rule:

```javascript
test.describe('', () => {})
test.describe('foo', () => {
  test('', () => {})
})
test('', () => {})
```

Examples of **correct** code for this rule:

```javascript
test.describe('foo', () => {})
test.describe('foo', () => {
  test('bar', () => {})
})
test('foo', () => {})
```

### `titleMustBeString`

Titles for `describe` and `test` blocks should always be a string; you can
disable this with the `ignoreTypeOfDescribeName` and `ignoreTypeOfTestName`
options.

Examples of **incorrect** code for this rule:

```javascript
test(123, () => {})
test.describe(String(/.+/), () => {})
test.describe(myFunction, () => {})
test.describe(6, function () {})

const title = 123
test(title, () => {})
```

Examples of **correct** code for this rule:

```javascript
test('is a string', () => {})
test.describe('is a string', () => {})

const title = 'is a string'
test(title, () => {})
```

Examples of **correct** code when `ignoreTypeOfDescribeName` is `true`:

```javascript
test('is a string', () => {})
test.describe('is a string', () => {})

test.describe(String(/.+/), () => {})
test.describe(myFunction, () => {})
test.describe(6, function () {})
```

Examples of **correct** code when `ignoreTypeOfTestName` is `true`:

```javascript
const myTestName = 'is a string'

test(String(/.+/), () => {})
test(myFunction, () => {})
test(myTestName, () => {})
test(6, function () {})
```

### `duplicatePrefix`

A `describe` / `test` block should not start with `duplicatePrefix`

Examples of **incorrect** code for this rule

```javascript
test('test foo', () => {})

test.describe('foo', () => {
  test('test bar', () => {})
})

test.describe('describe foo', () => {
  test('bar', () => {})
})
```

Examples of **correct** code for this rule

```javascript
test('foo', () => {})

test.describe('foo', () => {
  test('bar', () => {})
})
```

### `accidentalSpace`

A `describe` / `test` block should not contain accidentalSpace, but can be
turned off via the `ignoreSpaces` option:

Examples of **incorrect** code for this rule

```javascript
test(' foo', () => {})

test.describe('foo', () => {
  test(' bar', () => {})
})

test.describe(' foo', () => {
  test('bar', () => {})
})

test.describe('foo  ', () => {
  test('bar', () => {})
})
```

Examples of **correct** code for this rule

```javascript
test('foo', () => {})

test.describe('foo', () => {
  test('bar', () => {})
})
```

## Options

```ts
interface Options {
  ignoreSpaces?: boolean
  ignoreTypeOfStepName?: boolean
  ignoreTypeOfTestName?: boolean
  ignoreTypeOfDescribeName?: boolean
  disallowedWords?: string[]
  mustNotMatch?: Partial<Record<'describe' | 'test', string>> | string
  mustMatch?: Partial<Record<'describe' | 'test', string>> | string
}
```

#### `ignoreSpaces`

Default: `false`

When enabled, the leading and trailing spaces won't be checked.

#### `ignoreTypeOfStepName`

Default: `true`

When enabled, the type of the first argument to `test.step` blocks won't be
checked.

#### `ignoreTypeOfDescribeName`

Default: `false`

When enabled, the type of the first argument to `describe` blocks won't be
checked.

#### `disallowedWords`

Default: `[]`

A string array of words that are not allowed to be used in test titles. Matching
is not case-sensitive, and looks for complete words:

Examples of **incorrect** code when using `disallowedWords`:

```javascript
// with disallowedWords: ['correct', 'all', 'every', 'properly']
test.describe('the correct way to do things', () => {})
test.describe('every single one of them', () => {})
test('has ALL the things', () => {})
test(`that the value is set properly`, () => {})
```

Examples of **correct** code when using `disallowedWords`:

```javascript
// with disallowedWords: ['correct', 'all', 'every', 'properly']
test('correctly sets the value', () => {})
test('that everything is as it should be', () => {})
test.describe('the proper way to handle things', () => {})
```

#### `mustMatch` & `mustNotMatch`

Defaults: `{}`

Allows enforcing that titles must match or must not match a given Regular
Expression, with an optional message. An object can be provided to apply
different Regular Expressions (with optional messages) to specific Playwright
test function groups (`describe`, `test`).

Examples of **incorrect** code when using `mustMatch`:

```javascript
// with mustMatch: '^that'
test.describe('the correct way to do things', () => {})
test('this there!', () => {})

// with mustMatch: { test: '^that' }
test.describe('the tests that will be run', () => {})
test('the stuff works', () => {})
test('errors that are thrown have messages', () => {})
```

Examples of **correct** code when using `mustMatch`:

```javascript
// with mustMatch: '^that'
test.describe('that thing that needs to be done', () => {})
test('that this there!', () => {})

// with mustMatch: { test: '^that' }
test.describe('the tests will be run', () => {})
test('that the stuff works', () => {})
```

Optionally you can provide a custom message to show for a particular matcher by
using a tuple at any level where you can provide a matcher:

```javascript
const prefixes = ['when', 'with', 'without', 'if', 'unless', 'for']
const prefixesList = prefixes.join('  - \n')

module.exports = {
  rules: {
    'playwright/valid-title': [
      'error',
      {
        mustNotMatch: ['\\.$', 'Titles should not end with a full-stop'],
        mustMatch: {
          describe: [
            new RegExp(`^(?:[A-Z]|\\b(${prefixes.join('|')})\\b`, 'u').source,
            `Describe titles should either start with a capital letter or one of the following prefixes: ${prefixesList}`,
          ],
          test: /[^A-Z]/u.source,
        },
      },
    ],
  },
}
```
