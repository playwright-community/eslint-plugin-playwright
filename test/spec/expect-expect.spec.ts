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
      name: 'Custom assert function',
      options: [{ assertFunctionNames: ['wayComplexCustomCondition'] }],
    },
    {
      code: 'it("should pass", () => hi(true).toBeDefined())',
      errors: [{ messageId: 'noAssertions' }],
      name: 'Global aliases',
      settings: {
        playwright: {
          globalAliases: { test: ['it'] },
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
      options: [{ assertFunctionNames: ['assertCustomCondition'] }],
    },
    {
      code: dedent`
        test('should fail', async ({ myPage, page }) => {
          await myPage.assertCustomCondition(page)
        })
      `,
      name: 'Custom assert class method',
      options: [{ assertFunctionNames: ['assertCustomCondition'] }],
    },
    {
      code: 'it("should pass", () => expect(true).toBeDefined())',
      name: 'Global alias - test',
      settings: {
        playwright: {
          globalAliases: { test: ['it'] },
        },
      },
    },
    {
      code: 'test("should pass", () => assert(true).toBeDefined())',
      name: 'Global alias - assert',
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
    },
  ],
});
