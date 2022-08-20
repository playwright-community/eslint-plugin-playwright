import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/no-useless-not';

const invalid = (oldMatcher: string, newMatcher: string) => ({
  code: `expect(locator).not.${oldMatcher}()`,
  output: `expect(locator).${newMatcher}()`,
  errors: [
    {
      messageId: 'noUselessNot',
      data: { old: oldMatcher, new: newMatcher },
    },
  ],
});

runRuleTester('no-eval', rule, {
  invalid: [
    invalid('toBeVisible', 'toBeHidden'),
    invalid('toBeHidden', 'toBeVisible'),
    invalid('toBeEnabled', 'toBeDisabled'),
    invalid('toBeDisabled', 'toBeEnabled'),
    // Incomplete call expression
    {
      code: 'expect(locator).not.toBeHidden',
      output: 'expect(locator).toBeVisible',
      errors: [{ messageId: 'noUselessNot' }],
    },
  ],
  valid: [
    'expect(locator).toBeVisible()',
    'expect(locator).toBeHidden()',
    'expect(locator).toBeEnabled()',
    'expect(locator).toBeDisabled()',
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
