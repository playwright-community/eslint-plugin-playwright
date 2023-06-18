import rule from '../../src/rules/no-useless-await';
import { runRuleTester } from '../utils/rule-tester';

const messageId = 'noUselessAwait';

runRuleTester('no-useless-await', rule, {
  invalid: [
    {
      code: 'page.waitForLoadState("useless-await")',
      errors: [{ column: 23, endColumn: 36, line: 1, messageId }],
    },
    {
      code: 'page.waitForURL(url, { waitUntil: "useless-await" })',
      errors: [{ column: 35, endColumn: 48, line: 1, messageId }],
    },
    {
      code: 'page["waitForURL"](url, { waitUntil: "useless-await" })',
      errors: [{ column: 38, endColumn: 51, line: 1, messageId }],
    },
    {
      code: 'page[`waitForURL`](url, { waitUntil: "useless-await" })',
      errors: [{ column: 38, endColumn: 51, line: 1, messageId }],
    },
    {
      code: 'page.goto(url, { waitUntil: "useless-await" })',
      errors: [{ column: 29, endColumn: 42, line: 1, messageId }],
    },
    {
      code: 'page.reload(url, { waitUntil: "useless-await" })',
      errors: [{ column: 31, endColumn: 44, line: 1, messageId }],
    },
    {
      code: 'page.setContent(url, { waitUntil: "useless-await" })',
      errors: [{ column: 35, endColumn: 48, line: 1, messageId }],
    },
    {
      code: 'page.goBack(url, { waitUntil: "useless-await" })',
      errors: [{ column: 31, endColumn: 44, line: 1, messageId }],
    },
    {
      code: 'page.goForward(url, { waitUntil: "useless-await" })',
      errors: [{ column: 34, endColumn: 47, line: 1, messageId }],
    },
  ],
  valid: [
    'await foo()',
    'await foo(".my-element")',
    'await foo.bar()',
    'await foo.bar(".my-element")',

    'page.getByRole(".my-element")',
    'page.locator(".my-element")',

    'await page.waitForLoadState({ waitUntil: "load" })',
    'await page.waitForUrl(url, { waitUntil: "load" })',
  ],
});
