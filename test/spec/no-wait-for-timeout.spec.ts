import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/no-wait-for-timeout';

const messageId = 'noWaitForTimeout';

runRuleTester('no-wait-for-timeout', rule, {
  invalid: [
    {
      code: 'async function fn() { await page.waitForTimeout(1000) }',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'removeWaitForTimeout',
              output: 'async function fn() {  }',
            },
          ],
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 54,
        },
      ],
    },
    {
      code: 'async function fn() { await this.page.waitForTimeout(1000) }',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'removeWaitForTimeout',
              output: 'async function fn() {  }',
            },
          ],
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 59,
        },
      ],
    },
    {
      code: 'async function fn() { await page["waitForTimeout"](1000) }',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'removeWaitForTimeout',
              output: 'async function fn() {  }',
            },
          ],
          line: 1,
          column: 29,
          endColumn: 57,
        },
      ],
    },
    {
      code: 'async function fn() { await page[`waitForTimeout`](1000) }',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'removeWaitForTimeout',
              output: 'async function fn() {  }',
            },
          ],
          line: 1,
          column: 29,
          endColumn: 57,
        },
      ],
    },
    {
      code: 'async function fn() { return page.waitForTimeout(1000); }',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'removeWaitForTimeout',
              output: 'async function fn() {  }',
            },
          ],
          line: 1,
          column: 30,
          endColumn: 55,
        },
      ],
    },
    {
      code: 'async function fn() { page.waitForTimeout(1000); }',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'removeWaitForTimeout',
              output: 'async function fn() {  }',
            },
          ],
          line: 1,
          column: 23,
          endColumn: 48,
        },
      ],
    },
    {
      code: '(async function() { await page.waitForTimeout(500); })();',
      errors: [
        {
          messageId,
          suggestions: [
            {
              messageId: 'removeWaitForTimeout',
              output: '(async function() {  })();',
            },
          ],
          line: 1,
          column: 27,
          endColumn: 51,
        },
      ],
    },
    {
      code: 'page.waitForTimeout(2000)',
      errors: [
        {
          messageId,
          suggestions: [{ messageId: 'removeWaitForTimeout', output: '' }],
          line: 1,
          column: 1,
          endColumn: 26,
        },
      ],
    },
    {
      code: 'page["waitForTimeout"](2000)',
      errors: [
        {
          messageId,
          suggestions: [{ messageId: 'removeWaitForTimeout', output: '' }],
          line: 1,
          column: 1,
          endColumn: 29,
        },
      ],
    },
    {
      code: 'page[`waitForTimeout`](2000)',
      errors: [
        {
          messageId,
          suggestions: [{ messageId: 'removeWaitForTimeout', output: '' }],
          line: 1,
          column: 1,
          endColumn: 29,
        },
      ],
    },
  ],
  valid: [
    'function waitForTimeout() {}',
    'async function fn() { await waitForTimeout(4343); }',
    'async function fn() { await this.foo.waitForTimeout(4343); }',
    '(async function() { await page.waitForSelector("#foo"); })();',
    'page.waitForSelector("#foo");',
    'page["waitForSelector"]("#foo");',
  ],
});
