import { runRuleTester, wrapInTest } from '../../utils/rule-tester';
import rule from '../no-page-pause';

const invalid = (code: string) => ({
  code: wrapInTest(code),
  errors: [{ messageId: 'noPagePause' }],
});

const valid = wrapInTest;

runRuleTester('no-page-pause', rule, {
  invalid: [invalid('await page.pause()')],
  valid: [
    valid('await page.click()'),
    valid('await expect(page).toBePaused()'),
  ],
});
