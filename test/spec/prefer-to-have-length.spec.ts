import rule from '../../src/rules/prefer-to-have-length';
import { runRuleTester } from '../utils/rule-tester';

runRuleTester('prefer-to-have-length', rule, {
  valid: [
    'expect(files).toHaveLength(1)',
    "expect(files.name).toBe('file')",
    "expect(files['name']).toBe('file')",
    "expect(files[`name`]).toBe('file')",
    'expect(result).toBe(true)',
    `expect(user.getUserName(5)).not.toEqual('Paul')`,
    `expect(user.getUserName(5)).not.toEqual('Paul')`,
    'expect(a)',
  ],
  invalid: [
    {
      code: 'expect(files.length).toBe(1)',
      output: 'expect(files).toHaveLength(1)',
      errors: [{ messageId: 'useToHaveLength', column: 22, line: 1 }],
    },
    {
      code: 'expect(files.length).not.toBe(1)',
      output: 'expect(files).not.toHaveLength(1)',
      errors: [{ messageId: 'useToHaveLength', column: 26, line: 1 }],
    },
    {
      code: 'expect(files["length"]).not.toBe(1)',
      output: 'expect(files).not.toHaveLength(1)',
      errors: [{ messageId: 'useToHaveLength', column: 29, line: 1 }],
    },
    {
      code: 'expect(files["length"]).not.toBe(1)',
      output: 'expect(files).not.toHaveLength(1)',
      errors: [{ messageId: 'useToHaveLength', column: 29, line: 1 }],
    },
    {
      code: 'expect(files.length).toEqual(1)',
      output: 'expect(files).toHaveLength(1)',
      errors: [{ messageId: 'useToHaveLength', column: 22, line: 1 }],
    },
    {
      code: 'expect(files.length).toStrictEqual(1)',
      output: 'expect(files).toHaveLength(1)',
      errors: [{ messageId: 'useToHaveLength', column: 22, line: 1 }],
    },
    {
      code: 'expect(files.length).not.toStrictEqual(1)',
      output: 'expect(files).not.toHaveLength(1)',
      errors: [{ messageId: 'useToHaveLength', column: 26, line: 1 }],
    },
  ],
});
