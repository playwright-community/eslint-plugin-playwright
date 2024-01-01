import rule from '../../src/rules/no-raw-locators';
import { runRuleTester, test } from '../utils/rule-tester';

const messageId = 'noRawLocator';

runRuleTester('no-raw-locators', rule, {
  invalid: [
    {
      code: test('await page.locator()'),
      errors: [{ column: 34, endColumn: 48, line: 1, messageId }],
    },
    {
      code: test('await this.page.locator()'),
      errors: [{ column: 34, endColumn: 53, line: 1, messageId }],
    },
    {
      code: test("await page.locator('.btn')"),
      errors: [{ column: 34, endColumn: 54, line: 1, messageId }],
    },
    {
      code: test('await page["locator"](".btn")'),
      errors: [{ column: 34, endColumn: 57, line: 1, messageId }],
    },
    {
      code: test('await page[`locator`](".btn")'),
      errors: [{ column: 34, endColumn: 57, line: 1, messageId }],
    },

    {
      code: test('await frame.locator()'),
      errors: [{ column: 34, endColumn: 49, line: 1, messageId }],
    },

    {
      code: test(
        'const section = await page.getByRole("section"); section.locator(".btn")',
      ),
      errors: [{ column: 77, endColumn: 100, line: 1, messageId }],
    },

    // Allowed
    {
      code: test('await page.locator("[aria-busy=false]")'),
      errors: [{ column: 77, endColumn: 100, line: 1, messageId }],
      options: [{ allowed: ['iframe'] }],
    },
    {
      code: test(`await page.locator("[aria-busy=false]")`),
      errors: [{ column: 77, endColumn: 100, line: 1, messageId }],
      options: [{ allowed: ['iframe'] }],
    },
    {
      code: test(`await page.locator("[aria-busy=false]")`),
      errors: [{ column: 77, endColumn: 100, line: 1, messageId }],
      options: [{ allowed: [`[aria-busy=true]`] }],
    },
    {
      code: test(`await page.locator("[aria-busy='false']")`),
      errors: [{ column: 77, endColumn: 100, line: 1, messageId }],
      options: [{ allowed: [`[aria-busy=true]`] }],
    },
  ],
  valid: [
    test('await page.click()'),
    test('await this.page.click()'),
    test('await page["hover"]()'),
    test('await page[`check`]()'),

    // Preferred user facing locators
    test('await page.getByText("lorem ipsum")'),
    test('await page.getByLabel(/Email/)'),
    test('await page.getByRole("button", { name: /submit/i })'),
    test('await page.getByTestId("my-test-button").click()'),
    test(
      'await page.getByRole("button").filter({ hasText: "Add to cart" }).click()',
    ),

    test('await frame.getByRole("button")'),

    test(
      'const section = page.getByRole("section"); section.getByRole("button")',
    ),

    // bare calls
    test('() => page.locator'),

    // Allowed
    {
      code: test('await page.locator("iframe")'),
      options: [{ allowed: ['iframe'] }],
    },
    {
      code: test(`await page.locator("[aria-busy=false]")`),
      options: [{ allowed: [`[aria-busy=false]`] }],
    },
    {
      code: test(`await page.locator("[aria-busy='false']")`),
      options: [{ allowed: [`[aria-busy=false]`] }],
    },
    {
      code: test(`await page.locator('[aria-busy="false"]')`),
      options: [{ allowed: [`[aria-busy=false]`] }],
    },
    {
      code: test(`await page.locator("[aria-busy=false]")`),
      options: [{ allowed: [`[aria-busy='false']`] }],
    },
    {
      code: test(`await page.locator('[aria-busy=false]')`),
      options: [{ allowed: [`[aria-busy="false"]`] }],
    },
    {
      code: test(`await page.locator("[aria-busy='false']")`),
      options: [{ allowed: [`[aria-busy='false']`] }],
    },
    {
      code: test(`await page.locator('[aria-busy="false"]')`),
      options: [{ allowed: [`[aria-busy="false"]`] }],
    },
    {
      code: test(`await page.locator('[aria-busy='false']')`),
      options: [{ allowed: [`[aria-busy="false"]`] }],
    },
    {
      code: test(`await page.locator('[aria-busy="false"]')`),
      options: [{ allowed: [`[aria-busy='false']`] }],
    },
  ],
});
