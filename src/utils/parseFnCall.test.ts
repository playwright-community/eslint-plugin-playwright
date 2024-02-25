/* eslint-disable sort/object-properties */
import dedent from 'dedent';
import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { runRuleTester, runTSRuleTester } from '../../test/utils/rule-tester';
import { getStringValue } from './ast';
import {
  isSupportedAccessor,
  ParsedFnCall,
  parseFnCall,
  ResolvedFnWithNode,
} from './parseFnCall';

const isNode = (obj: unknown): obj is ESTree.Node => {
  if (typeof obj === 'object' && obj !== null) {
    return ['type', 'loc', 'range', 'parent'].every((p) => p in obj);
  }

  return false;
};

const rule = {
  create: (context) => ({
    CallExpression(node) {
      const call = parseFnCall(context, node);

      if (call) {
        const sorted = {
          head: call.head,
          members: call.members,
          name: call.name,
          type: call.type,
        };

        context.report({
          data: {
            data: JSON.stringify(sorted, (_key, value) => {
              if (isNode(value)) {
                if (isSupportedAccessor(value)) {
                  return getStringValue(value);
                }

                return undefined;
              }

              return value;
            }),
          },
          messageId: 'details',
          node,
        });
      }
    },
  }),
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Fake rule for testing parseFnCall',
      recommended: false,
    },
    messages: {
      details: '{{ data }}',
    },
    schema: [],
    type: 'problem',
  },
} as Rule.RuleModule;

interface TestResolvedFnWithNode extends Omit<ResolvedFnWithNode, 'node'> {
  node: string;
}

interface TestParsedFnCall extends Omit<ParsedFnCall, 'head' | 'members'> {
  head: TestResolvedFnWithNode;
  members: string[];
}

const expectedParsedFnCallResultData = (result: TestParsedFnCall) => ({
  data: JSON.stringify({
    head: result.head,
    members: result.members,
    name: result.name,
    type: result.type,
  }),
});

runRuleTester('nonexistent methods', rule, {
  invalid: [],
  valid: [
    'describe.something()',
    'describe.me()',
    'test.me()',
    'it.fails()',
    'context()',
    'context.each``()',
    'context.each()',
    'describe.context()',
    'describe.concurrent()()',
    'describe.concurrent``()',
    'describe.every``()',
    '/regex/.test()',
    '"something".describe()',
    '[].describe()',
    'new describe().only()',
    '``.test()',
    'test``.only()',
  ],
});

