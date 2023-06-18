import { runRuleTester, test } from '../utils/rule-tester';
import rule from '../../src/rules/no-page-pause';

const messageId = 'noNetworkidle';

runRuleTester('no-networkidle', rule, {
  valid: [
    'foo("networkidle")',
    'foo(url, { waitUntil: "networkidle" })',
    'foo.bar("networkidle")',
    'foo.bar(url, { waitUntil: "networkidle" })',
    'page.hi("networkidle")',
    'page.hi(url, { waitUntil: "networkidle" })',
    'frame.hi("networkidle")',
    'frame.hi(url, { waitUntil: "networkidle" })',

    // Other options are valid
    'page.waitForLoadState({ waitUntil: "load" })',
    'page.waitForUrl(url, { waitUntil: "load" })',
  ],
  invalid: [
    {
      code: 'page.waitForLoadState("networkidle")',
      errors: [{ messageId, line: 1, column: 34, endColumn: 46 }],
    },
    {
      code: 'page.waitForUrl(url, { waitUntil: "networkidle" })',
      errors: [{ messageId, line: 1, column: 34, endColumn: 51 }],
    },
    {
      code: 'page["waitForUrl"](url, { waitUntil: "networkidle" })',
      errors: [{ messageId, line: 1, column: 34, endColumn: 51 }],
    },
    {
      code: 'page[`waitForUrl`](url, { waitUntil: "networkidle" })',
      errors: [{ messageId, line: 1, column: 34, endColumn: 51 }],
    },
    {
      code: 'page.goto(url, { waitUntil: "networkidle" })',
      errors: [{ messageId, line: 1, column: 34, endColumn: 51 }],
    },
    {
      code: 'page.reload(url, { waitUntil: "networkidle" })',
      errors: [{ messageId, line: 1, column: 34, endColumn: 51 }],
    },
    {
      code: 'page.setContent(url, { waitUntil: "networkidle" })',
      errors: [{ messageId, line: 1, column: 34, endColumn: 51 }],
    },
    {
      code: 'page.goBack(url, { waitUntil: "networkidle" })',
      errors: [{ messageId, line: 1, column: 34, endColumn: 51 }],
    },
    {
      code: 'page.goForward(url, { waitUntil: "networkidle" })',
      errors: [{ messageId, line: 1, column: 34, endColumn: 51 }],
    },
  ],
});
