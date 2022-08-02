import { runRuleTester, wrapInTest } from '../utils/rule-tester';
import rule from '../../src/rules/no-page-pause';
import test from '@playwright/test';

const invalid = (code: string) => ({
  code: wrapInTest(code),
  errors: [{ messageId: 'noPagePause' }],
});

const valid = wrapInTest;

test('no-page-pause', () => {
  runRuleTester(test.info().title, rule, {
    invalid: [invalid('await page.pause()')],
    valid: [
      valid('await page.click()'),
      valid('await expect(page).toBePaused()'),
    ],
  });
});
