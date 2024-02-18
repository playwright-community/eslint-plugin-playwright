import { Rule } from 'eslint';
import * as ESTree from 'estree';
import {
  getParent,
  getRawValue,
  getStringValue,
  isBooleanLiteral,
  isStringLiteral,
} from '../utils/ast';
import { parseExpectCall } from '../utils/parseExpectCall';

const equalityMatchers = new Set(['toBe', 'toEqual', 'toStrictEqual']);

const isString = (node: ESTree.Node) => {
  return isStringLiteral(node) || node.type === 'TemplateLiteral';
};

const isComparingToString = (expression: ESTree.BinaryExpression) => {
  return isString(expression.left) || isString(expression.right);
};

const invertedOperators: Record<string, string | undefined> = {
  '<': '>=',
  '<=': '>',
  '>': '<=',
  '>=': '<',
};

const operatorMatcher: Record<string, string | undefined> = {
  '<': 'toBeLessThan',
  '<=': 'toBeLessThanOrEqual',
  '>': 'toBeGreaterThan',
  '>=': 'toBeGreaterThanOrEqual',
};

const determineMatcher = (
  operator: string,
  negated: boolean,
): string | null => {
  const op = negated ? invertedOperators[operator] : operator;
  return operatorMatcher[op!] ?? null;
};

export default {
  create(context) {
    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(context, node);
        if (!expectCall || expectCall.args.length === 0) return;

        const { args, matcher } = expectCall;
        const [comparison] = node.arguments;
        const expectCallEnd = node.range![1];
        const [matcherArg] = args;

        if (
          comparison?.type !== 'BinaryExpression' ||
          isComparingToString(comparison) ||
          !equalityMatchers.has(getStringValue(matcher)) ||
          !isBooleanLiteral(matcherArg)
        ) {
          return;
        }

        const hasNot = expectCall.modifiers.some(
          (node) => getStringValue(node) === 'not',
        );

        const preferredMatcher = determineMatcher(
          comparison.operator,
          getRawValue(matcherArg) === hasNot.toString(),
        );

        if (!preferredMatcher) {
          return;
        }

        context.report({
          data: { preferredMatcher },
          fix(fixer) {
            // Preserve the existing modifier if it's not a negation
            const [modifier] = expectCall.modifiers;
            const modifierText =
              modifier && getStringValue(modifier) !== 'not'
                ? `.${getStringValue(modifier)}`
                : '';

            return [
              // Replace the comparison argument with the left-hand side of the comparison
              fixer.replaceText(
                comparison,
                context.sourceCode.getText(comparison.left),
              ),
              // Replace the current matcher & modifier with the preferred matcher
              fixer.replaceTextRange(
                [expectCallEnd, getParent(matcher)!.range![1]],
                `${modifierText}.${preferredMatcher}`,
              ),
              // Replace the matcher argument with the right-hand side of the comparison
              fixer.replaceText(
                matcherArg,
                context.sourceCode.getText(comparison.right),
              ),
            ];
          },
          messageId: 'useToBeComparison',
          node: matcher,
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using the built-in comparison matchers',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      useToBeComparison: 'Prefer using `{{ preferredMatcher }}` instead',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
