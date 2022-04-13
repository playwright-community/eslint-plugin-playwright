const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-focused-test');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

const invalid = (code, output) => ({
  code,
  errors: [
    {
      messageId: 'noFocusedTest',
      suggestions: [{ messageId: 'removeFocusedTestAnnotation', output }],
    },
  ],
});

new RuleTester().run('no-focused-test', rule, {
  invalid: [
    invalid(
      'test.describe.only("skip this describe", () => {});',
      'test.describe("skip this describe", () => {});'
    ),

    invalid(
      'test.describe.parallel.only("skip this describe", () => {});',
      'test.describe.parallel("skip this describe", () => {});'
    ),

    invalid(
      'test.describe.serial.only("skip this describe", () => {});',
      'test.describe.serial("skip this describe", () => {});'
    ),

    invalid(
      'test.only("skip this test", async ({ page }) => {});',
      'test("skip this test", async ({ page }) => {});'
    ),
  ],
  valid: [
    'test.describe("describe tests", () => {});',
    'test.describe.skip("describe tests", () => {});',
    'test("one", async ({ page }) => {});',
    'test.fixme(isMobile, "Settings page does not work in mobile yet");',
    'test.slow();',
    'const only = true;',
    'function only() { return null };',
    'this.only();',
  ],
});
