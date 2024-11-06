import { javascript, runRuleTester } from '../utils/rule-tester.js'
import rule from './valid-expect-in-promise.js'

runRuleTester('valid-expect-in-promise', rule, {
  invalid: [
    {
      code: javascript`
        const myFn = () => {
          Promise.resolve().then(() => {
            expect(true).toBe(false);
          });
        };

        test('foo', () => {
          somePromise.then(() => {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        {
          column: 3,
          endColumn: 6,
          line: 8,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: javascript`
        test('foo', () => {
          somePromise.then(() => {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        { column: 3, endColumn: 6, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('foo', () => {
          somePromise.finally(() => {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        { column: 3, endColumn: 6, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
       test('foo', () => {
         somePromise['then'](() => {
           expect(someThing).toEqual(true);
         });
       });
      `,
      errors: [
        { column: 10, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('foo', function() {
          getSomeThing().getPromise().then(function() {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        { column: 3, endColumn: 6, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('foo', function() {
          Promise.resolve().then(function() {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        { column: 3, endColumn: 6, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('foo', function() {
          somePromise.catch(function() {
            expect(someThing).toEqual(true)
          })
        })
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('foo', function() {
          somePromise.then(function() {
            expect(someThing).toEqual(true)
          })
        })
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('foo', function () {
          Promise.resolve().then(/*fulfillment*/ function () {
            expect(someThing).toEqual(true);
          }, /*rejection*/ function () {
            expect(someThing).toEqual(true);
          })
        })
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('foo', function () {
          Promise.resolve().then(/*fulfillment*/ function () {
          }, /*rejection*/ function () {
            expect(someThing).toEqual(true)
          })
        });
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('test function', () => {
          Builder.getPromiseBuilder()
            .get()
            .build()
            .then(data => expect(data).toEqual('Hi'));
        });
      `,
      errors: [
        { column: 3, endColumn: 47, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('test function', async () => {
          Builder.getPromiseBuilder()
            .get()
            .build()
            .then(data => expect(data).toEqual('Hi'));
        });
      `,
      errors: [
        { column: 11, endColumn: 55, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('foo', () => {
          somePromise.then(() => {
            doSomeOperation();
            expect(someThing).toEqual(true);
          })
        });
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('is a test', () => {
          somePromise
            .then(() => {})
            .then(() => expect(someThing).toEqual(value))
        });
      `,
      errors: [
        { column: 3, endColumn: 50, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('is a test', () => {
          somePromise
            .then(() => expect(someThing).toEqual(value))
            .then(() => {})
        });
      `,
      errors: [
        { column: 3, endColumn: 20, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('is a test', () => {
          somePromise.then(() => {
            return value;
          })
          .then(value => {
            expect(someThing).toEqual(value);
          })
        });
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('is a test', () => {
          somePromise.then(() => {
            expect(someThing).toEqual(true);
          })
          .then(() => {
            console.log('this is silly');
          })
        });
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('is a test', () => {
          somePromise.then(() => {
            // return value;
          })
          .then(value => {
            expect(someThing).toEqual(value);
          })
        });
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('is a test', () => {
          somePromise.then(() => {
            return value;
          })
          .then(value => {
            expect(someThing).toEqual(value);
          })

          return anotherPromise.then(() => expect(x).toBe(y));
        });
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('is a test', () => {
          somePromise
            .then(() => 1)
            .then(x => x + 1)
            .catch(() => -1)
            .then(v => expect(v).toBe(2));

          return anotherPromise.then(() => expect(x).toBe(y));
        });
      `,
      errors: [
        { column: 3, endColumn: 35, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('is a test', () => {
          somePromise
            .then(() => 1)
            .then(v => expect(v).toBe(2))
            .then(x => x + 1)
            .catch(() => -1);

          return anotherPromise.then(() => expect(x).toBe(y));
        });
      `,
      errors: [
        { column: 3, endColumn: 22, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('foo', () => {
          somePromise.finally(() => {
            doSomeOperation();
            expect(someThing).toEqual(true);
          })
        });
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('invalid return', () => {
          const promise = something().then(value => {
            const foo = "foo";
            return expect(value).toBe('red');
          });
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test.skip('foo', () => {
          somePromise.then(() => {
            doSomeOperation();
            expect(someThing).toEqual(true);
          })
        });
      `,
      errors: [
        { column: 3, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          promise;
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return;

          await promise;
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return 1;

          await promise;
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return [];

          await promise;
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return Promise.all([anotherPromise]);

          await promise;
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return {};

          await promise;
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return Promise.all([]);

          await promise;
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await 1;
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await [];
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await Promise.all([anotherPromise]);
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await {};
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await Promise.all([]);
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          }), x = 1;
        });
      `,
      errors: [
        { column: 9, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('later return', async () => {
          const x = 1, promise = something().then(value => {
            expect(value).toBe('red');
          });
        });
      `,
      errors: [
        { column: 16, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        import { test } from '@playwright/test';

        test('later return', async () => {
          const x = 1, promise = something().then(value => {
            expect(value).toBe('red');
          });
        });
      `,
      errors: [
        { column: 16, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('promise test', () => {
          const somePromise = getThatPromise();
          somePromise.then((data) => {
            expect(data).toEqual('foo');
          });
          expect(somePromise).toBeDefined();
          return somePromise;
        });
      `,
      errors: [
        { column: 3, endColumn: 6, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('promise test', function () {
          let somePromise = getThatPromise();
          somePromise.then((data) => {
            expect(data).toEqual('foo');
          });
          expect(somePromise).toBeDefined();
          return somePromise;
        });
      `,
      errors: [
        { column: 3, endColumn: 6, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('promise test', async function () {
          let somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          somePromise = null;

          await somePromise;
        });
      `,
      errors: [
        { column: 7, endColumn: 5, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: javascript`
        test('promise test', async function () {
          let somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          }); 

          await somePromise;
        });
      `,
      errors: [
        {
          column: 7,
          endColumn: 5,
          line: 2,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: javascript`
        test('promise test', async function () {
          let somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });
  
          ({ somePromise } = {})
        });
      `,
      errors: [
        {
          column: 7,
          endColumn: 5,
          line: 2,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: javascript`
        test('promise test', async function () {
          let somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          {
            somePromise = getPromise().then((data) => {
              expect(data).toEqual('foo');
            }); 

            await somePromise;
          }
        });
      `,
      errors: [
        {
          column: 7,
          endColumn: 5,
          line: 2,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: javascript`
        test('that we error on this destructuring', async () => {
          [promise] = something().then(value => {
            expect(value).toBe('red');
          });
        });
      `,
      errors: [
        {
          column: 3,
          endColumn: 5,
          line: 2,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: javascript`
        test('that we error on this', () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          log(promise);
        });
      `,
      errors: [
        {
          column: 9,
          line: 2,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: javascript`
        test('is valid', async () => {
          const promise = loadNumber().then(number => {
            expect(typeof number).toBe('number');

            return number + 1;
          });

          expect(promise).toBeInstanceOf(Promise);
        });
      `,
      errors: [
        {
          column: 9,
          line: 2,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: javascript`
        test('is valid', async () => {
          const promise = loadNumber().then(number => {
            expect(typeof number).toBe('number');

            return number + 1;
          });

          expect(anotherPromise).resolves.toBe(1);
        });
      `,
      errors: [
        {
          column: 9,
          line: 2,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    // TODO:
    // {
    //   code: javascript`
    //     import { test as promiseThatThis } from '@playwright/test';
    //
    //     promiseThatThis('is valid', async () => {
    //       const promise = loadNumber().then(number => {
    //         expect(typeof number).toBe('number');
    //
    //         return number + 1;
    //       });
    //
    //       expect(anotherPromise).resolves.toBe(1);
    //     });
    //   `,
    //   errors: [
    //     {
    //       column: 9,
    //       line: 4,
    //       messageId: 'expectInFloatingPromise',
    //     },
    //   ],
    // },
    // Global aliases
    {
      code: javascript`
        test('is valid', async () => {
          const promise = loadNumber().then(number => {
            assert(typeof number).toBe('number');

            return number + 1;
          });

          assert(anotherPromise).resolves.toBe(1);
        });
      `,
      errors: [
        {
          column: 9,
          line: 2,
          messageId: 'expectInFloatingPromise',
        },
      ],
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
    },
    {
      code: javascript`
        it('is valid', async () => {
          const promise = loadNumber().then(number => {
            expect(typeof number).toBe('number');

            return number + 1;
          });

          expect(anotherPromise).resolves.toBe(1);
        });
      `,
      errors: [
        {
          column: 9,
          line: 2,
          messageId: 'expectInFloatingPromise',
        },
      ],
      settings: {
        playwright: {
          globalAliases: { test: ['it'] },
        },
      },
    },
  ],
  valid: [
    "test('something', () => Promise.resolve().then(() => expect(1).toBe(2)));",
    'Promise.resolve().then(() => expect(1).toBe(2))',
    'const x = Promise.resolve().then(() => expect(1).toBe(2))',
    javascript`
      test('is valid', () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(promise).resolves.toBe(1);
      });
    `,
    javascript`
      test('is valid', () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(promise).resolves.not.toBe(2);
      });
    `,
    javascript`
      test('is valid', () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(promise).rejects.toBe(1);
      });
    `,
    javascript`
      test('is valid', () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(promise).rejects.not.toBe(2);
      });
    `,
    javascript`
      test('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(await promise).toBeGreaterThan(1);
      });
    `,
    javascript`
      test('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(await promise).resolves.toBeGreaterThan(1);
      });
    `,
    javascript`
      test('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(1).toBeGreaterThan(await promise);
      });
    `,
    javascript`
      test('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect.this.that.is(await promise);
      });
    `,
    javascript`
      test('is valid', async () => {
        expect(await loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        })).toBeGreaterThan(1);
      });
    `,
    javascript`
      test('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect([await promise]).toHaveLength(1);
      });
    `,
    javascript`
      test('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect([,,await promise,,]).toHaveLength(1);
      });
    `,
    javascript`
      test('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect([[await promise]]).toHaveLength(1);
      });
    `,
    javascript`
      test('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        logValue(await promise);
      });
    `,
    javascript`
      test('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return 1;
        });

        expect.assertions(await promise);
      });
    `,
    javascript`
      test('is valid', async () => {
        await loadNumber().then(number => {
          expect(typeof number).toBe('number');
        });
      });
    `,
    javascript`
      test('foo', () => new Promise((done) => {
        test()
          .then(() => {
            expect(someThing).toEqual(true);
            done();
          });
      }));
    `,
    javascript`
      test('foo', () => {
        return new Promise(done => {
          test().then(() => {
            expect(someThing).toEqual(true);
            done();
          });
        });
      });
    `,
    javascript`
      test('passes', () => {
        Promise.resolve().then(() => {
          grabber.grabSomething();
        });
      });
    `,
    javascript`
      test('passes', async () => {
        const grabbing = Promise.resolve().then(() => {
          grabber.grabSomething();
        });

        await grabbing;

        expect(grabber.grabbedItems).toHaveLength(1);
      });
    `,
    javascript`
      const myFn = () => {
        Promise.resolve().then(() => {
          expect(true).toBe(false);
        });
      };
    `,
    javascript`
      const myFn = () => {
        Promise.resolve().then(() => {
          subject.invokeMethod();
        });
      };
    `,
    javascript`
      const myFn = () => {
        Promise.resolve().then(() => {
          expect(true).toBe(false);
        });
      };

      test('foo', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        });
      });
    `,
    javascript`
      test('foo', () => new Promise((done) => {
        test()
          .finally(() => {
            expect(someThing).toEqual(true);
            done();
          });
      }));
    `,
    javascript`
      test('foo', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        });
      });
    `,
    javascript`
      test('foo', () => {
        return somePromise.finally(() => {
          expect(someThing).toEqual(true);
        });
      });
    `,
    javascript`
      test('foo', function() {
        return somePromise.catch(function() {
          expect(someThing).toEqual(true);
        });
      });
    `,
    javascript`
      test('foo', function() {
        return somePromise.then(function() {
          doSomeThingButNotExpect();
        });
      });
    `,
    javascript`
      test('foo', function() {
        return getSomeThing().getPromise().then(function() {
          expect(someThing).toEqual(true);
        });
      });
    `,
    javascript`
      test('foo', function() {
        return Promise.resolve().then(function() {
          expect(someThing).toEqual(true);
        });
      });
    `,
    javascript`
      test('foo', function () {
        return Promise.resolve().then(function () {
          /*fulfillment*/
          expect(someThing).toEqual(true);
        }, function () {
          /*rejection*/
          expect(someThing).toEqual(true);
        });
      });
    `,
    javascript`
      test('foo', function () {
        Promise.resolve().then(/*fulfillment*/ function () {
        }, undefined, /*rejection*/ function () {
          expect(someThing).toEqual(true)
        })
      });
    `,
    javascript`
      test('foo', function () {
        return Promise.resolve().then(function () {
          /*fulfillment*/
        }, function () {
          /*rejection*/
          expect(someThing).toEqual(true);
        });
      });
    `,
    javascript`
      test('foo', function () {
        return somePromise.then()
      });
    `,
    javascript`
      test('foo', async () => {
        await Promise.resolve().then(function () {
          expect(someThing).toEqual(true)
        });
      });
    `,
    javascript`
      test('foo', async () => {
        await somePromise.then(() => {
          expect(someThing).toEqual(true)
        });
      });
    `,
    javascript`
      test('foo', async () => {
        await getSomeThing().getPromise().then(function () {
          expect(someThing).toEqual(true)
        });
      });
    `,
    javascript`
      test('foo', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        })
        .then(() => {
          expect(someThing).toEqual(true);
        })
      });
    `,
    javascript`
      test('foo', () => {
        return somePromise.then(() => {
          return value;
        })
        .then(value => {
          expect(someThing).toEqual(value);
        })
      });
    `,
    javascript`
      test('foo', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        })
        .then(() => {
          console.log('this is silly');
        })
      });
    `,
    javascript`
      test('foo', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        })
        .catch(() => {
          expect(someThing).toEqual(false);
        })
      });
    `,
    javascript`
      test('later return', () => {
        const promise = something().then(value => {
          expect(value).toBe('red');
        });

        return promise;
      });
    `,
    javascript`
      test('later return', async () => {
        const promise = something().then(value => {
          expect(value).toBe('red');
        });

        await promise;
      });
    `,
    javascript`
      test.only('later return', () => {
        const promise = something().then(value => {
          expect(value).toBe('red');
        });

        return promise;
      });
    `,
    javascript`
      test('that we bailout if destructuring is used', () => {
        const [promise] = something().then(value => {
          expect(value).toBe('red');
        });
      });
    `,
    javascript`
      test('that we bailout if destructuring is used', async () => {
        const [promise] = await something().then(value => {
          expect(value).toBe('red');
        });
      });
    `,
    javascript`
      test('that we bailout if destructuring is used', () => {
        const [promise] = [
          something().then(value => {
            expect(value).toBe('red');
          })
        ];
      });
    `,
    javascript`
      test('that we bailout if destructuring is used', () => {
        const {promise} = {
          promise: something().then(value => {
            expect(value).toBe('red');
          })
        };
      });
    `,
    javascript`
      test('that we bailout in complex cases', () => {
        promiseSomething({
          timeout: 500,
          promise: something().then(value => {
            expect(value).toBe('red');
          })
        });
      });
    `,
    javascript`
      test('shorthand arrow', () =>
        something().then(value => {
          expect(() => {
            value();
          }).toThrow();
        })
      );
    `,
    javascript`
      test('crawls for files based on patterns', () => {
        const promise = nodeCrawl({}).then(data => {
          expect(childProcess.spawn).lastCalledWith('find');
        });
        return promise;
      });
    `,
    javascript`
      test('is a test', async () => {
        const value = await somePromise().then(response => {
          expect(response).toHaveProperty('data');

          return response.data;
        });

        expect(value).toBe('hello world');
      });
    `,
    javascript`
      test('is a test', async () => {
        return await somePromise().then(response => {
          expect(response).toHaveProperty('data');

          return response.data;
        });
      });
    `,
    javascript`
      test('is a test', async () => {
        return somePromise().then(response => {
          expect(response).toHaveProperty('data');

          return response.data;
        });
      });
    `,
    javascript`
      test('is a test', async () => {
        await somePromise().then(response => {
          expect(response).toHaveProperty('data');

          return response.data;
        });
      });
    `,
    javascript`
      test(
        'test function',
        () => {
          return Builder
            .getPromiseBuilder()
            .get().build()
            .then((data) => {
              expect(data).toEqual('Hi');
            });
        }
      );
    `,
    javascript`
      notATestFunction(
        'not a test function',
        () => {
          Builder
            .getPromiseBuilder()
            .get()
            .build()
            .then((data) => {
              expect(data).toEqual('Hi');
            });
        }
      );
    `,
    javascript`
      test('is valid', async () => {
        const promiseOne = loadNumber().then(number => {
          expect(typeof number).toBe('number');
        });
        const promiseTwo = loadNumber().then(number => {
          expect(typeof number).toBe('number');
        });

        await promiseTwo;
        await promiseOne;
      });
    `,
    javascript`
      test("foo", () => somePromise.then(() => {
        expect(someThing).toEqual(true)
      }))
    `,
    'test("foo", () => somePromise.then(() => expect(someThing).toEqual(true)))',
    javascript`
      test('promise test with done', (done) => {
        const promise = getPromise();
        promise.then(() => expect(someThing).toEqual(true));
      });
    `,
    javascript`
      test('name of done param does not matter', (nameDoesNotMatter) => {
        const promise = getPromise();
        promise.then(() => expect(someThing).toEqual(true));
      });
    `,
    javascript`
      test('valid-expect-in-promise', async () => {
        const text = await fetch('url')
            .then(res => res.text())
            .then(text => text);

        expect(text).toBe('text');
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        }), x = 1;

        await somePromise;
      });
    `,
    javascript`
      test('promise test', async function () {
        let x = 1, somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;

        somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        }); 

        await somePromise;
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;

        somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        }); 

        return somePromise;
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        {}

        await somePromise;
      });
    `,
    javascript`
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        {
          await somePromise;
        }
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        {
          await somePromise;

          somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          await somePromise;
        }
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;

        {
          somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          await somePromise;
        }
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        somePromise = somePromise.then((data) => {
          expect(data).toEqual('foo');
        }); 

        await somePromise;
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        somePromise = somePromise
          .then((data) => data)
          .then((data) => data)
          .then((data) => {
            expect(data).toEqual('foo');
          }); 

        await somePromise;
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        somePromise = somePromise
          .then((data) => data)
          .then((data) => data)

        await somePromise;
      });
    `,
    javascript`
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;

        {
          somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          {
            await somePromise;
          }
        }
      });
    `,
    javascript`
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await Promise.all([somePromise]);
      });
    `,
    javascript`
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        return Promise.all([somePromise]);
      });
    `,
    javascript`
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        return Promise.resolve(somePromise);
      });
    `,
    javascript`
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        return Promise.reject(somePromise);
      });
    `,
    javascript`
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await Promise.resolve(somePromise);
      });
    `,
    javascript`
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await Promise.reject(somePromise);
      });
    `,
    javascript`
      test('later return', async () => {
        const onePromise = something().then(value => {
          console.log(value);
        });
        const twoPromise = something().then(value => {
          expect(value).toBe('red');
        });

        return Promise.all([onePromise, twoPromise]);
      });
    `,
    javascript`
      test('later return', async () => {
        const onePromise = something().then(value => {
          console.log(value);
        });
        const twoPromise = something().then(value => {
          expect(value).toBe('red');
        });

        return Promise.allSettled([onePromise, twoPromise]);
      });
    `,
  ],
})
