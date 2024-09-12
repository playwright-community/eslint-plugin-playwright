import { runRuleTester } from '../utils/rule-tester'
import rule from './prefer-page-locator-fill'

runRuleTester('prefer-page-locator-fill', rule, {
  invalid: [
    {
      code: `
          async function test() {
              await page.fill();
          }
      `,
      errors: [
          {
              column: 15,
              endColumn: 32,
              endLine: 3,
              line: 3,
              messageId: 'avoidAwaitPageFill'
          }
      ],
      output: null
    }
  ],
  valid: [
    {
      code: `
          async function test() {
              await page.locator();
          }
      `
    }
  ],
})
