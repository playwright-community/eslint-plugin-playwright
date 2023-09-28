import rule from '../../src/rules/prefer-to-have-count';
import { runRuleTester } from '../utils/rule-tester';

runRuleTester('prefer-to-have-count', rule, {
  invalid: [
    {
      code: 'expect(await files.count()).toBe(1)',
      errors: [
        { column: 29, endColumn: 33, line: 1, messageId: 'useToHaveCount' },
      ],
      output: 'await expect(files).toHaveCount(1)',
    },
    {
      code: 'expect(await files.count()).not.toBe(1)',
      errors: [
        { column: 33, endColumn: 37, line: 1, messageId: 'useToHaveCount' },
      ],
      output: 'await expect(files).not.toHaveCount(1)',
    },
    {
      code: 'expect.soft(await files["count"]()).not.toBe(1)',
      errors: [
        { column: 41, endColumn: 45, line: 1, messageId: 'useToHaveCount' },
      ],
      output: 'await expect.soft(files).not.toHaveCount(1)',
    },
    {
      code: 'expect(await files["count"]()).not["toBe"](1)',
      errors: [
        { column: 36, endColumn: 42, line: 1, messageId: 'useToHaveCount' },
      ],
      output: 'await expect(files).not["toHaveCount"](1)',
    },
    {
      code: 'expect(await files.count())[`toEqual`](1)',
      errors: [
        { column: 29, endColumn: 38, line: 1, messageId: 'useToHaveCount' },
      ],
      output: 'await expect(files)[`toHaveCount`](1)',
    },
    {
      code: 'expect(await files.count()).toStrictEqual(1)',
      errors: [
        { column: 29, endColumn: 42, line: 1, messageId: 'useToHaveCount' },
      ],
      output: 'await expect(files).toHaveCount(1)',
    },
    {
      code: 'expect(await files.count()).not.toStrictEqual(1)',
      errors: [
        { column: 33, endColumn: 46, line: 1, messageId: 'useToHaveCount' },
      ],
      output: 'await expect(files).not.toHaveCount(1)',
    },
  ],
  valid: [
    'await expect(files).toHaveCount(1)',
    "expect(files.name).toBe('file')",
    "expect(files['name']).toBe('file')",
    "expect(files[`name`]).toBe('file')",
    'expect(result).toBe(true)',
    `expect(user.getUserName(5)).not.toEqual('Paul')`,
    `expect(user.getUserName(5)).not.toEqual('Paul')`,
    'expect(a)',
  ],
});
