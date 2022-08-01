import { runRuleTester, wrapInTest } from '../utils/rule-tester';
import rule from '../../src/rules/no-eval';

const invalid = (code: string) => ({
  code: wrapInTest(code),
  errors: [{ messageId: code.includes('page.$eval') ? 'noEval' : 'noEvalAll' }],
});

const valid = wrapInTest;

runRuleTester('no-eval', rule, {
  invalid: [
    // $eval with no arguments as const
    invalid('const searchValue = await page.$eval("#search", el => el.value);'),

    // $eval
    invalid('await page.$eval("#search", el => el.value);'),

    // $$eval
    invalid('await page.$$eval("#search", el => el.value);'),

    // $eval with arguments as function
    invalid(
      'const html = await page.$eval(".main-container", (e, suffix) => e.outerHTML + suffix, "hello");'
    ),

    // $$eval with no arguments as const
    invalid(
      'const divCounts = await page.$$eval("div", (divs, min) => divs.length >= min, 10);'
    ),
  ],
  valid: [
    // locator evaluate
    valid('await page.locator(".tweet").evaluate(node => node.innerText)'),

    // element handle evaluate
    valid(
      'await (await page.$(".tweet")).$eval(".like", node => node.innerText)'
    ),

    // element handle evaluate all
    valid(
      'await (await page.$(".tweet")).$$eval(".like", node => node.innerText)'
    ),

    // locator evaluateAll
    valid(
      'await page.locator("div").evaluateAll((divs, min) => divs.length >= min, 10);'
    ),
  ],
});
