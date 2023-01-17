import rule from '../../src/rules/require-soft-assertions';
import { runRuleTester } from '../utils/rule-tester';

const messageId = 'requireSoft';

runRuleTester('require-soft-assertions', rule, {
  valid: [
    'expect.soft(page).toHaveTitle("baz")',
    'expect.soft(page.locator("foo")).toHaveText("bar")',
    'expect["soft"](foo).toBe("bar")',
    'expect[`soft`](bar).toHaveText("bar")',
    'expect.poll(() => foo).toBe("bar")',
    'expect["poll"](() => foo).toBe("bar")',
    'expect[`poll`](() => foo).toBe("bar")',
  ],
  invalid: [
    {
      code: 'expect(page).toHaveTitle("baz")',
      output: 'expect.soft(page).toHaveTitle("baz")',
      errors: [{ messageId, line: 1, column: 1, endColumn: 7 }],
    },
    {
      code: 'expect(page.locator("foo")).toHaveText("bar")',
      output: 'expect.soft(page.locator("foo")).toHaveText("bar")',
      errors: [{ messageId, line: 1, column: 1, endColumn: 7 }],
    },
    {
      code: 'await expect(page.locator("foo")).toHaveText("bar")',
      output: 'await expect.soft(page.locator("foo")).toHaveText("bar")',
      errors: [{ messageId, line: 1, column: 7, endColumn: 13 }],
    },
  ],
});
