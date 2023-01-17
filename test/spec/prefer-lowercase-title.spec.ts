import * as dedent from 'dedent';
import rule from '../../src/rules/prefer-lowercase-title';
import { runRuleTester } from '../utils/rule-tester';

const messageId = 'unexpectedLowercase';

runRuleTester('prefer-lowercase-title', rule, {
  valid: [
    'randomFunction()',
    'foo.bar()',
    "test('foo Bar', () => {})",
    'test(`foo`, () => {})',
    'test("<Foo/>", () => {})',
    'test("123 foo", () => {})',
    'test("42", () => {})',
    'test(``, () => {})',
    'test("", () => {})',
    'test(42, () => {})',
    "test.fixme('foo', () => {})",
    "test.skip('foo', () => {})",
    "test.only('foo Bar', () => {})",
    'test["fixme"]("foo", () => {})',
    'test["skip"](`foo`, () => {})',
    'test.describe()',
    "test.describe('foo Bar', () => {})",
    'test.describe(`foo`, () => {})',
    'test["describe"]("<Foo/>", () => {})',
    'test[`describe`]("123 foo", () => {})',
    'test.describe("42", () => {})',
    'test.describe(``)',
    'test.describe("")',
    'test.describe(42)',
    "test.describe.skip('foo Bar', () => {})",
    'test.describe.skip(`foo`, () => {})',
    "test.describe.fixme('foo', () => {})",
    "test.describe.only('foo', () => {})",
    "test.describe.parallel.skip('foo Bar', () => {})",
    'test.describe.parallel.skip(`foo`, () => {})',
    "test.describe.parallel.fixme('foo', () => {})",
    "test.describe.parallel.only('foo Bar Baz', () => {})",
    "test.describe.serial.skip('foo', () => {})",
    "test.describe[`serial`].fixme('foo', () => {})",
    "test.describe['serial'].only('foo', () => {})",
  ],
  invalid: [
    {
      code: "test('Foo',  () => {})",
      output: "test('foo',  () => {})",
      errors: [
        {
          messageId,
          data: { method: 'test' },
          line: 1,
          column: 6,
          endColumn: 11,
        },
      ],
    },
    {
      code: 'test(`Foo bar`,  () => {})',
      output: 'test(`foo bar`,  () => {})',
      errors: [
        {
          messageId,
          data: { method: 'test' },
          line: 1,
          column: 6,
          endColumn: 15,
        },
      ],
    },
    {
      code: "test.skip('Foo Bar',  () => {})",
      output: "test.skip('foo Bar',  () => {})",
      errors: [
        {
          messageId,
          data: { method: 'test' },
          line: 1,
          column: 11,
          endColumn: 20,
        },
      ],
    },
    {
      code: 'test.skip(`Foo`,  () => {})',
      output: 'test.skip(`foo`,  () => {})',
      errors: [
        {
          messageId,
          data: { method: 'test' },
          line: 1,
          column: 11,
          endColumn: 16,
        },
      ],
    },
    {
      code: "test['fixme']('Foo',  () => {})",
      output: "test['fixme']('foo',  () => {})",
      errors: [
        {
          messageId,
          data: { method: 'test' },
          line: 1,
          column: 15,
          endColumn: 20,
        },
      ],
    },
    {
      code: 'test[`only`](`Foo`,  () => {})',
      output: 'test[`only`](`foo`,  () => {})',
      errors: [
        {
          messageId,
          data: { method: 'test' },
          line: 1,
          column: 14,
          endColumn: 19,
        },
      ],
    },
    {
      code: "test.describe('Foo bar',  () => {})",
      output: "test.describe('foo bar',  () => {})",
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 15,
          endColumn: 24,
        },
      ],
    },
    {
      code: 'test[`describe`](`Foo Bar`,  () => {})',
      output: 'test[`describe`](`foo Bar`,  () => {})',
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 18,
          endColumn: 27,
        },
      ],
    },
    {
      code: "test.describe.skip('Foo',  () => {})",
      output: "test.describe.skip('foo',  () => {})",
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 20,
          endColumn: 25,
        },
      ],
    },
    {
      code: "test.describe.fixme('Foo',  () => {})",
      output: "test.describe.fixme('foo',  () => {})",
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 21,
          endColumn: 26,
        },
      ],
    },
    {
      code: 'test[`describe`]["only"]("Foo",  () => {})',
      output: 'test[`describe`]["only"]("foo",  () => {})',
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 26,
          endColumn: 31,
        },
      ],
    },
    {
      code: "test.describe.parallel.skip('Foo',  () => {})",
      output: "test.describe.parallel.skip('foo',  () => {})",
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 29,
          endColumn: 34,
        },
      ],
    },
    {
      code: 'test.describe.parallel.fixme(`Foo`,  () => {})',
      output: 'test.describe.parallel.fixme(`foo`,  () => {})',
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 30,
          endColumn: 35,
        },
      ],
    },
    {
      code: 'test.describe.parallel.only("Foo",  () => {})',
      output: 'test.describe.parallel.only("foo",  () => {})',
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 29,
          endColumn: 34,
        },
      ],
    },
    {
      code: "test.describe.serial.skip('Foo',  () => {})",
      output: "test.describe.serial.skip('foo',  () => {})",
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 27,
          endColumn: 32,
        },
      ],
    },
    {
      code: 'test.describe.serial.fixme(`Foo`,  () => {})',
      output: 'test.describe.serial.fixme(`foo`,  () => {})',
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 28,
          endColumn: 33,
        },
      ],
    },
    {
      code: 'test.describe.serial.only("Foo",  () => {})',
      output: 'test.describe.serial.only("foo",  () => {})',
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 27,
          endColumn: 32,
        },
      ],
    },
  ],
});

