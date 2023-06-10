import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { getStringValue, isIdentifier } from '../utils/ast';
import { replaceAccessorFixer } from '../utils/fixer';
import { ParsedExpectCall, parseExpectCall } from '../utils/parseExpectCall';

function shouldUseToBe(expectCall: ParsedExpectCall) {
  let arg = expectCall.args[0];

  if (arg.type === 'UnaryExpression' && arg.operator === '-') {
    arg = arg.argument;
  }

  if (arg.type === 'Literal') {
    // regex literals are classed as literals, but they're actually objects
    // which means "toBe" will give different results than other matchers
    return !('regex' in arg);
  }

  return arg.type === 'TemplateLiteral';
}

function reportPreferToBe(
  context: Rule.RuleContext,
  expectCall: ParsedExpectCall,
  whatToBe: string,
  notModifier?: ESTree.Node
) {
  context.report({
    node: expectCall.matcher,
    messageId: `useToBe${whatToBe}`,
    fix(fixer) {
      const fixes = [
        replaceAccessorFixer(fixer, expectCall.matcher, `toBe${whatToBe}`),
      ];

      if (expectCall.args?.length && whatToBe !== '') {
        fixes.push(fixer.remove(expectCall.args[0]));
      }

      if (notModifier) {
        const [start, end] = notModifier.range!;
        fixes.push(fixer.removeRange([start - 1, end]));
      }

      return fixes;
    },
  });
}

export default {
  create(context) {
    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(node);
        if (!expectCall) return;

        const notMatchers = ['toBeUndefined', 'toBeDefined'];
        const notModifier = expectCall.modifiers.find(
          (node) => getStringValue(node) === 'not'
        );

        if (notModifier && notMatchers.includes(expectCall.matcherName)) {
          return reportPreferToBe(
            context,
            expectCall,
            expectCall.matcherName === 'toBeDefined' ? 'Undefined' : 'Defined',
            notModifier
          );
        }

        const argumentMatchers = ['toBe', 'toEqual', 'toStrictEqual'];
        const firstArg = expectCall.args[0];

        if (!argumentMatchers.includes(expectCall.matcherName) || !firstArg) {
          return;
        }

        if (firstArg.type === 'Literal' && firstArg.value === null) {
          return reportPreferToBe(context, expectCall, 'Null');
        }

        if (isIdentifier(firstArg, 'undefined')) {
          const name = notModifier ? 'Defined' : 'Undefined';
          return reportPreferToBe(context, expectCall, name, notModifier);
        }

        if (isIdentifier(firstArg, 'NaN')) {
          return reportPreferToBe(context, expectCall, 'NaN');
        }

        if (shouldUseToBe(expectCall) && expectCall.matcherName !== 'toBe') {
          reportPreferToBe(context, expectCall, '');
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toBe()` for primitive literals',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-to-be.md',
    },
    messages: {
      useToBe: 'Use `toBe` when expecting primitive literals',
      useToBeUndefined: 'Use `toBeUndefined` instead',
      useToBeDefined: 'Use `toBeDefined` instead',
      useToBeNull: 'Use `toBeNull` instead',
      useToBeNaN: 'Use `toBeNaN` instead',
    },
    fixable: 'code',
    type: 'suggestion',
    schema: [],
  },
} as Rule.RuleModule;
