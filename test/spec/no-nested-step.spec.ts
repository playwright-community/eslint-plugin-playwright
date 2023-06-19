import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/no-nested-step';
import dedent = require('dedent');

const messageId = 'noNestedStep';

runRuleTester('max-nested-step', rule, {
  valid: [
    'await test.step("step1", () => {});',
    'await test.step("step1", async () => {});',
    {
      code: dedent`
        test('foo', async () => {
          await expect(true).toBe(true);
        });
      `,
    },
    {
      code: dedent`
        test('foo', async () => {
          await test.step("step1", async () => {
            await expect(true).toBe(true);
          });
        });
      `,
    },
    {
      code: dedent`
        test('foo', async () => {
          await test.step("step1", async () => {
            await expect(true).toBe(true);
          });
          await test.step("step2", async () => {
            await expect(true).toBe(true);
          });
        });
      `,
    },
  ],
  invalid: [
    {
      code: dedent`
      test('foo', async () => {
        await test.step("step1", async () => {
          await test.step("nested step1", async () => {
            await expect(true).toBe(true);
          });
        });
      });
      `,
      errors: [{ messageId, line: 3, column: 11, endLine: 3, endColumn: 20 }],
    },
    {
      code: dedent`
      test('foo', async () => {
        await test.step("step1", async () => {
          await test.step("nested step1", async () => {
            await expect(true).toBe(true);
          });
          await test.step("nested step1", async () => {
            await expect(true).toBe(true);
          });
        });
      });
      `,
      errors: [
        { messageId, line: 3, column: 11, endLine: 3, endColumn: 20 },
        { messageId, line: 6, column: 11, endLine: 6, endColumn: 20 },
      ],
    },
  ],
});
