const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-focused-test');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

const wrapInTest = (name, input) => `test('verify noFocusedTest rule with ${name}', async () => { ${input} })`;

const invalid = (name, code, output) => ({
  code: wrapInTest(name, code),
  errors: [
    {
      messageId: 'noFocusedTest',
      suggestions: [{ messageId: 'removeFocusedTestAnnotation', output: wrapInTest(name, output) }],
    },
  ],
});

const valid = (name, code) => ({
  code: wrapInTest(name, code),
});

new RuleTester().run('no-focused-test', rule, {
  invalid: [
    invalid(
      'test.describe.only',
      'test.describe.only("skip this describe", () => {});',
      'test.describe("skip this describe", () => {});'
    ),

    invalid(
      'test.describe.parallel.only',
      'test.describe.parallel.only("skip this describe", () => {});',
      'test.describe.parallel("skip this describe", () => {});'
    ),

    invalid(
      'test.describe.serial.only',
      'test.describe.serial.only("skip this describe", () => {});',
      'test.describe.serial("skip this describe", () => {});'
    ),

    invalid(
      'test.only',
      'test.only("skip this test", async ({ page }) => {});',
      'test("skip this test", async ({ page }) => {});'
    ),
  ],
  valid: [
    valid('test.describe without only annotation', 'test.describe("describe tests", () => {});'),

    valid('test.describe with skip annotation', 'test.describe.skip("describe tests", () => {});'),

    valid('test without only annotation', 'test("one", async ({ page }) => {});'),

    valid('test.fixme', 'test.fixme(isMobile, "Settings page does not work in mobile yet");'),

    valid('test.slow', 'test.slow();'),

    valid('constant only', 'const only = true;'),

    valid('function only', 'function only() { return null };'),

    valid('method only', 'this.only();'),
  ],
});
