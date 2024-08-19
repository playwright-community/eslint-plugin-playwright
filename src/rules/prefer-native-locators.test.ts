import { runRuleTester } from '../utils/rule-tester'
import rule from './prefer-native-locators'

runRuleTester('prefer-native-locators', rule, {
  invalid: [
    {
      code: `page.locator('[aria-label="View more"]')`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedLabelQuery' }],
      output: 'page.getByLabel("View more")',
    },
    {
      code: `page.locator('[role="button"]')`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedRoleQuery' }],
      output: 'page.getByRole("button")',
    },
    {
      code: `page.locator('[placeholder="Enter some text..."]')`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedPlaceholderQuery' }],
      output: 'page.getByPlaceholder("Enter some text...")',
    },
  ],
  valid: [
    { code: 'page.getByLabel("View more")' },
    { code: 'page.getByRole("Button")' },
    { code: 'page.getByPlaceholder("Enter some text...")' },
    {
      code: `page.locator('[complex-query] > [aria-label="View more"]')`,
    },
    {
      code: `page.locator('[complex-query] > [role="button"]')`,
    },
    {
      code: `page.locator('[complex-query] > [placeholder="Enter some text..."]')`,
    },
  ],
})
