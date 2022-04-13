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

const valid = (code) => ({
  code,
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
    valid('test.describe("describe tests", () => {});'),

    valid('test.describe.skip("describe tests", () => {});'),

    valid('test("one", async ({ page }) => {});'),

    valid('test.fixme(isMobile, "Settings page does not work in mobile yet");'),

    valid('test.slow();'),

    valid('const only = true;'),

    valid('function only() { return null };'),

    valid('this.only();'),
  ],
});
