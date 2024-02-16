import dedent from 'dedent';
import rule from '../../src/rules/no-unsafe-references';
import { runRuleTester } from '../utils/rule-tester';

const messageId = 'noUnsafeReference';

runRuleTester('no-unsafe-references', rule, {
  invalid: [
    {
      code: dedent`
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
      output: dedent`
        const x = 10
        const result = await page.evaluate(([x]) => {
          return Promise.resolve(x);
        }, [x]);
      `,
    },
    {
      code: dedent`
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
      output: dedent`
        const x = 10
        const result = await page.evaluate(function ([x]) {
          return Promise.resolve(x);
        }, [x]);
      `,
    },
    {
      code: dedent`
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
      output: dedent`
        const x = 10
        const result = await page.evaluate(([x]) => {
          return Promise.resolve(x);
        }, [x]);
      `,
    },
    {
      code: dedent`
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
      output: dedent`
        const x = 10
        const result = await page.evaluate(function([x]) {
          return Promise.resolve(x);
        }, [x]);
      `,
    },
    {
      code: dedent`
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
      output: dedent`
        const foo = 10
        const bar = 20
        const result = await page.evaluate(([foo, bar]) => {
          return Promise.resolve(foo + bar);
        }, [foo, bar]);
      `,
    },
    {
      code: dedent`
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
      output: dedent`
        const x = 10
        const result = await page.evaluate(([x]) => {
          const y = 20;
          return Promise.resolve(x + y);
        }, [x]);
      `,
    },
    {
      code: dedent`
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
      output: dedent`
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
      code: dedent`
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
      output: dedent`
        const x = 10
        const y = 12
        const result = await page.evaluate(([x, y]) => {
          return Promise.resolve(x + y);
        }, [x, y]);
      `,
    },
    {
      code: dedent`
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
      output: dedent`
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
      code: dedent`
        const x = 10
        const result = await page.evaluate(() => {
          return Promise.resolve(12);
        }, []);
      `,
      name: 'No variables',
    },
    {
      code: dedent`
        const x = 10
        const result = await page.evaluate(function (x) {
          return Promise.resolve(x);
        }, [x]);
      `,
      name: 'Single argument',
    },
    {
      code: dedent`
        const foo = 10
        const bar = 20
        const result = await page.evaluate(([foo, bar]) => {
          return Promise.resolve(foo, bar);
        }, [foo, bar]);
      `,
      name: 'Multiple arguments - same name',
    },
    {
      code: dedent`
        const foo = 10
        const bar = 20
        const result = await page.evaluate(([a, b]) => {
          return Promise.resolve(a + b);
        }, [foo, bar]);
      `,
      name: 'Multiple arguments - different name',
    },
    {
      code: dedent`
        const x = 10
        const result = await page.evaluate(() => {
          const x = 20;
          return Promise.resolve(x);
        }, []);
      `,
      name: 'Variable shadowing',
    },
    {
      code: dedent`
        const x = 10
        const result = await page.evaluate((x) => {
          const y = 20;
          return Promise.resolve(x + y);
        }, [x]);
      `,
      name: 'Inner and outer variables',
    },
    {
      code: dedent`
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
});
