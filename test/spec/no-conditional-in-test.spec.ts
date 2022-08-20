import { Errors, runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/no-conditional-in-test';

const invalid = (
  code: string,
  errors: Errors = [{ messageId: 'conditionalInTest' }]
) => ({ code, errors });

runRuleTester('no-conditional-in-test', rule, {
  invalid: [
    invalid('test("foo", () => { if (true) { expect(1).toBe(1); } });'),
    invalid(`
      test.describe("foo", () => {
        test("bar", () => {
          if (someCondition()) {
            expect(1).toBe(1);
          } else {
            expect(2).toBe(2);
          }
        });
      });
    `),
    invalid(`
      describe('foo', () => {
        test('bar', () => {
          if ('bar') {}
        })
      })
    `),
    invalid(
      `
      describe('foo', () => {
        test('bar', () => {
          if ('bar') {}
        })
        test('baz', () => {
          if ('qux') {}
          if ('quux') {}
        })
      })
    `,
      [
        { messageId: 'conditionalInTest' },
        { messageId: 'conditionalInTest' },
        { messageId: 'conditionalInTest' },
      ]
    ),
    invalid(`
      test("foo", function () {
        switch(someCondition()) {
          case 1:
            expect(1).toBe(1);
            break;
          case 2:
            expect(2).toBe(2);
            break;
        }
      });
    `),
    invalid(`
      test('foo', () => {
        if ('bar') {}
      })
    `),
    invalid(`
      test('foo', () => {
        bar ? expect(1).toBe(1) : expect(2).toBe(2);
      })
    `),
    invalid(`
      test('foo', function () {
        bar ? expect(1).toBe(1) : expect(2).toBe(2);
      })
    `),
    invalid(`
      test('foo', function () {
        if ('bar') {}
      })
    `),
    invalid(`
      test('foo', async function ({ page }) {
        await asyncFunc();
        if ('bar') {}
      })
    `),
    invalid(`
      test.skip('foo', () => {
        if ('bar') {}
      })
    `),
    invalid(`
      test.skip('foo', async ({ page }) => {
        await asyncFunc();
        if ('bar') {}
      })
    `),
    invalid(`
      test.skip('foo', function () {
        if ('bar') {}
      })
    `),
    invalid(`
      test.only('foo', () => {
        if ('bar') {}
      })
    `),
    invalid(`
      test.fixme('foo', () => {
        if ('bar') {}
      })
    `),
    invalid(`
      test('foo', () => {
        callExpression()
        if ('bar') {}
      })
    `),
    invalid(`
      testDetails.forEach((detail) => {
        test(detail.name, () => {
          if (detail.fail) {
            test.fail();
          } else {
            expect(true).toBe(true);
          }
        })
      });
    `),
  ],
  valid: [
    'test("foo", () => { expect(1).toBe(1); });',
    'test.fixme("some broken test", () => { expect(1).toBe(1); });',
    'test.describe("foo", () => { if(true) { test("bar", () => { expect(true).toBe(true); }); } });',
    'test.skip(process.env.APP_VERSION === "v1", "There are no settings in v1");',
    'test("some slow test", () => { test.slow(); })',
    'const foo = bar ? foo : baz;',
    `test.describe('foo', () => {
        test.afterEach(() => {
          if ('bar') {}
        });
      })`,
    `test.describe('foo', () => {
        test.beforeEach(() => {
          if ('bar') {}
        });
      })`,
    `test.describe('foo', function () {
        test.beforeEach(function () {
          if ('bar') {}
        });
      })`,
    `test.describe.parallel('foo', function () {
        test.beforeEach(function () {
          if ('bar') {}
        });
      })`,
    `test.describe.parallel.only('foo', function () {
        test.beforeEach(function () {
          if ('bar') {}
        });
      })`,
    `test.describe.serial('foo', function () {
        test.beforeEach(function () {
          if ('bar') {}
        });
      })`,
    `test.describe.serial.only('foo', function () {
        test.beforeEach(function () {
          if ('bar') {}
        });
      })`,
    `const values = something.map((thing) => {
        if (thing.isFoo) {
          return thing.foo
        } else {
          return thing.bar;
        }
      });

      test.describe('valid', () => {
        test('still valid', () => {
          expect(values).toStrictEqual(['foo']);
        });
      });`,
    `describe('valid', () => {
        const values = something.map((thing) => {
          if (thing.isFoo) {
            return thing.foo
          } else {
            return thing.bar;
          }
        });

        test.describe('still valid', () => {
          test('really still valid', () => {
            expect(values).toStrictEqual(['foo']);
          });
        });
      });`,
    // Conditionals are only disallowed at the root level. Nested conditionals
    // are common and valid.
    `test('nested', () => {
      const [request] = await Promise.all([
        page.waitForRequest(request => request.url() === 'foo' && request.method() === 'GET'),
        page.click('button'),
      ]);
    })`,
    `test('nested', () => {
      await page.waitForRequest(request => request.url() === 'foo' && request.method() === 'GET')
    })`,
    `test('nested', () => {
      test.skip(true && false)
    })`,
  ],
});
