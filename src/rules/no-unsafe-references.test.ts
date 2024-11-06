import rule from '../../src/rules/no-unsafe-references.js'
import {
  javascript,
  runRuleTester,
  runTSRuleTester,
  typescript,
} from '../utils/rule-tester.js'

const messageId = 'noUnsafeReference'

runRuleTester('no-unsafe-references', rule, {
  invalid: [
    {
      code: javascript`
        const x = 10
        const result = await page.evaluate(() => {
          return Promise.resolve(x);
        });
      `,
      errors: [
        {
          column: 26,
          data: { variable: 'x' },
          line: 3,
          messageId,
        },
      ],
      name: 'Single argument - missing arg list - arrow function',
      output: javascript`
        const x = 10
        const result = await page.evaluate(([x]) => {
          return Promise.resolve(x);
        }, [x]);
      `,
    },
    {
      code: javascript`
        const x = 10
        const result = await page.evaluate(function () {
          return Promise.resolve(x);
        });
      `,
      errors: [
        {
          column: 26,
          data: { variable: 'x' },
          line: 3,
          messageId,
        },
      ],
      name: 'Single argument - missing arg list - function',
      output: javascript`
        const x = 10
        const result = await page.evaluate(function ([x]) {
          return Promise.resolve(x);
        }, [x]);
      `,
    },
    {
      code: javascript`
        const x = 10
        const result = await page.evaluate(() => {
          return Promise.resolve(x);
        }, []);
      `,
      errors: [
        {
          column: 26,
          data: { variable: 'x' },
          line: 3,
          messageId,
        },
      ],
      name: 'Single argument - empty arg list - arrow function',
      output: javascript`
        const x = 10
        const result = await page.evaluate(([x]) => {
          return Promise.resolve(x);
        }, [x]);
      `,
    },
    {
      code: javascript`
        const x = 10
        const result = await page.evaluate(function() {
          return Promise.resolve(x);
        }, []);
      `,
      errors: [
        {
          column: 26,
          data: { variable: 'x' },
          line: 3,
          messageId,
        },
      ],
      name: 'Single argument - empty arg list - function',
      output: javascript`
        const x = 10
        const result = await page.evaluate(function([x]) {
          return Promise.resolve(x);
        }, [x]);
      `,
    },
    {
      code: javascript`
        const foo = 10
        const bar = 20
        const result = await page.evaluate(() => {
          return Promise.resolve(foo + bar);
        }, []);
      `,
      errors: [
        {
          column: 26,
          data: { variable: 'foo' },
          endColumn: 29,
          line: 4,
          messageId: 'noUnsafeReference',
        },
        {
          column: 32,
          data: { variable: 'bar' },
          endColumn: 35,
          line: 4,
          messageId: 'noUnsafeReference',
        },
      ],
      name: 'Multiple arguments',
      output: javascript`
        const foo = 10
        const bar = 20
        const result = await page.evaluate(([foo, bar]) => {
          return Promise.resolve(foo + bar);
        }, [foo, bar]);
      `,
    },
    {
      code: javascript`
        const x = 10
        const result = await page.evaluate(() => {
          const y = 20;
          return Promise.resolve(x + y);
        });
      `,
      errors: [
        {
          column: 26,
          data: { variable: 'x' },
          line: 4,
          messageId,
        },
      ],
      name: 'Inner and outer variables',
      output: javascript`
        const x = 10
        const result = await page.evaluate(([x]) => {
          const y = 20;
          return Promise.resolve(x + y);
        }, [x]);
      `,
    },
    {
      code: javascript`
        const x = 10
        test('test', async () => {
          const y = 10
          const result = await page.evaluate(() => {
            return Promise.resolve(x + y);
          }, []);
        })
      `,
      errors: [
        {
          column: 28,
          data: { variable: 'x' },
          line: 5,
          messageId,
        },
        {
          column: 32,
          data: { variable: 'y' },
          line: 5,
          messageId,
        },
      ],
      name: 'Multi-level scopes',
      output: javascript`
        const x = 10
        test('test', async () => {
          const y = 10
          const result = await page.evaluate(([x, y]) => {
            return Promise.resolve(x + y);
          }, [x, y]);
        })
      `,
    },
    {
      code: javascript`
        const x = 10
        const y = 12
        const result = await page.evaluate(([x]) => {
          return Promise.resolve(x + y);
        }, [x]);
      `,
      errors: [
        {
          column: 30,
          data: { variable: 'y' },
          line: 4,
          messageId,
        },
      ],
      name: 'Adding to existing arg list',
      output: javascript`
        const x = 10
        const y = 12
        const result = await page.evaluate(([x, y]) => {
          return Promise.resolve(x + y);
        }, [x, y]);
      `,
    },
    {
      code: javascript`
        const x = 10
        const y = 12
        const result = await page.evaluate((x) => {
          return Promise.resolve(x + y);
        }, x);
      `,
      errors: [
        {
          column: 30,
          data: { variable: 'y' },
          line: 4,
          messageId,
        },
      ],
      name: 'Converting a single argument to an array',
      output: javascript`
        const x = 10
        const y = 12
        const result = await page.evaluate(([x, y]) => {
          return Promise.resolve(x + y);
        }, [x, y]);
      `,
    },
  ],
  valid: [
    { code: 'page.pause()' },
    { code: 'page.evaluate()' },
    { code: 'page.evaluate("1 + 2")' },
    {
      code: javascript`
        const x = 10
        const result = await page.evaluate(() => {
          return Promise.resolve(12);
        }, []);
      `,
      name: 'No variables',
    },
    {
      code: javascript`
        const x = 10
        const result = await page.evaluate(function (x) {
          return Promise.resolve(x);
        }, [x]);
      `,
      name: 'Single argument',
    },
    {
      code: javascript`
        const foo = 10
        const bar = 20
        const result = await page.evaluate(([foo, bar]) => {
          return Promise.resolve(foo, bar);
        }, [foo, bar]);
      `,
      name: 'Multiple arguments - same name',
    },
    {
      code: javascript`
        const foo = 10
        const bar = 20
        const result = await page.evaluate(([a, b]) => {
          return Promise.resolve(a + b);
        }, [foo, bar]);
      `,
      name: 'Multiple arguments - different name',
    },
    {
      code: javascript`
        const x = 10
        const result = await page.evaluate(() => {
          const x = 20;
          return Promise.resolve(x);
        }, []);
      `,
      name: 'Variable shadowing',
    },
    {
      code: javascript`
        const x = 10
        const result = await page.evaluate((x) => {
          const y = 20;
          return Promise.resolve(x + y);
        }, [x]);
      `,
      name: 'Inner and outer variables',
    },
    {
      code: javascript`
        const x = 10
        test('test', async () => {
          const y = 10
          const result = await page.evaluate(([x, y]) => {
            return Promise.resolve(x + y);
          }, [x, y]);
        })
      `,
      name: 'Multi-level scopes',
    },
  ],
})

runTSRuleTester('no-unsafe-references', rule, {
  invalid: [],
  valid: [
    {
      code: typescript`
        type X = number;
        const result = await page.evaluate(() => {
          const x = 10 as X;
          return Promise.resolve(x);
        });
      `,
      name: 'TypeScript - variable assignment of type',
    },
    {
      code: typescript`
        type X = number;
        const result = await page.evaluate(() => {
          const foo = (bar: X) => bar;
          return Promise.resolve(foo(10));
        });
      `,
      name: 'TypeScript - parameter type',
    },
    {
      code: typescript`
        type X = number;
        const result = await page.evaluate(() => {
          const x: X = 10;
          return Promise.resolve(x);
        });
      `,
      name: 'TypeScript - casting',
    },
  ],
})
