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
    {
      code: 'expect(await files.count()).toBe(foo)',
      errors: [
        { column: 29, endColumn: 33, line: 1, messageId: 'useToHaveCount' },
      ],
      output: 'await expect(files).toHaveCount(foo)',
    },
    // Global aliases
    {
      code: 'assert(await files.count()).toBe(1)',
      errors: [
        { column: 29, endColumn: 33, line: 1, messageId: 'useToHaveCount' },
      ],
      output: 'await assert(files).toHaveCount(1)',
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
    },
  ],
  valid: [
    { code: 'await expect(files).toHaveCount(1)' },
    { code: 'await expect(files).toHaveCount(foo)' },
    { code: 'await expect(files.length).toBe(1)' },
    { code: "expect(files.name).toBe('file')" },
    { code: "expect(files['name']).toBe('file')" },
    { code: "expect(files[`name`]).toBe('file')" },
    { code: 'expect(result).toBe(true)' },
    { code: `expect(user.getUserName(5)).not.toEqual('Paul')` },
    { code: `expect(user.getUserName(5)).not.toEqual('Paul')` },
    { code: 'expect(a)' },
    {
      code: `expect(await page.evaluate(() => document.querySelectorAll("*").length)).toBe(10);`,
    },
    // Global aliases
    {
      code: 'await assert(files).toHaveCount(1)',
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
    },
  ],
});