runRuleTester('prefer-lowercase-title with ignore=test.describe', rule, {
  valid: [
    {
      code: "test.describe('Foo', () => {})",
      options: [{ ignore: ['test.describe'] }],
    },
    {
      code: 'test.describe.parallel(`Foo`, () => {})',
      options: [{ ignore: ['test.describe'] }],
    },
    {
      code: 'test.describe.skip(`Foo`, () => {})',
      options: [{ ignore: ['test.describe'] }],
    },
  ],
  invalid: [
    {
      code: "test('Foo', () => {})",
      output: "test('foo', () => {})",
      options: [{ ignore: ['test.describe'] }],
      errors: [
        {
          messageId,
          data: { method: 'test' },
          line: 1,
          column: 6,
          endColumn: 11,
        },
      ],
    },
  ],
});

runRuleTester('prefer-lowercase-title with ignore=test', rule, {
  valid: [
    {
      code: "test('Foo', () => {})",
      options: [{ ignore: ['test'] }],
    },
    {
      code: 'test(`Foo`, () => {})',
      options: [{ ignore: ['test'] }],
    },
    {
      code: 'test.only(`Foo`, () => {})',
      options: [{ ignore: ['test'] }],
    },
  ],
  invalid: [
    {
      code: "test.describe('Foo', () => {})",
      output: "test.describe('foo', () => {})",
      options: [{ ignore: ['test'] }],
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 1,
          column: 15,
          endColumn: 20,
        },
      ],
    },
  ],
});

runRuleTester('prefer-lowercase-title with allowedPrefixes', rule, {
  valid: [
    {
      code: "test('GET /live', () => {})",
      options: [{ allowedPrefixes: ['GET'] }],
    },
    {
      code: 'test("POST /live", () => {})',
      options: [{ allowedPrefixes: ['GET', 'POST'] }],
    },
    {
      code: 'test(`PATCH /live`, () => {})',
      options: [{ allowedPrefixes: ['GET', 'PATCH'] }],
    },
  ],
  invalid: [
    {
      code: 'test(`POST /live`, () => {})',
      output: 'test(`pOST /live`, () => {})',
      options: [{ allowedPrefixes: ['GET'] }],
      errors: [
        {
          messageId,
          data: { method: 'test' },
          line: 1,
          column: 6,
          endColumn: 18,
        },
      ],
    },
  ],
});

runRuleTester('prefer-lowercase-title with ignoreTopLevelDescribe', rule, {
  valid: [
    {
      code: 'describe("MyClass", () => {});',
      options: [{ ignoreTopLevelDescribe: true }],
    },
    {
      code: dedent`
        test.describe('MyClass', () => {
          test.describe('#myMethod', () => {
            test('does things', () => {});
          });
        });
      `,
      options: [{ ignoreTopLevelDescribe: true }],
    },
  ],
  invalid: [
    {
      code: 'test("Works!", () => {});',
      output: 'test("works!", () => {});',
      options: [{ ignoreTopLevelDescribe: true }],
      errors: [
        {
          messageId,
          data: { method: 'test' },
          line: 1,
          column: 6,
          endColumn: 14,
        },
      ],
    },
    {
      code: dedent`
        test.describe('MyClass', () => {
          test.describe('MyMethod', () => {
            test('Does things', () => {});
          });
        });
      `,
      output: dedent`
        test.describe('MyClass', () => {
          test.describe('myMethod', () => {
            test('does things', () => {});
          });
        });
      `,
      options: [{ ignoreTopLevelDescribe: true }],
      errors: [
        {
          messageId,
          data: { method: 'test.describe' },
          line: 2,
          column: 17,
          endColumn: 27,
        },
        {
          messageId,
          data: { method: 'test' },
          line: 3,
          column: 10,
          endColumn: 23,
        },
      ],
    },
  ],
});
