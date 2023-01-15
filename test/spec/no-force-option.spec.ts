import { runRuleTester, test } from '../utils/rule-tester';
import rule from '../../src/rules/no-force-option';

const messageId = 'noForceOption';

runRuleTester('no-force-option', rule, {
  valid: [
    test("await page.locator('check').check()"),
    test("await page.locator('check').uncheck()"),
    test("await page.locator('button').click()"),
    test("await page.locator('button').locator('btn').click()"),
    test(
      "await page.locator('button').click({ delay: 500, noWaitAfter: true })"
    ),
    test("await page.locator('button').dblclick()"),
    test("await page.locator('input').dragTo()"),
    test("await page.locator('input').fill('something', { timeout: 1000 })"),
    test("await page.locator('elm').hover()"),
    test("await page.locator('select').selectOption({ label: 'Blue' })"),
    test("await page.locator('select').selectText()"),
    test("await page.locator('checkbox').setChecked(true)"),
    test("await page.locator('button').tap()"),
    test('doSomething({ force: true })'),
    test('await doSomething({ ["force"]: true })'),
    test('await doSomething({ [`force`]: true })'),
  ],
  invalid: [
    {
      code: test('await page.locator("check").check({ force: true })'),
      errors: [{ messageId, line: 1, column: 64, endColumn: 75 }],
    },
    {
      code: test('await page.locator("check").uncheck({ ["force"]: true })'),
      errors: [{ messageId, line: 1, column: 66, endColumn: 81 }],
    },
    {
      code: test('await page.locator("button").click({ [`force`]: true })'),
      errors: [{ messageId, line: 1, column: 65, endColumn: 80 }],
    },
    {
      code: test(`
        const button = page["locator"]("button")
        await button.click({ force: true })
      `),
      errors: [{ messageId, line: 3, column: 30, endLine: 3, endColumn: 41 }],
    },
    {
      code: test(
        'await page[`locator`]("button").locator("btn").click({ force: true })'
      ),
      errors: [{ messageId, line: 1, column: 83, endColumn: 94 }],
    },
    {
      code: test('await page.locator("button").dblclick({ force: true })'),
      errors: [{ messageId, line: 1, column: 68, endColumn: 79 }],
    },
    {
      code: test('await page.locator("input").dragTo({ force: true })'),
      errors: [{ messageId, line: 1, column: 65, endColumn: 76 }],
    },
    {
      code: test('await page.locator("input").fill("test", { force: true })'),
      errors: [{ messageId, line: 1, column: 71, endColumn: 82 }],
    },
    {
      code: test(
        'await page[`locator`]("input").fill("test", { ["force"]: true })'
      ),
      errors: [{ messageId, line: 1, column: 74, endColumn: 89 }],
    },
    {
      code: test(
        'await page["locator"]("input").fill("test", { [`force`]: true })'
      ),
      errors: [{ messageId, line: 1, column: 74, endColumn: 89 }],
    },
    {
      code: test('await page.locator("elm").hover({ force: true })'),
      errors: [{ messageId, line: 1, column: 62, endColumn: 73 }],
    },
    {
      code: test(
        'await page.locator("select").selectOption({ label: "Blue" }, { force: true })'
      ),
      errors: [{ messageId, line: 1, column: 91, endColumn: 102 }],
    },
    {
      code: test('await page.locator("select").selectText({ force: true })'),
      errors: [{ messageId, line: 1, column: 70, endColumn: 81 }],
    },
    {
      code: test(
        'await page.locator("checkbox").setChecked(true, { force: true })'
      ),
      errors: [{ messageId, line: 1, column: 78, endColumn: 89 }],
    },
    {
      code: test('await page.locator("button").tap({ force: true })'),
      errors: [{ messageId, line: 1, column: 63, endColumn: 74 }],
    },
  ],
});
