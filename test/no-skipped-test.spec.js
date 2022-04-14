const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-skipped-test');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

const invalid = (code, output) => ({
  code,
  errors: [
    {
      messageId: 'noSkippedTest',
      suggestions: [{ messageId: 'removeSkippedTestAnnotation', output }],
    },
  ],
});

new RuleTester().run('no-skipped-test', rule, {
  invalid: [
    invalid('test.skip("skip this test", async ({ page }) => {});', 'test("skip this test", async ({ page }) => {});'),
    invalid('test.describe.skip("skip this describe", () => {});', 'test.describe("skip this describe", () => {});'),
    invalid('test.skip(browserName === "firefox", "Still working on it");', ''),
    invalid(
      'test.describe.parallel("run in parallel", () => { test.skip(); expect(true).toBe(true); })',
      'test.describe.parallel("run in parallel", () => {  expect(true).toBe(true); })'
    ),
    invalid('test.skip();', ''),
    invalid('test.skip()', ''),
  ],
  valid: [
    'test.describe("describe tests", () => {});',
    'test.describe.only("describe focus tests", () => {});',
    'test("one", async ({ page }) => {});',
    'test.only(isMobile, "Settings page does not work in mobile yet");',
    'test.slow();',
    'const skip = true;',
    'function skip() { return null };',
    'this.skip();',
  ],
});
