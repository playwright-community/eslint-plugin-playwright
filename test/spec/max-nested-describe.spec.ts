import { runRuleTester, Errors } from '../utils/rule-tester';
import rule from '../../src/rules/max-nested-describe';

const invalid = (
  code: string,
  options: unknown[] = [],
  errors: Errors = [{ messageId: 'exceededMaxDepth' }]
) => ({ code, options, errors });

const valid = (code: string, options: unknown[] = []) => ({ code, options });

runRuleTester('max-nested-describe', rule, {
  invalid: [
    invalid(`
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
    `),
    invalid(`
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
    `),
    invalid(
      `
    test.describe('foo', () => {
      test.describe('bar', () => {
       test.describe('baz', () => {
        test.describe('baz1', () => {
          test.describe('baz2', () => {
            test.describe('baz3', () => {
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
      [{ max: 5 }],
      [{ messageId: 'exceededMaxDepth' }, { messageId: 'exceededMaxDepth' }]
    ),
    invalid(`
  test.describe.only('foo', function() {
    test.describe('bar', function() {
      test.describe('baz', function() {
        test.describe('qux', function() {
          test.describe('quux', function() {
            test.describe('quuz', function() {
            });
          });
        });
      });
    });
  });
  `),
    invalid(`
  test.describe.serial.only('foo', function() {
    test.describe('bar', function() {
      test.describe('baz', function() {
        test.describe('qux', function() {
          test.describe('quux', function() {
            test.describe('quuz', function() {
            });
          });
        });
      });
    });
  });
  `),
    invalid(
      `
    test.describe('qux', () => {
      test('should get something', () => {
        expect(getSomething()).toBe('Something');
      });
    });
  `,
      [{ max: 0 }]
    ),
    invalid(
      `
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
      [{ max: 2 }]
    ),
  ],
  valid: [
    'test.describe("describe tests", () => {});',
    'test.describe.only("describe focus tests", () => {});',
    'test.describe.serial.only("describe serial focus tests", () => {});',
    valid(
      `
    test('foo', function () {
      expect(true).toBe(true);
    });
    test('bar', () => {
      expect(true).toBe(true);
    });
    `,
      [{ max: 0 }]
    ),
    valid(`
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
    `),
    valid(
      `
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
      [{ max: 4 }]
    ),
    valid(
      `
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
      [{ max: 3 }]
    ),
    valid(
      `
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
      [{ max: 3 }]
    ),
  ],
});
