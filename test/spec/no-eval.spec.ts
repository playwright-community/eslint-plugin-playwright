import rule from '../../src/rules/no-eval';
import { runRuleTester, test } from '../utils/rule-tester';

runRuleTester('no-eval', rule, {
  invalid: [
    {
      code: test(
        'const searchValue = await page.$eval("#search", el => el.value);'
      ),
      errors: [{ column: 54, endColumn: 64, line: 1, messageId: 'noEval' }],
    },
    {
      code: test(
        'const searchValue = await this.page.$eval("#search", el => el.value);'
      ),
      errors: [{ column: 54, endColumn: 69, line: 1, messageId: 'noEval' }],
    },
    {
      code: test(
        'const searchValue = await page["$eval"]("#search", el => el.value);'
      ),
      errors: [{ column: 54, endColumn: 67, line: 1, messageId: 'noEval' }],
    },
    {
      code: test(
        'const searchValue = await page[`$eval`]("#search", el => el.value);'
      ),
      errors: [{ column: 54, endColumn: 67, line: 1, messageId: 'noEval' }],
    },
    {
      code: test('await page.$eval("#search", el => el.value);'),
      errors: [{ column: 34, endColumn: 44, line: 1, messageId: 'noEval' }],
    },
    {
      code: test('await this.page.$eval("#search", el => el.value);'),
      errors: [{ column: 34, endColumn: 49, line: 1, messageId: 'noEval' }],
    },
    {
      code: test('await page.$$eval("#search", el => el.value);'),
      errors: [{ column: 34, endColumn: 45, line: 1, messageId: 'noEvalAll' }],
    },
    {
      code: test('await this.page.$$eval("#search", el => el.value);'),
      errors: [{ column: 34, endColumn: 50, line: 1, messageId: 'noEvalAll' }],
    },
    {
      code: test('await page["$$eval"]("#search", el => el.value);'),
      errors: [{ column: 34, endColumn: 48, line: 1, messageId: 'noEvalAll' }],
    },
    {
      code: test('await page[`$$eval`]("#search", el => el.value);'),
      errors: [{ column: 34, endColumn: 48, line: 1, messageId: 'noEvalAll' }],
    },
    {
      code: test(
        'const html = await page.$eval(".main-container", (e, suffix) => e.outerHTML + suffix, "hello");'
      ),
      errors: [{ column: 47, endColumn: 57, line: 1, messageId: 'noEval' }],
    },
    {
      code: test(
        'const divCounts = await page.$$eval("div", (divs, min) => divs.length >= min, 10);'
      ),
      errors: [{ column: 52, endColumn: 63, line: 1, messageId: 'noEvalAll' }],
    },
  ],
  valid: [
    test('await page.locator(".tweet").evaluate(node => node.innerText)'),
    test('await this.page.locator(".tweet").evaluate(node => node.innerText)'),
    test('await page.locator(".tweet")["evaluate"](node => node.innerText)'),
    test('await page.locator(".tweet")[`evaluate`](node => node.innerText)'),
    test(
      'await (await page.$(".tweet")).$eval(".like", node => node.innerText)'
    ),
    test(
      'await (await page.$(".tweet"))["$eval"](".like", node => node.innerText)'
    ),
    test(
      'await (await page.$(".tweet")).$$eval(".like", node => node.innerText)'
    ),
    test(
      'await (await page.$(".tweet"))[`$$eval`](".like", node => node.innerText)'
    ),
    test(
      'await page.locator("div").evaluateAll((divs, min) => divs.length >= min, 10);'
    ),
    test(
      'await this.page.locator("div").evaluateAll((divs, min) => divs.length >= min, 10);'
    ),
  ],
});
