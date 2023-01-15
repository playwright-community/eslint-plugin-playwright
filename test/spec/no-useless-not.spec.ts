import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/no-useless-not';

const invalid = (oldMatcher: string, newMatcher: string) => ({
  code: `expect(locator).not.${oldMatcher}()`,
  output: `expect(locator).${newMatcher}()`,
  errors: [
    {
      messageId: 'noUselessNot',
      data: { old: oldMatcher, new: newMatcher },
      line: 1,
      column: 17,
      endColumn: 21 + oldMatcher.length,
    },
  ],
});

runRuleTester('no-useless-not', rule, {
  invalid: [
    {
      code: 'expect(locator).not.toBeVisible()',
      output: 'expect(locator).toBeHidden()',
      errors: [
        {
          messageId: 'noUselessNot',
          data: { old: 'toBeVisible', new: 'toBeHidden' },
          line: 1,
          column: 17,
          endColumn: 32,
        },
      ],
    },
    {
      code: 'expect(locator).not.toBeHidden()',
      output: 'expect(locator).toBeVisible()',
      errors: [
        {
          messageId: 'noUselessNot',
          data: { new: 'toBeVisible', old: 'toBeHidden' },
          line: 1,
          column: 17,
          endColumn: 31,
        },
      ],
    },
    {
      code: 'expect(locator).not.toBeEnabled()',
      output: 'expect(locator).toBeDisabled()',
      errors: [
        {
          messageId: 'noUselessNot',
          data: { old: 'toBeEnabled', new: 'toBeDisabled' },
          line: 1,
          column: 17,
          endColumn: 32,
        },
      ],
    },
    {
      code: 'expect(locator).not.toBeDisabled()',
      output: 'expect(locator).toBeEnabled()',
      errors: [
        {
          messageId: 'noUselessNot',
          data: { old: 'toBeDisabled', new: 'toBeEnabled' },
          line: 1,
          column: 17,
          endColumn: 33,
        },
      ],
    },
    {
      code: 'expect(locator)["not"]["toBeHidden"]()',
      output: 'expect(locator)["toBeVisible"]()',
      errors: [
        {
          messageId: 'noUselessNot',
          line: 1,
          column: 17,
          endColumn: 36,
        },
      ],
    },
    {
      code: 'expect(locator)[`not`][`toBeHidden`]()',
      output: 'expect(locator)[`toBeVisible`]()',
      errors: [
        {
          messageId: 'noUselessNot',
          line: 1,
          column: 17,
          endColumn: 36,
        },
      ],
    },
    {
      code: 'expect.soft(locator).not.toBeVisible()',
      output: 'expect.soft(locator).toBeHidden()',
      errors: [
        {
          messageId: 'noUselessNot',
          line: 1,
          column: 22,
          endColumn: 37,
        },
      ],
    },
    {
      code: 'expect.poll(() => locator)[`not`][`toBeHidden`]()',
      output: 'expect.poll(() => locator)[`toBeVisible`]()',
      errors: [
        {
          messageId: 'noUselessNot',
          line: 1,
          column: 28,
          endColumn: 47,
        },
      ],
    },
    // Incomplete call expression
    {
      code: 'expect(locator).not.toBeHidden',
      output: 'expect(locator).toBeVisible',
      errors: [
        {
          messageId: 'noUselessNot',
          line: 1,
          column: 17,
          endColumn: 31,
        },
      ],
    },
  ],
  valid: [
    'expect(locator).toBeVisible()',
    'expect(locator).toBeHidden()',
    'expect(locator).toBeEnabled()',
    'expect(locator).toBeDisabled()',
    'expect.soft(locator).toBeEnabled()',
    'expect.poll(() => locator).toBeDisabled()',
    'expect(locator)[`toBeEnabled`]()',
    'expect(locator)["toBeDisabled"]()',
    // Incomplete call expression
    'expect(locator).toBeVisible',
    'expect(locator).toBeEnabled',
    // Doesn't impact non-complimentary matchers
    "expect(locator).not.toHaveText('foo')",
    'expect(locator).not.toBeChecked()',
    'expect(locator).not.toBeChecked({ checked: false })',
    'expect(locator).not.toBeFocused()',
  ],
});
