import rule from '../../src/rules/no-useless-not';
import { runRuleTester } from '../utils/rule-tester';

runRuleTester('no-useless-not', rule, {
  invalid: [
    {
      code: 'expect(locator).not.toBeVisible()',
      errors: [
        {
          column: 17,
          data: { new: 'toBeHidden', old: 'toBeVisible' },
          endColumn: 32,
          line: 1,
          messageId: 'noUselessNot',
        },
      ],
      output: 'expect(locator).toBeHidden()',
    },
    {
      code: 'expect(locator).not.toBeHidden()',
      errors: [
        {
          column: 17,
          data: { new: 'toBeVisible', old: 'toBeHidden' },
          endColumn: 31,
          line: 1,
          messageId: 'noUselessNot',
        },
      ],
      output: 'expect(locator).toBeVisible()',
    },
    {
      code: 'expect(locator).not.toBeEnabled()',
      errors: [
        {
          column: 17,
          data: { new: 'toBeDisabled', old: 'toBeEnabled' },
          endColumn: 32,
          line: 1,
          messageId: 'noUselessNot',
        },
      ],
      output: 'expect(locator).toBeDisabled()',
    },
    {
      code: 'expect(locator).not.toBeDisabled()',
      errors: [
        {
          column: 17,
          data: { new: 'toBeEnabled', old: 'toBeDisabled' },
          endColumn: 33,
          line: 1,
          messageId: 'noUselessNot',
        },
      ],
      output: 'expect(locator).toBeEnabled()',
    },
    {
      code: 'expect(locator)["not"]["toBeHidden"]()',
      errors: [
        {
          column: 17,
          endColumn: 36,
          line: 1,
          messageId: 'noUselessNot',
        },
      ],
      output: 'expect(locator)["toBeVisible"]()',
    },
    {
      code: 'expect(locator)[`not`][`toBeHidden`]()',
      errors: [
        {
          column: 17,
          endColumn: 36,
          line: 1,
          messageId: 'noUselessNot',
        },
      ],
      output: 'expect(locator)[`toBeVisible`]()',
    },
    {
      code: 'expect.soft(locator).not.toBeVisible()',
      errors: [
        {
          column: 22,
          endColumn: 37,
          line: 1,
          messageId: 'noUselessNot',
        },
      ],
      output: 'expect.soft(locator).toBeHidden()',
    },
    {
      code: 'expect.poll(() => locator)[`not`][`toBeHidden`]()',
      errors: [
        {
          column: 28,
          endColumn: 47,
          line: 1,
          messageId: 'noUselessNot',
        },
      ],
      output: 'expect.poll(() => locator)[`toBeVisible`]()',
    },
    // Global aliases
    {
      code: 'assert(locator).not.toBeVisible()',
      errors: [
        {
          column: 17,
          data: { new: 'toBeHidden', old: 'toBeVisible' },
          endColumn: 32,
          line: 1,
          messageId: 'noUselessNot',
        },
      ],
      output: 'assert(locator).toBeHidden()',
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
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
    'expect(locator).not.toBeHidden',
    // Doesn't impact non-complimentary matchers
    "expect(locator).not.toHaveText('foo')",
    'expect(locator).not.toBeChecked()',
    'expect(locator).not.toBeChecked({ checked: false })',
    'expect(locator).not.toBeFocused()',
    // Global aliases
    {
      code: 'assert(locator).toBeVisible()',
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
    },
  ],
});
