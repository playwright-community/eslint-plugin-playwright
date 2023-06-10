import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/no-conditional-in-test';
import dedent = require('dedent');

const messageId = 'conditionalInTest';

runRuleTester('no-conditional-in-test', rule, {
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
    `test('nested', async ({ page }) => {
      const [request] = await Promise.all([
        page.waitForRequest(request => request.url() === 'foo' && request.method() === 'GET'),
        page.click('button'),
      ]);
    })`,
    `test('nested', async ({ page }) => {
      await page.waitForRequest(request => request.url() === 'foo' && request.method() === 'GET')
    })`,
    `test.fixme('nested', async ({ page }) => {
      await page.waitForRequest(request => request.url() === 'foo' && request.method() === 'GET')
    })`,
    `test.only('nested', async ({ page }) => {
      await page.waitForRequest(request => request.url() === 'foo' && request.method() === 'GET')
    })`,
    `test('nested', () => {
      test.skip(true && false)
    })`,
    `test('nested', () => {
      test.skip(
        ({ baseURL }) => (baseURL || "").includes("localhost"),
        "message",
      )
    })`,
    `test('test', async ({ page }) => {
      await test.step('step', async () => {
        await page.waitForRequest(request => request.url() === 'foo' && request.method() === 'GET')
      });
    })`,
  ],
  invalid: [
    {
      code: 'test("foo", () => { if (true) { expect(1).toBe(1); } });',
      errors: [{ messageId, line: 1, column: 21, endLine: 1, endColumn: 53 }],
    },
    {
      code: dedent`
        test.describe("foo", () => {
          test("bar", () => {
            if (someCondition()) {
              expect(1).toBe(1);
            } else {
              expect(2).toBe(2);
            }
          });
        });
      `,
      errors: [{ messageId, line: 3, column: 5, endLine: 7, endColumn: 6 }],
    },
    {
      code: dedent`
        describe('foo', () => {
          test('bar', () => {
            if ('bar') {}
          })
        })
      `,
      errors: [{ messageId, line: 3, column: 5, endLine: 3, endColumn: 18 }],
    },
    {
      code: dedent`
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
      errors: [
        { messageId, line: 3, column: 5, endLine: 3, endColumn: 18 },
        { messageId, line: 6, column: 5, endLine: 6, endColumn: 18 },
        { messageId, line: 7, column: 5, endLine: 7, endColumn: 19 },
      ],
    },
    {
      code: dedent`
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
      `,
      errors: [{ messageId, line: 2, column: 3, endLine: 9, endColumn: 4 }],
    },
    {
      code: dedent`
        test('foo', () => {
          if ('bar') {}
        })
      `,
      errors: [{ messageId, line: 2, column: 3, endLine: 2, endColumn: 16 }],
    },
    {
      code: dedent`
        test('foo', () => {
          bar ? expect(1).toBe(1) : expect(2).toBe(2);
        })
      `,
      errors: [{ messageId, line: 2, column: 3, endLine: 2, endColumn: 46 }],
    },
    {
      code: dedent`
        test('foo', function () {
          bar ? expect(1).toBe(1) : expect(2).toBe(2);
        })
      `,
      errors: [{ messageId, line: 2, column: 3, endLine: 2, endColumn: 46 }],
    },
    {
      code: dedent`
        test('foo', function () {
          if ('bar') {}
        })
      `,
      errors: [{ messageId, line: 2, column: 3, endLine: 2, endColumn: 16 }],
    },
    {
      code: dedent`
        test('foo', async function ({ page }) {
          await asyncFunc();
          if ('bar') {}
        })
      `,
      errors: [{ messageId, line: 3, column: 3, endLine: 3, endColumn: 16 }],
    },
    {
      code: dedent`
        test.skip('foo', () => {
          if ('bar') {}
        })
      `,
      errors: [{ messageId, line: 2, column: 3, endLine: 2, endColumn: 16 }],
    },
    {
      code: dedent`
        test.skip('foo', async ({ page }) => {
          await asyncFunc();
          if ('bar') {}
        })
      `,
      errors: [{ messageId, line: 3, column: 3, endLine: 3, endColumn: 16 }],
    },
    {
      code: dedent`
        test.skip('foo', function () {
          if ('bar') {}
        })
      `,
      errors: [{ messageId, line: 2, column: 3, endLine: 2, endColumn: 16 }],
    },
    {
      code: dedent`
        test.only('foo', () => {
          if ('bar') {}
        })
      `,
      errors: [{ messageId, line: 2, column: 3, endLine: 2, endColumn: 16 }],
    },
    {
      code: dedent`
        test.fixme('foo', () => {
          if ('bar') {}
        })
      `,
      errors: [{ messageId, line: 2, column: 3, endLine: 2, endColumn: 16 }],
    },
    {
      code: dedent`
        test('foo', () => {
          callExpression()
          if ('bar') {}
        })
      `,
      errors: [{ messageId, line: 3, column: 3, endLine: 3, endColumn: 16 }],
    },
    {
      code: dedent`
        testDetails.forEach((detail) => {
          test(detail.name, () => {
            if (detail.fail) {
              test.fail();
            } else {
              expect(true).toBe(true);
            }
          })
        });
      `,
      errors: [{ messageId, line: 3, column: 5, endLine: 7, endColumn: 6 }],
    },
    {
      code: dedent`
        test('test', async ({ page }) => {
          await test.step('step', async () => {
            if (true) {}
          });
        });
      `,
      errors: [{ messageId, line: 3, column: 5, endLine: 3, endColumn: 17 }],
    },
  ],
});
