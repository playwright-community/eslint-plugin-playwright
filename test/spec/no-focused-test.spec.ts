import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/no-focused-test';

const messageId = 'noFocusedTest';

runRuleTester('no-focused-test', rule, {
  valid: [
    'test.describe("describe tests", () => {});',
    'test.describe.skip("describe tests", () => {});',
    'test("one", async ({code: page }) => {});',
    'test.fixme(isMobile, "Settings page does not work in mobile yet");',
    'test["fixme"](isMobile, "Settings page does not work in mobile yet");',
    'test[`fixme`](isMobile, "Settings page does not work in mobile yet");',
    'test.slow();',
    'test["slow"]();',
    'test[`slow`]();',
    'const only = true;',
    'function only() {code: return null };',
    'this.only();',
  ],
  invalid: [
    {
      code: 'test.describe.only("skip this describe", () => {});',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'suggestRemoveOnly',
              output: 'test.describe("skip this describe", () => {});',
            },
          ],
          line: 1,
          column: 15,
          endColumn: 19,
        },
      ],
    },
    {
      code: 'test.describe["only"]("skip this describe", () => {});',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'suggestRemoveOnly',
              output: 'test.describe("skip this describe", () => {});',
            },
          ],
          line: 1,
          column: 15,
          endColumn: 21,
        },
      ],
    },
    {
      code: 'test["describe"][`only`]("skip this describe", () => {});',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'suggestRemoveOnly',
              output: 'test["describe"]("skip this describe", () => {});',
            },
          ],
          line: 1,
          column: 18,
          endColumn: 24,
        },
      ],
    },
    {
      code: 'test.describe.parallel.only("skip this describe", () => {});',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'suggestRemoveOnly',
              output: 'test.describe.parallel("skip this describe", () => {});',
            },
          ],
          line: 1,
          column: 24,
          endColumn: 28,
        },
      ],
    },
    {
      code: 'test.describe.serial.only("skip this describe", () => {});',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'suggestRemoveOnly',
              output: 'test.describe.serial("skip this describe", () => {});',
            },
          ],
          line: 1,
          column: 22,
          endColumn: 26,
        },
      ],
    },
    {
      code: 'test.only("skip this test", async ({code: page }) => {});',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'suggestRemoveOnly',
              output: 'test("skip this test", async ({code: page }) => {});',
            },
          ],
          line: 1,
          column: 6,
          endColumn: 10,
        },
      ],
    },
    {
      code: 'test["only"]("skip this test", async ({code: page }) => {});',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'suggestRemoveOnly',
              output: 'test("skip this test", async ({code: page }) => {});',
            },
          ],
          line: 1,
          column: 6,
          endColumn: 12,
        },
      ],
    },
    {
      code: 'test[`only`]("skip this test", async ({code: page }) => {});',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'suggestRemoveOnly',
              output: 'test("skip this test", async ({code: page }) => {});',
            },
          ],
          line: 1,
          column: 6,
          endColumn: 12,
        },
      ],
    },
  ],
});
