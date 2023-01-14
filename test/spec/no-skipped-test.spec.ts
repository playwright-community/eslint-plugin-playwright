import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/no-skipped-test';

const messageId = 'removeSkippedTestAnnotation';

runRuleTester('no-skipped-test', rule, {
  invalid: [
    {
      code: 'test.skip("skip this test", async ({ page }) => {});',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test("skip this test", async ({ page }) => {});',
            },
          ],
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 10,
        },
      ],
    },
    {
      code: 'test["skip"]("skip this test", async ({ page }) => {});',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test("skip this test", async ({ page }) => {});',
            },
          ],
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 12,
        },
      ],
    },
    {
      code: 'test[`skip`]("skip this test", async ({ page }) => {});',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test("skip this test", async ({ page }) => {});',
            },
          ],
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 12,
        },
      ],
    },
    {
      code: 'test.describe.skip("skip this describe", () => {});',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test.describe("skip this describe", () => {});',
            },
          ],
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: 'test.describe["skip"]("skip this describe", () => {});',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test.describe("skip this describe", () => {});',
            },
          ],
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 21,
        },
      ],
    },
    {
      code: 'test.describe[`skip`]("skip this describe", () => {});',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output: 'test.describe("skip this describe", () => {});',
            },
          ],
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 21,
        },
      ],
    },
    {
      code: 'test.skip(browserName === "firefox");',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 37,
        },
      ],
    },
    {
      code: 'test.skip(browserName === "firefox", "Still working on it");',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 60,
        },
      ],
    },
    {
      code: 'test.describe.parallel("run in parallel", () => { test.skip(); expect(true).toBe(true); })',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [
            {
              messageId,
              output:
                'test.describe.parallel("run in parallel", () => {  expect(true).toBe(true); })',
            },
          ],
          line: 1,
          column: 51,
          endLine: 1,
          endColumn: 62,
        },
      ],
    },
    {
      code: 'test.skip()',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 12,
        },
      ],
    },
    {
      code: 'test["skip"]()',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 15,
        },
      ],
    },
    {
      code: 'test[`skip`]()',
      errors: [
        {
          messageId: 'noSkippedTest',
          suggestions: [{ messageId, output: '' }],
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 15,
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
