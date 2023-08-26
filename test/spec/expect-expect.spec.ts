import dedent = require('dedent');
import rule from '../../src/rules/expect-expect';
import { runRuleTester } from '../utils/rule-tester';

runRuleTester('expect-expect', rule, {
  invalid: [
    {
      code: 'test("should fail", () => {});',
      errors: [{ messageId: 'noAssertions' }],
    },
    {
      code: 'test.skip("should fail", () => {});',
      errors: [{ messageId: 'noAssertions' }],
    },
    {
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      errors: [{ messageId: 'noAssertions' }],
    },
    {
      name: 'Global settings no false positives',
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      errors: [{ messageId: 'noAssertions' }],
      settings: {
        playwright: {
          additionalAssertFunctionNames: ['wayComplexCustomCondition'],
        },
      },
    },
    {
      name: 'Rule settings no false positives',
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      errors: [{ messageId: 'noAssertions' }],
      options: [
        { additionalAssertFunctionNames: ['wayComplexCustomCondition'] },
      ],
    },
    {
      name: 'Global settings no false positives',
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      errors: [{ messageId: 'noAssertions' }],
      settings: {
        playwright: {
          additionalAssertFunctionNames: ['wayComplexGlobalCustomCondition'],
        },
      },
      options: [
        { additionalAssertFunctionNames: ['wayComplexRuleCustomCondition'] },
      ],
    },
  ],
  valid: [
    'foo();',
    '["bar"]();',
    'testing("will test something eventually", () => {})',
    'test("should pass", () => expect(true).toBeDefined())',
    {
      code: dedent`
        test('steps', async ({ page }) => {
          await test.step('first tab', async () => {
            await expect(page.getByText('Hello')).toBeVisible();
          });
        });
      `,
    },
    {
      code: dedent`
        test.only('steps', async ({ page }) => {
          await test.step('first tab', async () => {
            await expect(page.getByText('Hello')).toBeVisible();
          });
        });
      `,
    },
    {
      name: 'Global settings only',
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      settings: {
        playwright: {
          additionalAssertFunctionNames: ['assertCustomCondition'],
        },
      },
    },
    {
      name: 'Rule settings only',
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      options: [{ additionalAssertFunctionNames: ['assertCustomCondition'] }],
    },
    {
      name: 'Global and rule settings combine rather than override',
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })

        test('complex failure', async ({ page }) => {
          await wayComplexCustomCondition(page)
        })
      `,
      settings: {
        playwright: {
          additionalAssertFunctionNames: ['assertCustomCondition'],
        },
      },
      options: [
        { additionalAssertFunctionNames: ['wayComplexCustomCondition'] },
      ],
    },
  ],
});
