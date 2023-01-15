import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/max-nested-describe';
import dedent = require('dedent');

const messageId = 'exceededMaxDepth';

runRuleTester('max-nested-describe', rule, {
  valid: [
    'test.describe("describe tests", () => {});',
    'test.describe.only("describe focus tests", () => {});',
    'test.describe.serial.only("describe serial focus tests", () => {});',
    'test.describe.serial.skip("describe serial focus tests", () => {});',
    'test.describe.parallel.fixme("describe serial focus tests", () => {});',
    {
      code: dedent`
        test('foo', function () {
          expect(true).toBe(true);
        });
        test('bar', () => {
          expect(true).toBe(true);
        });
      `,
      options: [{ max: 0 }],
    },
    {
      code: dedent`
        test.describe('foo', function() {
          test.describe('bar', function () {
            test.describe('baz', function () {
              test.describe('qux', function () {
                test.describe('quxx', function () {
                  test('should get something', () => {
                    expect(getSomething()).toBe('Something');
                  });
                });
              });
            });
          });
        });
      `,
    },
    {
      code: dedent`
        test.describe('foo', () => {
          test.describe('bar', () => {
            test.describe('baz', () => {
              test.describe('qux', () => {
                test('foo', () => {
                  expect(someCall().property).toBe(true);
                });
                test('bar', () => {
                  expect(universe.answer).toBe(42);
                });
              });
              test.describe('quxx', () => {
                test('baz', () => {
                  expect(2 + 2).toEqual(4);
                });
              });
            });
          });
        });
      `,
      options: [{ max: 4 }],
    },
    {
      code: dedent`
        test.describe('foo', () => {
          test.describe.only('bar', () => {
            test.describe.skip('baz', () => {
              test('something', async () => {
                expect('something').toBe('something');
              });
            });
          });
        });
      `,
      options: [{ max: 3 }],
    },
    {
      code: dedent`
        describe('foo', () => {
          describe.only('bar', () => {
            describe.skip('baz', () => {
              test('something', async () => {
                expect('something').toBe('something');
              });
            });
          });
        });
      `,
      options: [{ max: 3 }],
    },
  ],
  invalid: [
    {
      code: dedent`
        test.describe('foo', function() {
          test.describe('bar', function () {
            test.describe('baz', function () {
              test.describe('qux', function () {
                test.describe('quxx', function () {
                  test.describe('over limit', function () {
                    test('should get something', () => {
                      expect(getSomething()).toBe('Something');
                    });
                  });
                });
              });
            });
          });
        });
      `,
      errors: [{ messageId, line: 6, column: 11, endLine: 6, endColumn: 24 }],
    },
    {
      code: dedent`
        describe('foo', function() {
          describe('bar', function () {
            describe('baz', function () {
              describe('qux', function () {
                describe('quxx', function () {
                  describe('over limit', function () {
                    test('should get something', () => {
                      expect(getSomething()).toBe('Something');
                    });
                  });
                });
              });
            });
          });
        });
      `,
      errors: [{ messageId, line: 6, column: 11, endLine: 6, endColumn: 19 }],
    },
    {
      code: dedent`
        test.describe('foo', () => {
          test.describe('bar', () => {
            test["describe"]('baz', () => {
              test.describe('baz1', () => {
                test.describe('baz2', () => {
                  test[\`describe\`]('baz3', () => {
                    test('should get something', () => {
                      expect(getSomething()).toBe('Something');
                    });
                  });

                  test.describe('baz4', () => {
                    it('should get something', () => {
                      expect(getSomething()).toBe('Something');
                    });
                  });
                });
              });
            });

            test.describe('qux', function () {
              test('should get something', () => {
                expect(getSomething()).toBe('Something');
              });
            });
          })
        });
      `,
      options: [{ max: 5 }],
      errors: [
        { messageId, line: 6, column: 11, endLine: 6, endColumn: 27 },
        { messageId, line: 12, column: 11, endLine: 12, endColumn: 24 },
      ],
    },
    {
      code: dedent`
        test.describe.only('foo', function() {
          test.describe('bar', function() {
            test.describe('baz', function() {
              test.describe('qux', function() {
                test.describe('quux', function() {
                  test.describe.only('quuz', function() { });
                });
              });
            });
          });
        });
      `,
      errors: [{ messageId, line: 6, column: 11, endLine: 6, endColumn: 29 }],
    },
    {
      code: dedent`
        test.describe.serial.only('foo', function() {
          test.describe('bar', function() {
            test.describe('baz', function() {
              test.describe('qux', function() {
                test.describe('quux', function() {
                  test.describe('quuz', function() { });
                });
              });
            });
          });
        });
      `,
      errors: [{ messageId, line: 6, column: 11, endLine: 6, endColumn: 24 }],
    },
    {
      code: dedent`
        test.describe('qux', () => {
          test('should get something', () => {
            expect(getSomething()).toBe('Something');
          });
        });
      `,
      errors: [{ messageId, line: 1, column: 1, endLine: 1, endColumn: 14 }],
      options: [{ max: 0 }],
    },
    {
      code: dedent`
        test.describe('foo', () => {
          test.describe('bar', () => {
            test.describe('baz', () => {
              test("test1", () => {
                expect(true).toBe(true);
              });
              test("test2", () => {
                expect(true).toBe(true);
              });
            });
          });
        });
      `,
      errors: [{ messageId, line: 3, column: 5, endLine: 3, endColumn: 18 }],
      options: [{ max: 2 }],
    },
  ],
});
