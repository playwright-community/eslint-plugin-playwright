import rule from '../../src/rules/no-skipped-test';
import { runRuleTester } from '../utils/rule-tester';

const messageId = 'removeSkippedTestAnnotation';

runRuleTester('no-skipped-test', rule, {
  invalid: [
    {
      code: 'test.skip("skip this test", async ({ page }) => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test("skip this test", async ({ page }) => {});',
            },
          ],
        },
      ],
    },
    {
      code: 'test["skip"]("skip this test", async ({ page }) => {});',
      errors: [
        {
          column: 6,
          endColumn: 12,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test("skip this test", async ({ page }) => {});',
            },
          ],
        },
      ],
    },
    {
      code: 'test[`skip`]("skip this test", async ({ page }) => {});',
      errors: [
        {
          column: 6,
          endColumn: 12,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test("skip this test", async ({ page }) => {});',
            },
          ],
        },
      ],
    },
    {
      code: 'test.describe.skip("skip this describe", () => {});',
      errors: [
        {
          column: 15,
          endColumn: 19,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test.describe("skip this describe", () => {});',
            },
          ],
        },
      ],
    },
    {
      code: 'test.describe["skip"]("skip this describe", () => {});',
      errors: [
        {
          column: 15,
          endColumn: 21,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test.describe("skip this describe", () => {});',
            },
          ],
        },
      ],
    },
    {
      code: 'test.describe[`skip`]("skip this describe", () => {});',
      errors: [
        {
          column: 15,
          endColumn: 21,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test.describe("skip this describe", () => {});',
            },
          ],
        },
      ],
    },
    {
      code: 'test.skip(browserName === "firefox");',
      errors: [
        {
          column: 1,
          endColumn: 37,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
    {
      code: 'test.skip(browserName === "firefox", "Still working on it");',
      errors: [
        {
          column: 1,
          endColumn: 60,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
    {
      code: 'test.describe.parallel("run in parallel", () => { test.skip(); expect(true).toBe(true); })',
      errors: [
        {
          column: 51,
          endColumn: 62,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output:
                'test.describe.parallel("run in parallel", () => {  expect(true).toBe(true); })',
            },
          ],
        },
      ],
    },
    {
      code: 'test.skip()',
      errors: [
        {
          column: 1,
          endColumn: 12,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
    {
      code: 'test["skip"]()',
      errors: [
        {
          column: 1,
          endColumn: 15,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
    {
      code: 'test[`skip`]()',
      errors: [
        {
          column: 1,
          endColumn: 15,
          line: 1,
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
  ],
  valid: [
    'test.describe("describe tests", () => {});',
    'test.describe.only("describe focus tests", () => {});',
    'test.describ["only"]("describe focus tests", () => {});',
    'test.describ[`only`]("describe focus tests", () => {});',
    'test("one", async ({ page }) => {});',
    'test.only(isMobile, "Settings page does not work in mobile yet");',
    'test.slow();',
    'test["slow"]();',
    'test[`slow`]();',
    'const skip = true;',
    'function skip() { return null };',
    'this.skip();',
    'this["skip"]();',
    'this[`skip`]();',
  ],
});
