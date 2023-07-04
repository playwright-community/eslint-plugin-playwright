import rule from '../../src/rules/valid-expect';
import { runRuleTester } from '../utils/rule-tester';

runRuleTester('valid-expect', rule, {
  invalid: [
    // Matcher not found
    {
      code: 'expect(foo)',
      errors: [
        { column: 1, endColumn: 12, line: 1, messageId: 'matcherNotFound' },
      ],
    },
    {
      code: 'softExpect(foo)',
      errors: [
        { column: 1, endColumn: 16, line: 1, messageId: 'matcherNotFound' },
      ],
    },
    {
      code: 'expect(foo).not',
      errors: [
        { column: 1, endColumn: 12, line: 1, messageId: 'matcherNotFound' },
      ],
    },
    {
      code: 'expect.soft(foo)',
      errors: [
        { column: 1, endColumn: 17, line: 1, messageId: 'matcherNotFound' },
      ],
    },
    {
      code: 'expect.soft(foo).not',
      errors: [
        { column: 1, endColumn: 17, line: 1, messageId: 'matcherNotFound' },
      ],
    },
    {
      code: 'expect["soft"](foo)["not"]',
      errors: [
        { column: 1, endColumn: 20, line: 1, messageId: 'matcherNotFound' },
      ],
    },
    {
      code: 'expect.poll(foo)',
      errors: [
        { column: 1, endColumn: 17, line: 1, messageId: 'matcherNotFound' },
      ],
    },
    {
      code: 'expect.poll(foo).not',
      errors: [
        { column: 1, endColumn: 17, line: 1, messageId: 'matcherNotFound' },
      ],
    },
    {
      code: 'expect[`poll`](foo)[`not`]',
      errors: [
        { column: 1, endColumn: 20, line: 1, messageId: 'matcherNotFound' },
      ],
    },
    // Matcher not called
    {
      code: 'expect(foo).toBe',
      errors: [
        { column: 13, endColumn: 17, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'expect(foo).not.toBe',
      errors: [
        { column: 17, endColumn: 21, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'expect(foo)["not"].toBe',
      errors: [
        { column: 20, endColumn: 24, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'something(expect(foo).not.toBe)',
      errors: [
        { column: 27, endColumn: 31, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'expect.soft(foo).toEqual',
      errors: [
        { column: 18, endColumn: 25, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'expect.soft(foo).not.toEqual',
      errors: [
        { column: 22, endColumn: 29, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'something(expect.soft(foo).not.toEqual)',
      errors: [
        { column: 32, endColumn: 39, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'expect.poll(() => foo).toBe',
      errors: [
        { column: 24, endColumn: 28, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'expect.poll(() => foo).not.toBe',
      errors: [
        { column: 28, endColumn: 32, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'expect["poll"](() => foo)["not"][`toBe`]',
      errors: [
        { column: 34, endColumn: 40, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    {
      code: 'something(expect["poll"](() => foo)["not"][`toBe`])',
      errors: [
        { column: 44, endColumn: 50, line: 1, messageId: 'matcherNotCalled' },
      ],
    },
    // minArgs
    {
      code: 'expect().toContain(true)',
      errors: [
        {
          column: 1,
          data: { amount: 1, s: '' },
          endColumn: 9,
          line: 1,
          messageId: 'notEnoughArgs',
        },
      ],
    },
    {
      code: 'expect(foo).toBe(true)',
      errors: [
        {
          column: 1,
          data: { amount: 2, s: 's' },
          endColumn: 12,
          line: 1,
          messageId: 'notEnoughArgs',
        },
      ],
      options: [{ minArgs: 2 }],
    },
    // maxArgs
    {
      code: 'expect(foo, "bar", "baz").toBe(true)',
      errors: [
        {
          column: 1,
          data: { amount: 2, s: 's' },
          endColumn: 26,
          line: 1,
          messageId: 'tooManyArgs',
        },
      ],
    },
    {
      code: 'expect(foo, "bar").toBe(true)',
      errors: [
        {
          column: 1,
          data: { amount: 1, s: '' },
          endColumn: 19,
          line: 1,
          messageId: 'tooManyArgs',
        },
      ],
      options: [{ maxArgs: 1 }],
    },
    // Multiple errors
    {
      code: 'expect()',
      errors: [
        {
          column: 1,
          endColumn: 9,
          line: 1,
          messageId: 'matcherNotFound',
        },
        {
          column: 1,
          data: { amount: 1, s: '' },
          endColumn: 9,
          line: 1,
          messageId: 'notEnoughArgs',
        },
      ],
    },
    {
      code: 'expect().toHaveText',
      errors: [
        {
          column: 1,
          data: { amount: 1, s: '' },
          endColumn: 9,
          line: 1,
          messageId: 'notEnoughArgs',
        },
        {
          column: 10,
          endColumn: 20,
          line: 1,
          messageId: 'matcherNotCalled',
        },
      ],
    },
  ],
  valid: [
    'expectPayButtonToBeEnabled()',
    'expect("something").toBe("else")',
    'softExpect("something").toBe("else")',
    'expect.soft("something").toBe("else")',
    'expect.poll(() => "something").toBe("else")',
    'expect(true).toBeDefined()',
    'expect(undefined).not.toBeDefined()',
    'expect([1, 2, 3]).toEqual([1, 2, 3])',
    'expect(1, "1 !== 2").toBe(2)',
    'expect.soft(1, "1 !== 2").toBe(2)',
    'expect["soft"](1, "1 !== 2")["toBe"](2)',
    'expect[`poll`](() => 1, { message: "1 !== 2" })[`toBe`](2)',
    'expect[`poll`](() => 1, { message: "1 !== 2" })[`toBe`](2)',
    // minArgs
    {
      code: 'expect(1, "1 !== 2").toBe(2)',
      options: [{ minArgs: 2 }],
    },
    {
      code: 'expect(1, 2, 3).toBe(4)',
      options: [{ minArgs: 3 }],
    },
    // maxArgs
    {
      code: 'expect(1).toBe(2)',
      options: [{ maxArgs: 1 }],
    },
    {
      code: 'expect(1, 2, 3).toBe(4)',
      options: [{ maxArgs: 3 }],
    },
  ],
});
