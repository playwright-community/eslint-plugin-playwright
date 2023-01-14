import { runRuleTester, wrapInTest } from '../utils/rule-tester';
import rule from '../../src/rules/no-page-pause';

const invalid = (code: string) => ({
  code: wrapInTest(code),
  errors: [{ messageId: 'noPagePause' }],
});

const valid = wrapInTest;

runRuleTester('no-page-pause', rule, {
  invalid: [
    invalid('await page.pause()'),
    invalid('await this.page.pause()'),
    invalid('await page["pause"]()'),
    invalid('await page[`pause`]()'),
  ],
  valid: [
    valid('await page.click()'),
    valid('await this.page.click()'),
    valid('await page["hover"]()'),
    valid('await page[`check`]()'),
    valid('await expect(page).toBePaused()'),
  ],
});
