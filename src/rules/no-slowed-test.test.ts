import rule from '../../src/rules/no-slowed-test.js'
import { runRuleTester } from '../utils/rule-tester.js'

const messageId = 'removeSlowedTestAnnotation'

runRuleTester('no-slowed-test', rule, {
  invalid: [
    {
      code: 'test.slow("slow this test", async ({ page }) => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [
            {
              messageId,
              output: 'test("slow this test", async ({ page }) => {});',
            },
          ],
        },
      ],
    },
    {
      code: 'test["slow"]("slow this test", async ({ page }) => {});',
      errors: [
        {
          column: 6,
          endColumn: 12,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [
            {
              messageId,
              output: 'test("slow this test", async ({ page }) => {});',
            },
          ],
        },
      ],
    },
    {
      code: 'test[`slow`]("slow this test", async ({ page }) => {});',
      errors: [
        {
          column: 6,
          endColumn: 12,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [
            {
              messageId,
              output: 'test("slow this test", async ({ page }) => {});',
            },
          ],
        },
      ],
    },
    {
      code: 'test.slow("a test", { tag: ["@fast", "@login"] }, () => {})',
      errors: [
        {
          column: 6,
          endColumn: 10,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [
            {
              messageId,
              output: 'test("a test", { tag: ["@fast", "@login"] }, () => {})',
            },
          ],
        },
      ],
    },
    {
      code: 'test.slow(browserName === "firefox");',
      errors: [
        {
          column: 1,
          endColumn: 37,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
    {
      code: 'test.slow(browserName === "firefox", "Still working on it");',
      errors: [
        {
          column: 1,
          endColumn: 60,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
    {
      code: 'test.slow()',
      errors: [
        {
          column: 1,
          endColumn: 12,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
    {
      code: 'test["slow"]()',
      errors: [
        {
          column: 1,
          endColumn: 15,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
    {
      code: 'test[`slow`]()',
      errors: [
        {
          column: 1,
          endColumn: 15,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [{ messageId, output: '' }],
        },
      ],
    },
    // Global aliases
    {
      code: 'it.slow("slow this test", async ({ page }) => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          line: 1,
          messageId: 'noSlowedTest',
          suggestions: [
            {
              messageId,
              output: 'it("slow this test", async ({ page }) => {});',
            },
          ],
        },
      ],
      settings: {
        playwright: {
          globalAliases: { test: ['it'] },
        },
      },
    },
  ],
  valid: [
    'test("a test", () => {});',
    'test("a test", { tag: "@fast" }, () => {});',
    'test("a test", { tag: ["@fast", "@report"] }, () => {});',
    'test("one", async ({ page }) => {});',
    'test.only(isMobile, "Settings page does not work in mobile yet");',
    'test.skip();',
    'test["skip"]();',
    'test[`skip`]();',
    'const slow = true;',
    'function slow() { return null };',
    'this.slow();',
    'this["slow"]();',
    'this[`slow`]();',
    {
      code: 'test.slow(browserName === "firefox", "Still working on it");',
      options: [{ allowConditional: true }],
    },
    // Global aliases
    {
      code: 'it("a test", () => {});',
      settings: {
        playwright: {
          globalAliases: { test: ['it'] },
        },
      },
    },
  ],
})
