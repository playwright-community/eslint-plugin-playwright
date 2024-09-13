import { runRuleTester } from '../utils/rule-tester'
import rule from './prefer-locator'

runRuleTester('prefer-locator', rule, {
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
              messageId: 'avoidAwaitPageMethods'
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
