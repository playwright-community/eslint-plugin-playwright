import * as dedent from 'dedent';
import rule from '../../src/rules/require-top-level-describe';
import { runRuleTester } from '../utils/rule-tester';

runRuleTester('require-top-level-describe', rule, {
  invalid: [
    // Top level hooks
    {
      code: 'test.beforeAll(() => {})',
      errors: [
        { column: 1, endColumn: 15, line: 1, messageId: 'unexpectedHook' },
      ],
    },
    {
      code: 'test.beforeEach(() => {})',
      errors: [
        { column: 1, endColumn: 16, line: 1, messageId: 'unexpectedHook' },
      ],
    },
    {
      code: 'test.afterAll(() => {})',
      errors: [
        { column: 1, endColumn: 14, line: 1, messageId: 'unexpectedHook' },
      ],
    },
    {
      code: 'test.afterEach(() => {})',
      errors: [
        { column: 1, endColumn: 15, line: 1, messageId: 'unexpectedHook' },
      ],
    },
    {
      code: 'test["afterEach"](() => {})',
      errors: [
        { column: 1, endColumn: 18, line: 1, messageId: 'unexpectedHook' },
      ],
    },
    {
      code: 'test[`afterEach`](() => {})',
      errors: [
        { column: 1, endColumn: 18, line: 1, messageId: 'unexpectedHook' },
      ],
    },
    {
      code: dedent`
        test.describe("suite", () => {});
        test.afterAll(() => {})
      `,
      errors: [
        {
          column: 1,
          endColumn: 14,
          endLine: 2,
          line: 2,
          messageId: 'unexpectedHook',
        },
      ],
    },
    // Top level tests
    {
      code: 'test("foo", () => {})',
      errors: [
        { column: 1, endColumn: 5, line: 1, messageId: 'unexpectedTest' },
      ],
    },
    {
      code: 'test.skip("foo", () => {})',
      errors: [
        { column: 1, endColumn: 10, line: 1, messageId: 'unexpectedTest' },
      ],
    },
    {
      code: 'test.fixme("foo", () => {})',
      errors: [
        { column: 1, endColumn: 11, line: 1, messageId: 'unexpectedTest' },
      ],
    },
    {
      code: 'test.only("foo", () => {})',
      errors: [
        { column: 1, endColumn: 10, line: 1, messageId: 'unexpectedTest' },
      ],
    },
    {
      code: 'test["only"]("foo", () => {})',
      errors: [
        { column: 1, endColumn: 13, line: 1, messageId: 'unexpectedTest' },
      ],
    },
    {
      code: 'test[`only`]("foo", () => {})',
      errors: [
        { column: 1, endColumn: 13, line: 1, messageId: 'unexpectedTest' },
      ],
    },
    {
      code: dedent`
        test("foo", () => {})
        test.describe("suite", () => {});
      `,
      errors: [
        { column: 1, endColumn: 5, line: 1, messageId: 'unexpectedTest' },
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
        { column: 1, endColumn: 5, line: 1, messageId: 'unexpectedTest' },
      ],
    },
    // Too many describes
    {
      code: dedent`
        test.describe('one', () => {});
        test.describe.only('two', () => {});
        test.describe.parallel('three', () => {});
      `,
      errors: [
        { column: 1, endColumn: 23, line: 3, messageId: 'tooManyDescribes' },
      ],
      options: [{ maxTopLevelDescribes: 2 }],
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
      errors: [
        { column: 1, endColumn: 26, line: 12, messageId: 'tooManyDescribes' },
      ],
      options: [{ maxTopLevelDescribes: 2 }],
    },
    {
      code: dedent`
        test.describe('one', () => {});
        test.describe.fixme.only('two', () => {});
        test.describe.fixme('three', () => {});
      `,
      errors: [
        { column: 1, endColumn: 25, line: 2, messageId: 'tooManyDescribes' },
        { column: 1, endColumn: 20, line: 3, messageId: 'tooManyDescribes' },
      ],
      options: [{ maxTopLevelDescribes: 1 }],
    },
  ],
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
});
