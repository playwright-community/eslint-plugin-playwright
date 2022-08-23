import { runRuleTester, wrapInTest } from '../utils/rule-tester';
import rule from '../../src/rules/no-eval';

const invalid = (code: string) => ({
  code: wrapInTest(code),
  errors: [{ messageId: code.includes('$$eval') ? 'noEvalAll' : 'noEval' }],
});

const valid = wrapInTest;

runRuleTester('no-eval', rule, {
  valid: [
    valid('await page.locator(".tweet").evaluate(node => node.innerText)'),
    valid('await page.locator(".tweet")["evaluate"](node => node.innerText)'),
    valid('await page.locator(".tweet")[`evaluate`](node => node.innerText)'),
    valid(
      'await (await page.$(".tweet")).$eval(".like", node => node.innerText)'
    ),
    valid(
      'await (await page.$(".tweet"))["$eval"](".like", node => node.innerText)'
    ),
    valid(
      'await (await page.$(".tweet")).$$eval(".like", node => node.innerText)'
    ),
    valid(
      'await (await page.$(".tweet"))[`$$eval`](".like", node => node.innerText)'
    ),
    valid(
      'await page.locator("div").evaluateAll((divs, min) => divs.length >= min, 10);'
    ),
  ],
  invalid: [
    invalid('const searchValue = await page.$eval("#search", el => el.value);'),
    invalid(
      'const searchValue = await page["$eval"]("#search", el => el.value);'
    ),
    invalid(
      'const searchValue = await page[`$eval`]("#search", el => el.value);'
    ),
    invalid('await page.$eval("#search", el => el.value);'),
    invalid('await page.$$eval("#search", el => el.value);'),
    invalid('await page["$$eval"]("#search", el => el.value);'),
    invalid('await page[`$$eval`]("#search", el => el.value);'),
    invalid(
      'const html = await page.$eval(".main-container", (e, suffix) => e.outerHTML + suffix, "hello");'
    ),
    invalid(
      'const divCounts = await page.$$eval("div", (divs, min) => divs.length >= min, 10);'
    ),
  ],
});
