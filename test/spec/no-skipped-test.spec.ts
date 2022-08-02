import rule from '../../src/rules/no-skipped-test';
import test from '@playwright/test';
import { runRuleTester } from '../utils/rule-tester';

const invalid = (code: string, output: string) => ({
  code,
  errors: [
    {
      messageId: 'noSkippedTest',
      suggestions: [{ messageId: 'removeSkippedTestAnnotation', output }],
    },
  ],
});

test('no-skipped-test', () => {
  runRuleTester(test.info().title, rule, {
    invalid: [
      invalid(
        'test.skip("skip this test", async ({ page }) => {});',
        'test("skip this test", async ({ page }) => {});'
      ),
      invalid(
        'test.describe.skip("skip this describe", () => {});',
        'test.describe("skip this describe", () => {});'
      ),
      invalid(
        'test.skip(browserName === "firefox", "Still working on it");',
        ''
      ),
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
});
