const { runRuleTester } = require('../lib/utils/rule-tester');
const rule = require('../lib/rules/no-wait-for-timeout');

const invalid = (code, output) => ({
  code,
  errors: [
    {
      messageId: 'noWaitForTimeout',
      suggestions: [{ messageId: 'removeWaitForTimeout', output }],
    },
  ],
});

runRuleTester('no-wait-for-timeout', rule, {
  invalid: [
    invalid(
      `async function fn() { await page.waitForTimeout(1000) }`,
      'async function fn() {  }'
    ),
    invalid(
      'async function fn() { return page.waitForTimeout(1000); }',
      'async function fn() {  }'
    ),
    invalid(
      'async function fn() { page.waitForTimeout(1000); }',
      'async function fn() {  }'
    ),
    invalid(
      '(async function() { await page.waitForTimeout(500); })();',
      '(async function() {  })();'
    ),
    invalid('page.waitForTimeout(1000);', ''),
    invalid('page.waitForTimeout(2000)', ''),
  ],
  valid: [
    'function waitForTimeout() {}',
    'async function fn() { await waitForTimeout(4343); }',
    '(async function() { await page.waitForSelector("#foo"); })();',
    'page.waitForSelector("#foo");',
  ],
});
