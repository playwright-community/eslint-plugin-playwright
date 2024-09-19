import { runRuleTester } from '../utils/rule-tester'
import rule from './prefer-locator'

runRuleTester('prefer-locator', rule, {
  invalid: [
    {
      code: `
          async function test() {
              await page.fill('input[type="password"]', 'password');
          }
      `,
      errors: [
        {
          column: 15,
          endColumn: 68,
          endLine: 3,
          line: 3,
          messageId: 'preferLocator',
        },
      ],
      output: null,
    },
    {
      code: `
          async function test() {
              await page.dblclick('xpath=//button');
          }
      `,
      errors: [
        {
          column: 15,
          endColumn: 52,
          endLine: 3,
          line: 3,
          messageId: 'preferLocator',
        },
      ],
      output: null,
    },
    {
      code: `
          async function test() {
              await page.frame('frame-name').click('css=button');
          }
      `,
      errors: [
        {
          column: 15,
          endColumn: 65,
          endLine: 3,
          line: 3,
          messageId: 'preferLocator',
        },
      ],
      output: null,
    },
  ],
  valid: [
    {
      code: `const locator = page.locator('input[type="password"]')`,
    },
    {
      code: `
          async function test() {
              await page.locator('input[type="password"]').fill('password');
          }
      `,
    },
    {
      code: `
          async function test() {
              await page.locator('xpath=//button').dblclick();
          }
      `,
    },
    {
      code: `
          async function test() {
              await page.frameLocator('#my-iframe').locator('css=button').click();
          }
      `,
    },
    {
      code: `
          async function test() {
              await page.evaluate('1 + 2');
          }
      `,
    },
    {
      code: `page.frame('frame-name')`,
    },
  ],
})