runRuleTester('expect', rule, {
  valid: [
    {
      code: dedent`
        import { expect } from '@playwright/test';

        expect(x).not.resolves.toBe(x);
      `,
    },
    {
      code: dedent`
        import { expect } from '@playwright/test';

        expect(x).is.toBe(x);
      `,
    },
    {
      code: dedent`
        import { expect } from '@playwright/test';

        expect;
        expect(x);
        expect(x).toBe;
        expect(x).not.toBe;
        //expect(x).toBe(x).not();
      `,
    },
  ],
  invalid: [
    {
      code: 'expect(x).toBe(y);',
      errors: [
        {
          messageId: 'details',
          data: expectedParsedFnCallResultData({
            name: 'expect',
            type: 'expect',
            head: {
              original: null,
              local: 'expect',
              node: 'expect',
            },
            members: ['toBe'],
          }),
          column: 1,
          line: 1,
        },
      ],
    },
    {
      code: dedent`
        import { expect } from '@playwright/test';

        expect.assertions();
      `,
      errors: [
        {
          messageId: 'details',
          data: expectedParsedFnCallResultData({
            name: 'expect',
            type: 'expect',
            head: {
              original: null,
              local: 'expect',
              node: 'expect',
            },
            members: ['assertions'],
          }),
          column: 1,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { expect } from '@playwright/test';

        expect(x).toBe(y);
      `,
      errors: [
        {
          messageId: 'details',
          data: expectedParsedFnCallResultData({
            name: 'expect',
            type: 'expect',
            head: {
              original: null,
              local: 'expect',
              node: 'expect',
            },
            members: ['toBe'],
          }),
          column: 1,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { expect } from '@playwright/test';

        expect(x).not(y);
      `,
      errors: [
        {
          messageId: 'details',
          data: expectedParsedFnCallResultData({
            name: 'expect',
            type: 'expect',
            head: {
              original: null,
              local: 'expect',
              node: 'expect',
            },
            members: ['not'],
          }),
          column: 1,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { expect } from '@playwright/test';

        expect(x).not.toBe(y);
      `,
      errors: [
        {
          messageId: 'details',
          data: expectedParsedFnCallResultData({
            name: 'expect',
            type: 'expect',
            head: {
              original: null,
              local: 'expect',
              node: 'expect',
            },
            members: ['not', 'toBe'],
          }),
          column: 1,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { expect } from '@playwright/test';

        expect.assertions();
        expect.hasAssertions();
        expect.anything();
        expect.not.arrayContaining();
      `,
      errors: [
        {
          messageId: 'details',
          data: expectedParsedFnCallResultData({
            name: 'expect',
            type: 'expect',
            head: {
              original: null,
              local: 'expect',
              node: 'expect',
            },
            members: ['assertions'],
          }),
          column: 1,
          line: 3,
        },
        {
          messageId: 'details',
          data: expectedParsedFnCallResultData({
            name: 'expect',
            type: 'expect',
            head: {
              original: null,
              local: 'expect',
              node: 'expect',
            },
            members: ['hasAssertions'],
          }),
          column: 1,
          line: 4,
        },
        {
          messageId: 'details',
          data: expectedParsedFnCallResultData({
            name: 'expect',
            type: 'expect',
            head: {
              original: null,
              local: 'expect',
              node: 'expect',
            },
            members: ['anything'],
          }),
          column: 1,
          line: 5,
        },
        {
          messageId: 'details',
          data: expectedParsedFnCallResultData({
            name: 'expect',
            type: 'expect',
            head: {
              original: null,
              local: 'expect',
              node: 'expect',
            },
            members: ['not', 'arrayContaining'],
          }),
          column: 1,
          line: 6,
        },
      ],
    },
  ],
});

runRuleTester('esm', rule, {
  invalid: [],
  valid: [
    {
      code: dedent`
        import { it } from './test-utils';
        it('is not a  function', () => {});
      `,
    },
    {
      code: dedent`
        import { fn as it } from './test-utils';
        it('is not a  function', () => {});
      `,
    },
    {
      code: dedent`
        import ByDefault from './myfile';
        ByDefault.sayHello();
      `,
    },
    {
      code: dedent`
        async function doSomething() {
          const build = await rollup(config);
          build.generate();
        }
      `,
    },
  ],
});

runRuleTester('global aliases', rule, {
  invalid: [
    {
      code: 'context("when there is an error", () => {})',
      errors: [
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            head: {
              original: 'describe',
              local: 'context',
              node: 'context',
            },
            members: [],
            name: 'describe',
            type: 'describe',
          }),
          line: 1,
          messageId: 'details',
        },
      ],
      settings: { playwright: { globalAliases: { describe: ['context'] } } },
    },
    {
      code: 'context.skip("when there is an error", () => {})',
      errors: [
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            head: {
              original: 'describe',
              local: 'context',
              node: 'context',
            },
            members: ['skip'],
            name: 'describe',
            type: 'describe',
          }),
          line: 1,
          messageId: 'details',
        },
      ],
      settings: { playwright: { globalAliases: { describe: ['context'] } } },
    },
    {
      code: dedent`
        context("when there is an error", () => {})
        describe("when there is an error", () => {})
      `,
      errors: [
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            head: {
              original: 'describe',
              local: 'context',
              node: 'context',
            },
            members: [],
            name: 'describe',
            type: 'describe',
          }),
          line: 1,
          messageId: 'details',
        },
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            head: {
              original: null,
              local: 'describe',
              node: 'describe',
            },
            members: [],
            name: 'describe',
            type: 'describe',
          }),
          line: 2,
          messageId: 'details',
        },
      ],
      settings: { playwright: { globalAliases: { describe: ['context'] } } },
    },
  ],
  valid: [
    {
      code: 'mycontext("skip this please", () => {});',
      settings: { playwright: { globalAliases: { describe: ['context'] } } },
    },
  ],
});

runTSRuleTester('typescript', rule, {
  invalid: [
    {
      code: dedent`
        import { test } from '../it-utils';
        import { test } from '@playwright/test';

        test('is a  function', () => {});
      `,
      errors: [
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            head: {
              original: null,
              local: 'test',
              node: 'test',
            },
            members: [],
            name: 'test',
            type: 'test',
          }),
          line: 4,
          messageId: 'details',
        },
      ],
    },
  ],
  valid: [
    {
      code: dedent`
        function it(message: string, fn: () => void): void;
        function it(cases: unknown[], message: string, fn: () => void): void;
        function it(...all: any[]): void {}

        it('is not a  function', () => {});
      `,
    },
    {
      code: dedent`
        interface it {}
        function it(...all: any[]): void {}

        it('is not a  function', () => {});
      `,
    },
    "it('is not a  function', () => {});",
    'dedent()',
  ],
});
