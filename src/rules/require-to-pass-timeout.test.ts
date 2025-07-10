import { runRuleTester } from '../utils/rule-tester.js'
import rule from './require-to-pass-timeout.js'

runRuleTester('require-to-pass-timeout', rule, {
  invalid: [
    // toPass without timeout
    {
      code: "await expect(async () => { const response = await page.request.get('https://api.example.com'); expect(response.status()).toBe(200); }).toPass();",
      errors: [
        {
          column: 136,
          line: 1,
          messageId: 'addTimeoutOption',
        },
      ],
    },
    // toPass with empty object
    {
      code: "await expect(async () => { const response = await page.request.get('https://api.example.com'); expect(response.status()).toBe(200); }).toPass({});",
      errors: [
        {
          column: 136,
          line: 1,
          messageId: 'addTimeoutOption',
        },
      ],
    },
  ],
  valid: [
    // toPass with timeout
    {
      code: "await expect(async () => { const response = await page.request.get('https://api.example.com'); expect(response.status()).toBe(200); }).toPass({ timeout: 60000 });",
    },
    // toPass with other options including timeout
    {
      code: "await expect(async () => { const response = await page.request.get('https://api.example.com'); expect(response.status()).toBe(200); }).toPass({ intervals: [1000, 2000], timeout: 60000 });",
    },
  ],
})
