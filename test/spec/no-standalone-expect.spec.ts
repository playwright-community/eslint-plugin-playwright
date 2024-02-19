import dedent from 'dedent';
import rule from '../../src/rules/no-standalone-expect';
import { runRuleTester } from '../utils/rule-tester';

const messageId = 'unexpectedExpect';

runRuleTester('no-standalone-expect', rule, {
  invalid: [
    {
      code: "(() => {})('testing', () => expect(true).toBe(false))",
      errors: [{ column: 29, endColumn: 53, messageId }],
    },
    {
      code: dedent`
        test.describe('scenario', () => {
          const t = Math.random() ? test.only : test;
          t('testing', () => expect(true).toBe(false));
        });
      `,
      errors: [{ column: 22, endColumn: 46, messageId }],
    },
    {
      code: dedent`
        it.describe('scenario', () => {
          it('testing', () => expect(true).toBe(false));
        });
      `,
      errors: [{ column: 23, endColumn: 47, messageId }],
    },
    {
      code: 'test.describe("a test", () => { expect(1).toBe(1); });',
      errors: [{ column: 33, endColumn: 50, messageId }],
    },
    {
      code: 'test.describe("a test", () => expect(6).toBe(1));',
      errors: [{ column: 31, endColumn: 48, messageId }],
    },
    {
      code: 'test.describe("a test", () => { const func = () => { expect(6).toBe(1); }; expect(1).toBe(1); });',
      errors: [{ column: 76, endColumn: 93, messageId }],
    },
    {
      code: 'test.describe("a test", () => {  test("foo", () => { expect(1).toBe(1); }); expect(1).toBe(1); });',
      errors: [{ column: 77, endColumn: 94, messageId }],
    },
    {
      code: 'expect(1).toBe(1);',
      errors: [{ column: 1, endColumn: 18, messageId }],
    },
    {
      code: '{expect(1).toBe(1)}',
      errors: [{ column: 2, endColumn: 19, messageId }],
    },
    {
      code: dedent`
        import { expect as pleaseExpect } from '@playwright/test';
        test.describe("a test", () => { pleaseExpect(1).toBe(1); });
      `,
      errors: [{ column: 33, endColumn: 56, messageId }],
      parserOptions: { sourceType: 'module' },
    },
  ],
  valid: [
    'expect.any(String)',
    'expect.extend({})',
    'test.describe("a test", () => { test("an it", () => {expect(1).toBe(1); }); });',
    'test.describe("a test", () => { test("an it", () => { const func = () => { expect(1).toBe(1); }; }); });',
    'test.describe("a test", () => { const func = () => { expect(1).toBe(1); }; });',
    'test.describe("a test", () => { function func() { expect(1).toBe(1); }; });',
    'test.describe("a test", () => { const func = function(){ expect(1).toBe(1); }; });',
    'test("an it", () => expect(1).toBe(1))',
    'const func = function(){ expect(1).toBe(1); };',
    'const func = () => expect(1).toBe(1);',
    '{}',
    'test.only("an only", value => { expect(value).toBe(true); });',
    'test.concurrent("an concurrent", value => { expect(value).toBe(true); });',
    'class Helper { foo() { expect(1).toBe(1); } }',
    'class Helper { foo = () => { expect(1).toBe(1); } }',
    // Global aliases
    {
      code: dedent`
        it.describe('scenario', () => {
          it('testing', () => expect(true));
        });
      `,
      settings: {
        playwright: {
          globalAliases: { test: ['it'] },
        },
      },
    },
  ],
});
