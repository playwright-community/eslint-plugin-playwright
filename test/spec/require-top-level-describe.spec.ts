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
    invalid('test.beforeAll(() => {})', 'unexpectedHook'),
    invalid('test.beforeEach(() => {})', 'unexpectedHook'),
    invalid('test.afterAll(() => {})', 'unexpectedHook'),
    invalid('test.afterEach(() => {})', 'unexpectedHook'),
    invalid('test["afterEach"](() => {})', 'unexpectedHook'),
    invalid('test[`afterEach`](() => {})', 'unexpectedHook'),
    {
      code: dedent`
        test.describe("suite", () => {});
        test.afterAll(() => {})
      `,
      errors: [{ messageId: 'unexpectedHook' }],
    },
    // Top level tests
    invalid('test("foo", () => {})', 'unexpectedTest'),
    invalid('test.skip("foo", () => {})', 'unexpectedTest'),
    invalid('test.fixme("foo", () => {})', 'unexpectedTest'),
    invalid('test.only("foo", () => {})', 'unexpectedTest'),
    invalid('test["only"]("foo", () => {})', 'unexpectedTest'),
    invalid('test[`only`]("foo", () => {})', 'unexpectedTest'),
    {
      code: dedent`
        test("foo", () => {})
        test.describe("suite", () => {});
      `,
      errors: [{ messageId: 'unexpectedTest' }],
    },
    {
      code: dedent`
        test("foo", () => {})
        test.describe("suite", () => {
          test("bar", () => {})
        });
      `,
      errors: [{ messageId: 'unexpectedTest' }],
    },
    // Too many describes
    {
      code: dedent`
        test.describe('one', () => {});
        test.describe.only('two', () => {});
        test.describe.parallel('three', () => {});
      `,
      options: [{ maxTopLevelDescribes: 2 }],
      errors: [{ messageId: 'tooManyDescribes', line: 3 }],
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
      errors: [{ messageId: 'tooManyDescribes', line: 12 }],
    },
    {
      code: dedent`
        test.describe('one', () => {});
        test.describe.fixme.only('two', () => {});
        test.describe.fixme('three', () => {});
      `,
      options: [{ maxTopLevelDescribes: 1 }],
      errors: [
        { messageId: 'tooManyDescribes', line: 2 },
        { messageId: 'tooManyDescribes', line: 3 },
      ],
    },
  ],
});
