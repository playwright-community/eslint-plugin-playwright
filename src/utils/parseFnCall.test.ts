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
        const sorted = sortKeys({
          ...call,
          head: sortKeys(call.head),
        });

        context.report({
          data: {
            data: JSON.stringify(sortKeys(sorted), (_key, value) => {
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

interface TestParsedFnCall
  extends Omit<ParsedFnCall, 'head' | 'members' | 'modifiers'> {
  args?: string[];
  head: TestResolvedFnWithNode;
  matcher?: string;
  members: string[];
  modifiers?: string[];
}

const sortKeys = (obj: unknown) =>
  Object.fromEntries(Object.entries(obj as Record<string, unknown>).sort());

const expectedParsedFnCallResultData = (result: TestParsedFnCall) => ({
  data: JSON.stringify({
    args: result.args,
    head: sortKeys(result.head),
    matcher: result.matcher,
    members: result.members,
    modifiers: result.modifiers,
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
  invalid: [
    {
      code: 'expect(x).toBe(y);',
      errors: [
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            args: ['y'],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'toBe',
            members: ['toBe'],
            modifiers: [],
            name: 'expect',
            type: 'expect',
          }),
          line: 1,
          messageId: 'details',
        },
      ],
    },
    {
      code: 'expect.soft(x).toBe(y);',
      errors: [
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            args: ['y'],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'toBe',
            members: ['soft', 'toBe'],
            modifiers: ['soft'],
            name: 'expect',
            type: 'expect',
          }),
          line: 1,
          messageId: 'details',
        },
      ],
    },
    {
      code: 'expect.poll(() => x).toBe(y);',
      errors: [
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            args: ['y'],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'toBe',
            members: ['poll', 'toBe'],
            modifiers: ['poll'],
            name: 'expect',
            type: 'expect',
          }),
          line: 1,
          messageId: 'details',
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
          column: 1,
          data: expectedParsedFnCallResultData({
            args: [],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'assertions',
            members: ['assertions'],
            modifiers: [],
            name: 'expect',
            type: 'expect',
          }),
          line: 3,
          messageId: 'details',
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
          column: 1,
          data: expectedParsedFnCallResultData({
            args: ['y'],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'toBe',
            members: ['toBe'],
            modifiers: [],
            name: 'expect',
            type: 'expect',
          }),
          line: 3,
          messageId: 'details',
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
          column: 1,
          data: expectedParsedFnCallResultData({
            args: ['y'],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'toBe',
            members: ['not', 'toBe'],
            modifiers: ['not'],
            name: 'expect',
            type: 'expect',
          }),
          line: 3,
          messageId: 'details',
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
          column: 1,
          data: expectedParsedFnCallResultData({
            args: [],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'assertions',
            members: ['assertions'],
            modifiers: [],
            name: 'expect',
            type: 'expect',
          }),
          line: 3,
          messageId: 'details',
        },
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            args: [],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'hasAssertions',
            members: ['hasAssertions'],
            modifiers: [],
            name: 'expect',
            type: 'expect',
          }),
          line: 4,
          messageId: 'details',
        },
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            args: [],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'anything',
            members: ['anything'],
            modifiers: [],
            name: 'expect',
            type: 'expect',
          }),
          line: 5,
          messageId: 'details',
        },
        {
          column: 1,
          data: expectedParsedFnCallResultData({
            args: [],
            head: {
              local: 'expect',
              node: 'expect',
              original: null,
            },
            matcher: 'arrayContaining',
            members: ['not', 'arrayContaining'],
            modifiers: ['not'],
            name: 'expect',
            type: 'expect',
          }),
          line: 6,
          messageId: 'details',
        },
      ],
    },
  ],
  valid: [
    'expect(x).not(y);',
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
              local: 'context',
              node: 'context',
              original: 'describe',
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
              local: 'context',
              node: 'context',
              original: 'describe',
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
              local: 'context',
              node: 'context',
              original: 'describe',
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
              local: 'describe',
              node: 'describe',
              original: null,
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
              local: 'test',
              node: 'test',
              original: null,
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
