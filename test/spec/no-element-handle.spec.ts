import { runRuleTester, test } from '../utils/rule-tester';
import rule from '../../src/rules/no-element-handle';

runRuleTester('no-element-handle', rule, {
  valid: [
    test('page.locator("a")'),
    test('this.page.locator("a")'),
    test('await page.locator("a").click();'),
    test('const $ = "text";'),
    test('$("a");'),
    test('this.$("a");'),
    test('this["$"]("a");'),
    test('this[`$`]("a");'),
    test('internalPage.$("a");'),
    test('this.page.$$$("div");'),
    test('page.$$$("div");'),
  ],
  invalid: [
    // element handle as const
    {
      code: test('const handle = await page.$("text=Submit");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandleWithLocator',
              output: test('const handle = page.locator("text=Submit");'),
            },
          ],
          line: 1,
          column: 49,
          endColumn: 55,
        },
      ],
    },
    {
      code: test('const handle = await this.page.$("text=Submit");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandleWithLocator',
              output: test('const handle = this.page.locator("text=Submit");'),
            },
          ],
          line: 1,
          column: 49,
          endColumn: 60,
        },
      ],
    },
    {
      code: test('const handle = await page["$$"]("text=Submit");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('const handle = page["locator"]("text=Submit");'),
            },
          ],
          line: 1,
          column: 49,
          endColumn: 59,
        },
      ],
    },
    {
      code: test('const handle = await page[`$$`]("text=Submit");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('const handle = page[`locator`]("text=Submit");'),
            },
          ],
          line: 1,
          column: 49,
          endColumn: 59,
        },
      ],
    },
    {
      code: test('const handle = await this.page.$$("text=Submit");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('const handle = this.page.locator("text=Submit");'),
            },
          ],
          line: 1,
          column: 49,
          endColumn: 61,
        },
      ],
    },
    // element handle as let
    {
      code: test('let handle = await page.$("text=Submit");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandleWithLocator',
              output: test('let handle = page.locator("text=Submit");'),
            },
          ],
          line: 1,
          column: 47,
          endColumn: 53,
        },
      ],
    },
    // element handle as expression statement without await
    {
      code: test('page.$("div")'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandleWithLocator',
              output: test('page.locator("div")'),
            },
          ],
          line: 1,
          column: 28,
          endColumn: 34,
        },
      ],
    },
    // element handles as expression statement without await
    {
      code: test('page.$$("div")'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('page.locator("div")'),
            },
          ],
          line: 1,
          column: 28,
          endColumn: 35,
        },
      ],
    },
    // element handle as expression statement
    {
      code: test('await page.$("div")'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandleWithLocator',
              output: test('page.locator("div")'),
            },
          ],
          line: 1,
          column: 34,
          endColumn: 40,
        },
      ],
    },
    // element handle click
    {
      code: test('await (await page.$$("div")).click();'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('await (page.locator("div")).click();'),
            },
          ],
          line: 1,
          column: 41,
          endColumn: 48,
        },
      ],
    },
    // element handles as const
    {
      code: test('const handles = await page.$$("a")'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('const handles = page.locator("a")'),
            },
          ],
          line: 1,
          column: 50,
          endColumn: 57,
        },
      ],
    },
    {
      code: test('const handle = await page["$$"]("a");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('const handle = page["locator"]("a");'),
            },
          ],
          line: 1,
          column: 49,
          endColumn: 59,
        },
      ],
    },
    {
      code: test('const handle = await page[`$$`]("a");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('const handle = page[`locator`]("a");'),
            },
          ],
          line: 1,
          column: 49,
          endColumn: 59,
        },
      ],
    },
    // element handles as let
    {
      code: test('let handles = await page.$$("a")'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('let handles = page.locator("a")'),
            },
          ],
          line: 1,
          column: 48,
          endColumn: 55,
        },
      ],
    },
    // element handles as expression statement
    {
      code: test('await page.$$("a")'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('page.locator("a")'),
            },
          ],
          line: 1,
          column: 34,
          endColumn: 41,
        },
      ],
    },
    // return element handle without awaiting it
    {
      code: test('function getHandle() { return page.$("button"); }'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandleWithLocator',
              output: test(
                'function getHandle() { return page.locator("button"); }'
              ),
            },
          ],
          line: 1,
          column: 58,
          endColumn: 64,
        },
      ],
    },
    // return element handles without awaiting it
    {
      code: test('function getHandle() { return page.$$("button"); }'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test(
                'function getHandle() { return page.locator("button"); }'
              ),
            },
          ],
          line: 1,
          column: 58,
          endColumn: 65,
        },
      ],
    },
    // missed return for the element handle
    {
      code: test('function getHandle() { page.$("button"); }'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandleWithLocator',
              output: test('function getHandle() { page.locator("button"); }'),
            },
          ],
          line: 1,
          column: 51,
          endColumn: 57,
        },
      ],
    },
    // arrow function return element handle without awaiting it
    {
      code: test('const getHandles = () => page.$("links");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandleWithLocator',
              output: test('const getHandles = () => page.locator("links");'),
            },
          ],
          line: 1,
          column: 53,
          endColumn: 59,
        },
      ],
    },
    // arrow function return element handles without awaiting it
    {
      code: test('const getHandles = () => page.$$("links");'),
      errors: [
        {
          messageId: 'noElementHandle',
          suggestions: [
            {
              messageId: 'replaceElementHandlesWithLocator',
              output: test('const getHandles = () => page.locator("links");'),
            },
          ],
          line: 1,
          column: 53,
          endColumn: 60,
        },
      ],
    },
  ],
});
