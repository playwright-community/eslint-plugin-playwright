import { runRuleTester, wrapInTest } from '../../utils/rule-tester';
import rule from '../no-force-option';

const invalid = (code: string) => ({
  code: wrapInTest(code),
  errors: [{ messageId: 'noForceOption' }],
});

const valid = wrapInTest;

runRuleTester('no-force-option', rule, {
  invalid: [
    invalid('await page.locator("check").check({ force: true })'),
    invalid('await page.locator("check").uncheck({ force: true })'),
    invalid('await page.locator("button").click({ force: true })'),
    invalid(
      'const button = page.locator("button"); await button.click({ force: true })'
    ),
    invalid(
      'await page.locator("button").locator("btn").click({ force: true })'
    ),
    invalid('await page.locator("button").dblclick({ force: true })'),
    invalid('await page.locator("input").dragTo({ force: true })'),
    invalid('await page.locator("input").fill("test", { force: true })'),
    invalid('await page.locator("elm").hover({ force: true })'),
    invalid(
      'await page.locator("select").selectOption({ label: "Blue" }, { force: true })'
    ),
    invalid('await page.locator("select").selectText({ force: true })'),
    invalid('await page.locator("checkbox").setChecked(true, { force: true })'),
    invalid('await page.locator("button").tap({ force: true })'),
  ],
  valid: [
    valid("await page.locator('check').check()"),
    valid("await page.locator('check').uncheck()"),
    valid("await page.locator('button').click()"),
    valid("await page.locator('button').locator('btn').click()"),
    valid(
      "await page.locator('button').click({ delay: 500, noWaitAfter: true })"
    ),
    valid("await page.locator('button').dblclick()"),
    valid("await page.locator('input').dragTo()"),
    valid("await page.locator('input').fill('something', { timeout: 1000 })"),
    valid("await page.locator('elm').hover()"),
    valid("await page.locator('select').selectOption({ label: 'Blue' })"),
    valid("await page.locator('select').selectText()"),
    valid("await page.locator('checkbox').setChecked(true)"),
    valid("await page.locator('button').tap()"),
    valid('doSomething({ force: true })'),
    valid('await doSomething({ force: true })'),
  ],
});
