import { runRuleTester, test } from '../utils/rule-tester';
import rule from '../../src/rules/no-element-handle';

const invalid = (code: string, output: string) => ({
  code: test(code),
  errors: [
    {
      messageId: 'noElementHandle',
      suggestions: [
        {
          messageId: code.includes('$$')
            ? 'replaceElementHandlesWithLocator'
            : 'replaceElementHandleWithLocator',
          output: test(output),
        },
      ],
    },
  ],
});

const valid = test;

runRuleTester('no-element-handle', rule, {
  invalid: [
    // element handle as const
    invalid(
      'const handle = await page.$("text=Submit");',
      'const handle = page.locator("text=Submit");'
    ),
    invalid(
      'const handle = await this.page.$("text=Submit");',
      'const handle = this.page.locator("text=Submit");'
    ),
    invalid(
      'const handle = await page["$$"]("text=Submit");',
      'const handle = page["locator"]("text=Submit");'
    ),
    invalid(
      'const handle = await page[`$$`]("text=Submit");',
      'const handle = page[`locator`]("text=Submit");'
    ),
    invalid(
      'const handle = await this.page.$$("text=Submit");',
      'const handle = this.page.locator("text=Submit");'
    ),

    // element handle as let
    invalid(
      'let handle = await page.$("text=Submit");',
      'let handle = page.locator("text=Submit");'
    ),

    // element handle as expression statement without await
    invalid('page.$("div")', 'page.locator("div")'),

    // element handles as expression statement without await
    invalid('page.$$("div")', 'page.locator("div")'),

    // element handle as expression statement
    invalid('await page.$("div")', 'page.locator("div")'),

    // element handle click
    invalid(
      'await (await page.$$("div")).click();',
      'await (page.locator("div")).click();'
    ),

    // element handles as const
    invalid(
      'const handles = await page.$$("a")',
      'const handles = page.locator("a")'
    ),
    invalid(
      'const handle = await page["$$"]("a");',
      'const handle = page["locator"]("a");'
    ),
    invalid(
      'const handle = await page[`$$`]("a");',
      'const handle = page[`locator`]("a");'
    ),

    // element handles as let
    invalid(
      'let handles = await page.$$("a")',
      'let handles = page.locator("a")'
    ),

    // element handles as expression statement
    invalid('await page.$$("a")', 'page.locator("a")'),

    // return element handle without awaiting it
    invalid(
      'function getHandle() { return page.$("button"); }',
      'function getHandle() { return page.locator("button"); }'
    ),

    // return element handles without awaiting it
    invalid(
      'function getHandle() { return page.$$("button"); }',
      'function getHandle() { return page.locator("button"); }'
    ),

    // missed return for the element handle
    invalid(
      'function getHandle() { page.$("button"); }',
      'function getHandle() { page.locator("button"); }'
    ),

    // arrow function return element handle without awaiting it
    invalid(
      'const getHandles = () => page.$("links");',
      'const getHandles = () => page.locator("links");'
    ),

    // arrow function return element handles without awaiting it
    invalid(
      'const getHandles = () => page.$$("links");',
      'const getHandles = () => page.locator("links");'
    ),
  ],
  valid: [
    valid('page.locator("a")'),
    valid('this.page.locator("a")'),
    valid('await page.locator("a").click();'),
    valid('const $ = "text";'),
    valid('$("a");'),
    valid('this.$("a");'),
    valid('this["$"]("a");'),
    valid('this[`$`]("a");'),
    valid('internalPage.$("a");'),
    valid('this.page.$$$("div");'),
    valid('page.$$$("div");'),
  ],
});
