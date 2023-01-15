import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/valid-expect';

runRuleTester('valid-expect', rule, {
  valid: [
    'expect("something").toBe("else")',
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
  invalid: [
    // Matcher not found
    {
      code: 'expect(foo)',
      errors: [
        { messageId: 'matcherNotFound', line: 1, column: 1, endColumn: 12 },
      ],
    },
    {
      code: 'expect(foo).not',
      errors: [
        { messageId: 'matcherNotFound', line: 1, column: 1, endColumn: 12 },
      ],
    },
    {
      code: 'expect.soft(foo)',
      errors: [
        { messageId: 'matcherNotFound', line: 1, column: 1, endColumn: 17 },
      ],
    },
    {
      code: 'expect.soft(foo).not',
      errors: [
        { messageId: 'matcherNotFound', line: 1, column: 1, endColumn: 17 },
      ],
    },
    {
      code: 'expect["soft"](foo)["not"]',
      errors: [
        { messageId: 'matcherNotFound', line: 1, column: 1, endColumn: 20 },
      ],
    },
    {
      code: 'expect.poll(foo)',
      errors: [
        { messageId: 'matcherNotFound', line: 1, column: 1, endColumn: 17 },
      ],
    },
    {
      code: 'expect.poll(foo).not',
      errors: [
        { messageId: 'matcherNotFound', line: 1, column: 1, endColumn: 17 },
      ],
    },
    {
      code: 'expect[`poll`](foo)[`not`]',
      errors: [
        { messageId: 'matcherNotFound', line: 1, column: 1, endColumn: 20 },
      ],
    },
    // Matcher not called
    {
      code: 'expect(foo).toBe',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 13, endColumn: 17 },
      ],
    },
    {
      code: 'expect(foo).not.toBe',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 17, endColumn: 21 },
      ],
    },
    {
      code: 'expect(foo)["not"].toBe',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 20, endColumn: 24 },
      ],
    },
    {
      code: 'something(expect(foo).not.toBe)',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 27, endColumn: 31 },
      ],
    },
    {
      code: 'expect.soft(foo).toEqual',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 18, endColumn: 25 },
      ],
    },
    {
      code: 'expect.soft(foo).not.toEqual',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 22, endColumn: 29 },
      ],
    },
    {
      code: 'something(expect.soft(foo).not.toEqual)',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 32, endColumn: 39 },
      ],
    },
    {
      code: 'expect.poll(() => foo).toBe',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 24, endColumn: 28 },
      ],
    },
    {
      code: 'expect.poll(() => foo).not.toBe',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 28, endColumn: 32 },
      ],
    },
    {
      code: 'expect["poll"](() => foo)["not"][`toBe`]',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 34, endColumn: 40 },
      ],
    },
    {
      code: 'something(expect["poll"](() => foo)["not"][`toBe`])',
      errors: [
        { messageId: 'matcherNotCalled', line: 1, column: 44, endColumn: 50 },
      ],
    },
    // minArgs
    {
      code: 'expect().toContain(true)',
      errors: [
        {
          messageId: 'notEnoughArgs',
          data: { amount: 1, s: '' },
          line: 1,
          column: 1,
          endColumn: 9,
        },
      ],
    },
    {
      code: 'expect(foo).toBe(true)',
      options: [{ minArgs: 2 }],
      errors: [
        {
          messageId: 'notEnoughArgs',
          data: { amount: 2, s: 's' },
          line: 1,
          column: 1,
          endColumn: 12,
        },
      ],
    },
    // maxArgs
    {
      code: 'expect(foo, "bar", "baz").toBe(true)',
      errors: [
        {
          messageId: 'tooManyArgs',
          data: { amount: 2, s: 's' },
          line: 1,
          column: 1,
          endColumn: 26,
        },
      ],
    },
    {
      code: 'expect(foo, "bar").toBe(true)',
      options: [{ maxArgs: 1 }],
      errors: [
        {
          messageId: 'tooManyArgs',
          data: { amount: 1, s: '' },
          line: 1,
          column: 1,
          endColumn: 19,
        },
      ],
    },
    // Multiple errors
    {
      code: 'expect()',
      errors: [
        {
          messageId: 'matcherNotFound',
          line: 1,
          column: 1,
          endColumn: 9,
        },
        {
          messageId: 'notEnoughArgs',
          data: { amount: 1, s: '' },
          line: 1,
          column: 1,
          endColumn: 9,
        },
      ],
    },
    {
      code: 'expect().toHaveText',
      errors: [
        {
          messageId: 'notEnoughArgs',
          data: { amount: 1, s: '' },
          line: 1,
          column: 1,
          endColumn: 9,
        },
        {
          messageId: 'matcherNotCalled',
          line: 1,
          column: 10,
          endColumn: 20,
        },
      ],
    },
  ],
});
