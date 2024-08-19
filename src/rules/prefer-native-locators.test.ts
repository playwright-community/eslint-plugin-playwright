import { runRuleTester } from '../utils/rule-tester'
import rule from './prefer-native-locators'

runRuleTester('prefer-native-locators', rule, {
  invalid: [
    {
      code: `page.locator('[aria-label="View more"]')`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedLabelQuery' }],
      output: 'page.getByLabel("View more")',
    },
  ],
  valid: [
    { code: 'page.getByLabel("View more")' },
    {
      code: `page.locator('[something-more-complex][aria-label="View more"]')`,
    },
  ],
})
