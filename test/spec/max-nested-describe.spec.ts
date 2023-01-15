import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/max-nested-describe';

const messageId = 'exceededMaxDepth';

runRuleTester('max-nested-describe', rule, {
  invalid: [
    {
      code: `
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
      errors: [{ messageId, line: 7, column: 19, endLine: 7, endColumn: 32 }],
    },
    {
      code: `
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
      errors: [{ messageId, line: 7, column: 19, endLine: 7, endColumn: 27 }],
    },
    {
      code: `
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
        { messageId, line: 7, column: 19, endLine: 7, endColumn: 35 },
        { messageId, line: 13, column: 19, endLine: 13, endColumn: 32 },
      ],
    },
    {
      code: `
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
      errors: [{ messageId, line: 7, column: 19, endLine: 7, endColumn: 37 }],
    },
    {
      code: `
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
      errors: [{ messageId, line: 7, column: 19, endLine: 7, endColumn: 32 }],
    },
    {
      code: `
        test.describe('qux', () => {
          test('should get something', () => {
            expect(getSomething()).toBe('Something');
          });
        });
      `,
      errors: [{ messageId, line: 2, column: 9, endLine: 2, endColumn: 22 }],
      options: [{ max: 0 }],
    },
    {
      code: `
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
      errors: [{ messageId, line: 4, column: 13, endLine: 4, endColumn: 26 }],
      options: [{ max: 2 }],
    },
  ],
  valid: [
    'test.describe("describe tests", () => {});',
    'test.describe.only("describe focus tests", () => {});',
    'test.describe.serial.only("describe serial focus tests", () => {});',
    'test.describe.serial.skip("describe serial focus tests", () => {});',
    'test.describe.parallel.fixme("describe serial focus tests", () => {});',
    {
      code: `
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
      code: `
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
      code: `
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
      code: `
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
      code: `
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
});
