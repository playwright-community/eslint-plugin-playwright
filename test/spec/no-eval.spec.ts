import { runRuleTester, test } from '../utils/rule-tester';
import rule from '../../src/rules/no-eval';

runRuleTester('no-eval', rule, {
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
  invalid: [
    {
      code: test(
        'const searchValue = await page.$eval("#search", el => el.value);'
      ),
      errors: [{ messageId: 'noEval', line: 1, column: 54, endColumn: 64 }],
    },
    {
      code: test(
        'const searchValue = await this.page.$eval("#search", el => el.value);'
      ),
      errors: [{ messageId: 'noEval', line: 1, column: 54, endColumn: 69 }],
    },
    {
      code: test(
        'const searchValue = await page["$eval"]("#search", el => el.value);'
      ),
      errors: [{ messageId: 'noEval', line: 1, column: 54, endColumn: 67 }],
    },
    {
      code: test(
        'const searchValue = await page[`$eval`]("#search", el => el.value);'
      ),
      errors: [{ messageId: 'noEval', line: 1, column: 54, endColumn: 67 }],
    },
    {
      code: test('await page.$eval("#search", el => el.value);'),
      errors: [{ messageId: 'noEval', line: 1, column: 34, endColumn: 44 }],
    },
    {
      code: test('await this.page.$eval("#search", el => el.value);'),
      errors: [{ messageId: 'noEval', line: 1, column: 34, endColumn: 49 }],
    },
    {
      code: test('await page.$$eval("#search", el => el.value);'),
      errors: [{ messageId: 'noEvalAll', line: 1, column: 34, endColumn: 45 }],
    },
    {
      code: test('await this.page.$$eval("#search", el => el.value);'),
      errors: [{ messageId: 'noEvalAll', line: 1, column: 34, endColumn: 50 }],
    },
    {
      code: test('await page["$$eval"]("#search", el => el.value);'),
      errors: [{ messageId: 'noEvalAll', line: 1, column: 34, endColumn: 48 }],
    },
    {
      code: test('await page[`$$eval`]("#search", el => el.value);'),
      errors: [{ messageId: 'noEvalAll', line: 1, column: 34, endColumn: 48 }],
    },
    {
      code: test(
        'const html = await page.$eval(".main-container", (e, suffix) => e.outerHTML + suffix, "hello");'
      ),
      errors: [{ messageId: 'noEval', line: 1, column: 47, endColumn: 57 }],
    },
    {
      code: test(
        'const divCounts = await page.$$eval("div", (divs, min) => divs.length >= min, 10);'
      ),
      errors: [{ messageId: 'noEvalAll', line: 1, column: 52, endColumn: 63 }],
    },
  ],
});
