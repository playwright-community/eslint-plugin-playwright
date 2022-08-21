import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/valid-expect';

const addSoft = (str: string) => str.replace('expect', 'expect.soft');

function withSoft<T extends string | { code: string }>(items: T[]) {
  return items.flatMap((item) => [
    item,
    typeof item === 'string'
      ? addSoft(item)
      : { ...(item as {}), code: addSoft(item.code) },
  ]);
}

const invalid = (code: string, messageId: string) => ({
  code,
  errors: [{ messageId }],
});

runRuleTester('valid-expect', rule, {
  valid: withSoft([
    'expect("something").toBe("else")',
    'expect(true).toBeDefined()',
    'expect(undefined).not.toBeDefined()',
    'expect([1, 2, 3]).toEqual([1, 2, 3])',
    'expect(1, "1 !== 2").toBe(2)',
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
  ]),
  invalid: withSoft([
    // Matcher not found
    invalid('expect(foo)', 'matcherNotFound'),
    invalid('expect("something")', 'matcherNotFound'),
    invalid('expect(foo).not', 'matcherNotFound'),
    // Matcher not called
    invalid('expect(foo).toBe', 'matcherNotCalled'),
    invalid('expect(foo).not.toBe', 'matcherNotCalled'),
    invalid('something(expect(foo).not.toBe)', 'matcherNotCalled'),
    // minArgs
    {
      code: 'expect().toBe(true)',
      errors: [{ messageId: 'notEnoughArgs', data: { amount: 1, s: '' } }],
    },
    {
      code: 'expect(foo).toBe(true)',
      options: [{ minArgs: 2 }],
      errors: [{ messageId: 'notEnoughArgs', data: { amount: 2, s: 's' } }],
    },
    // maxArgs
    {
      code: 'expect(foo, "bar", "baz").toBe(true)',
      errors: [{ messageId: 'tooManyArgs', data: { amount: 2, s: 's' } }],
    },
    {
      code: 'expect(foo, "bar").toBe(true)',
      options: [{ maxArgs: 1 }],
      errors: [{ messageId: 'tooManyArgs', data: { amount: 1, s: '' } }],
    },
    // Multiple errors
    {
      code: 'expect()',
      errors: [
        { messageId: 'matcherNotFound' },
        { messageId: 'notEnoughArgs', data: { amount: 1, s: '' } },
      ],
    },
    {
      code: 'expect().toHaveText',
      errors: [
        { messageId: 'matcherNotCalled' },
        { messageId: 'notEnoughArgs', data: { amount: 1, s: '' } },
      ],
    },
  ]),
});
