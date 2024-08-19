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
    {
      code: `page.locator('[alt="Playwright logo"]')`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedAltTextQuery' }],
      output: 'page.getByAltText("Playwright logo")',
    },
    {
      code: `page.locator('[title="Additional context"]')`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedTitleQuery' }],
      output: 'page.getByTitle("Additional context")',
    },
    {
      code: `page.locator('[data-testid="password-input"]')`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedTestIdQuery' }],
      output: 'page.getByTestId("password-input")',
    },
    {
      code: `page.locator('[data-custom-testid="password-input"]')`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedTestIdQuery' }],
      options: [{ testIdAttribute: 'data-custom-testid' }],
      output: 'page.getByTestId("password-input")',
    },
    // Works when locators are chained
    {
      code: `this.page.locator('[role="heading"]').first()`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedRoleQuery' }],
      output: 'this.page.getByRole("heading").first()',
    },
    // Works when used inside an assertion
    {
      code: `await expect(page.locator('[role="alert"]')).toBeVisible()`,
      errors: [{ column: 14, line: 1, messageId: 'unexpectedRoleQuery' }],
      output: 'await expect(page.getByRole("alert")).toBeVisible()',
    },
    {
      code: `await expect(page.locator('[data-testid="top"]')).toContainText(firstRule)`,
      errors: [{ column: 14, line: 1, messageId: 'unexpectedTestIdQuery' }],
      output: 'await expect(page.getByTestId("top")).toContainText(firstRule)',
    },
    // Works when used as part of an action
    {
      code: `await page.locator('[placeholder="New password"]').click()`,
      errors: [{ column: 7, line: 1, messageId: 'unexpectedPlaceholderQuery' }],
      output: 'await page.getByPlaceholder("New password").click()',
    },
    // Works when it is not page.locator
    {
      code: `this.locator('[aria-label="View more"]')`,
      errors: [{ column: 1, line: 1, messageId: 'unexpectedLabelQuery' }],
      output: 'this.getByLabel("View more")',
    },
  ],
  valid: [
    { code: 'page.getByLabel("View more")' },
    { code: 'page.getByRole("button")' },
    { code: 'page.getByPlaceholder("Enter some text...")' },
    { code: 'page.getByAltText("Playwright logo")' },
    { code: 'page.getByTestId("password-input")' },
    { code: 'page.getByTitle("Additional context")' },
    {
      code: `page.locator('[complex-query] > [aria-label="View more"]')`,
    },
    {
      code: `page.locator('[complex-query] > [role="button"]')`,
    },
    {
      code: `page.locator('[complex-query] > [placeholder="Enter some text..."]')`,
    },
    {
      code: `page.locator('[complex-query] > [alt="Playwright logo"]')`,
    },
    {
      code: `page.locator('[complex-query] > [data-testid="password-input"]')`,
    },
    {
      code: `page.locator('[complex-query] > [title="Additional context"]')`,
    },
  ],
})
