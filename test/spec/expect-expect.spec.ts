import dedent from 'dedent';
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
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      errors: [{ messageId: 'noAssertions' }],
      name: 'Global settings no false positives',
      settings: {
        playwright: {
          additionalAssertFunctionNames: ['wayComplexCustomCondition'],
        },
      },
    },
    {
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      errors: [{ messageId: 'noAssertions' }],
      name: 'Rule settings no false positives',
      options: [
        { additionalAssertFunctionNames: ['wayComplexCustomCondition'] },
      ],
    },
    {
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      errors: [{ messageId: 'noAssertions' }],
      name: 'Global settings no false positives',
      options: [
        { additionalAssertFunctionNames: ['wayComplexRuleCustomCondition'] },
      ],
      settings: {
        playwright: {
          additionalAssertFunctionNames: ['wayComplexGlobalCustomCondition'],
        },
      },
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
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      name: 'Custom assert function',
      settings: {
        playwright: {
          additionalAssertFunctionNames: ['assertCustomCondition'],
        },
      },
    },
    {
      code: dedent`
        test('should fail', async ({ myPage, page }) => {
          await myPage.assertCustomCondition(page)
        })
      `,
      name: 'Custom assert class method',
      settings: {
        playwright: {
          additionalAssertFunctionNames: ['assertCustomCondition'],
        },
      },
    },
    {
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })
      `,
      name: 'Rule settings only',
      options: [{ additionalAssertFunctionNames: ['assertCustomCondition'] }],
    },
    {
      code: dedent`
        test('should fail', async ({ page }) => {
          await assertCustomCondition(page)
        })

        test('complex failure', async ({ page }) => {
          await wayComplexCustomCondition(page)
        })
      `,
      name: 'Global and rule settings combine rather than override',
      options: [
        { additionalAssertFunctionNames: ['wayComplexCustomCondition'] },
      ],
      settings: {
        playwright: {
          additionalAssertFunctionNames: ['assertCustomCondition'],
        },
      },
    },
  ],
});
