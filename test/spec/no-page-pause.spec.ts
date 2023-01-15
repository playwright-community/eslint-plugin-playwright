import { runRuleTester, wrapInTest as test } from '../utils/rule-tester';
import rule from '../../src/rules/no-page-pause';

const messageId = 'noPagePause';

runRuleTester('no-page-pause', rule, {
  invalid: [
    {
      code: test('await page.pause()'),
      errors: [{ messageId, line: 1, column: 34, endColumn: 46 }],
    },
    {
      code: test('await page["pause"]()'),
      errors: [{ messageId, line: 1, column: 34, endColumn: 49 }],
    },
    {
      code: test('await page[`pause`]()'),
      errors: [{ messageId, line: 1, column: 34, endColumn: 49 }],
    },
  ],
  valid: [
    test('await page.click()'),
    test('await page["hover"]()'),
    test('await page[`check`]()'),
    test('await expect(page).toBePaused()'),
  ],
});
