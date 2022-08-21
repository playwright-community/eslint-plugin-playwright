import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/valid-expect';

const invalid = (code: string, messageId: string) => ({
  code,
  errors: [{ messageId }],
});

runRuleTester('valid-expect', rule, {
  valid: [
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
      options: [{ maxArgs: 2 }],
    },
  ],
  invalid: [
    // Matcher not called,
    invalid('expect()', 'matcherNotFound'),
    invalid('expect(foo)', 'matcherNotFound'),
    invalid('expect("something")', 'matcherNotFound'),
    invalid('expect(foo).not', 'matcherNotFound'),
    invalid('expect("something")', 'matcherNotFound'),
    // Matcher not called
    invalid('expect(foo).toBe', 'matcherNotCalled'),
    invalid('expect(foo).not.toBe', 'matcherNotCalled'),
    // minArgs
    {
      code: 'expect().toBe(true)',
      errors: [{ messageId: 'notEnoughArgs', data: { amount: 1 } }],
    },
    {
      code: 'expect(foo).toBe(true)',
      options: [{ minArgs: 2 }],
      errors: [{ messageId: 'notEnoughArgs', data: { amount: 2 } }],
    },
    // maxArgs
    {
      code: 'expect(foo, "bar", "baz").toBe(true)',
      errors: [{ messageId: 'tooManyArgs', data: { amount: 2 } }],
    },
    {
      code: 'expect(foo, "bar").toBe(true)',
      options: [{ maxArgs: 1 }],
      errors: [{ messageId: 'tooManyArgs', data: { amount: 1 } }],
    },
  ],
});
