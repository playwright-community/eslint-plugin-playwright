import rule from '../../src/rules/require-top-level-describe';
import * as dedent from 'dedent';
import { runRuleTester } from '../utils/rule-tester';

const invalid = (code: string, messageId: string) => ({
  code,
  errors: [{ messageId }],
});

runRuleTester('require-top-level-describe', rule, {
  valid: [
    'foo()',
    'test.info()',
    'test.describe("suite", () => { test("foo") });',
    'test.describe.only("suite", () => { test.beforeAll("my beforeAll") });',
    'test.describe.parallel("suite", () => { test.beforeEach("my beforeAll") });',
    'test.describe.serial("suite", () => { test.afterAll("my afterAll") });',
    'test.describe.parallel.fixme("suite", () => { test.afterEach("my afterEach") });',
    dedent`
      test.describe("suite", () => {
        test.beforeEach("a", () => {});
        test.describe("b", () => {});
        test("c", () => {})
      });
    `,
    dedent`
      test.describe("suite", () => {
        test("foo", () => {})
        test.describe("another suite", () => {});
        test("my other test", () => {})
      });
    `,
    dedent`
      test.describe('one', () => {});
      test.describe('two', () => {});
      test.describe('three', () => {});
    `,
    {
      code: dedent`
        test.describe('one', () => {
          test.describe('two', () => {});
          test.describe('three', () => {});
        });
      `,
      options: [{ maxTopLevelDescribes: 1 }],
    },
  ],
  invalid: [
    // Top level hooks
    {
      code: 'test.beforeAll(() => {})',
      errors: [
        { messageId: 'unexpectedHook', line: 1, column: 1, endColumn: 15 },
      ],
    },
    {
      code: 'test.beforeEach(() => {})',
      errors: [
        { messageId: 'unexpectedHook', line: 1, column: 1, endColumn: 16 },
      ],
    },
    {
      code: 'test.afterAll(() => {})',
      errors: [
        { messageId: 'unexpectedHook', line: 1, column: 1, endColumn: 14 },
      ],
    },
    {
      code: 'test.afterEach(() => {})',
      errors: [
        { messageId: 'unexpectedHook', line: 1, column: 1, endColumn: 15 },
      ],
    },
    {
      code: 'test["afterEach"](() => {})',
      errors: [
        { messageId: 'unexpectedHook', line: 1, column: 1, endColumn: 18 },
      ],
    },
    {
      code: 'test[`afterEach`](() => {})',
      errors: [
        { messageId: 'unexpectedHook', line: 1, column: 1, endColumn: 18 },
      ],
    },
    {
      code: dedent`
        test.describe("suite", () => {});
        test.afterAll(() => {})
      `,
      errors: [
        {
          messageId: 'unexpectedHook',
          line: 2,
          column: 1,
          endLine: 2,
          endColumn: 14,
        },
      ],
    },
    // Top level tests
    {
      code: 'test("foo", () => {})',
      errors: [
        { messageId: 'unexpectedTest', line: 1, column: 1, endColumn: 5 },
      ],
    },
    {
      code: 'test.skip("foo", () => {})',
      errors: [
        { messageId: 'unexpectedTest', line: 1, column: 1, endColumn: 10 },
      ],
    },
    {
      code: 'test.fixme("foo", () => {})',
      errors: [
        { messageId: 'unexpectedTest', line: 1, column: 1, endColumn: 11 },
      ],
    },
    {
      code: 'test.only("foo", () => {})',
      errors: [
        { messageId: 'unexpectedTest', line: 1, column: 1, endColumn: 10 },
      ],
    },
    {
      code: 'test["only"]("foo", () => {})',
      errors: [
        { messageId: 'unexpectedTest', line: 1, column: 1, endColumn: 13 },
      ],
    },
    {
      code: 'test[`only`]("foo", () => {})',
      errors: [
        { messageId: 'unexpectedTest', line: 1, column: 1, endColumn: 13 },
      ],
    },
    {
      code: dedent`
        test("foo", () => {})
        test.describe("suite", () => {});
      `,
      errors: [
        { messageId: 'unexpectedTest', line: 1, column: 1, endColumn: 5 },
      ],
    },
    {
      code: dedent`
        test("foo", () => {})
        test.describe("suite", () => {
          test("bar", () => {})
        });
      `,
      errors: [
        { messageId: 'unexpectedTest', line: 1, column: 1, endColumn: 5 },
      ],
    },
    // Too many describes
    {
      code: dedent`
        test.describe('one', () => {});
        test.describe.only('two', () => {});
        test.describe.parallel('three', () => {});
      `,
      options: [{ maxTopLevelDescribes: 2 }],
      errors: [
        { messageId: 'tooManyDescribes', line: 3, column: 1, endColumn: 23 },
      ],
    },
    {
      code: dedent`
        test.describe('one', () => {
          test.describe('one (nested)', () => {});
          test.describe('two (nested)', () => {});
        });

        test["describe"].only('two', () => {
          test.describe('one (nested)', () => {});
          test.describe.serial.only('two (nested)', () => {});
          test.describe.fixme('three (nested)', () => {});
        });

        test[\`describe\`][\`fixme\`]('three', () => {
          test.describe('one (nested)', () => {});
          test.describe.serial('two (nested)', () => {});
          test.describe.parallel('three (nested)', () => {});
        });
      `,
      options: [{ maxTopLevelDescribes: 2 }],
      errors: [
        { messageId: 'tooManyDescribes', line: 12, column: 1, endColumn: 26 },
      ],
    },
    {
      code: dedent`
        test.describe('one', () => {});
        test.describe.fixme.only('two', () => {});
        test.describe.fixme('three', () => {});
      `,
      options: [{ maxTopLevelDescribes: 1 }],
      errors: [
        { messageId: 'tooManyDescribes', line: 2, column: 1, endColumn: 25 },
        { messageId: 'tooManyDescribes', line: 3, column: 1, endColumn: 20 },
      ],
    },
  ],
});
