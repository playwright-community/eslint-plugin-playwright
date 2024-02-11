import { Rule } from 'eslint';
import { isPropertyAccessor } from '../utils/ast';
import { replaceAccessorFixer } from '../utils/fixer';
import { parseExpectCall } from '../utils/parseExpectCall';

const lengthMatchers = new Set(['toBe', 'toEqual', 'toStrictEqual']);

export default {
  create(context) {
    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(context, node);
        if (!expectCall || !lengthMatchers.has(expectCall.matcherName)) {
          return;
        }

        const [argument] = node.arguments;
        if (
          argument?.type !== 'MemberExpression' ||
          !isPropertyAccessor(argument, 'length')
        ) {
          return;
        }

        context.report({
          fix(fixer) {
            return [
              // remove the "length" property accessor
              fixer.removeRange([
                argument.property.range![0] - 1,
                argument.range![1],
              ]),
              // replace the current matcher with "toHaveLength"
              replaceAccessorFixer(fixer, expectCall.matcher, 'toHaveLength'),
            ];
          },
          messageId: 'useToHaveLength',
          node: expectCall.matcher,
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toHaveLength()`',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-to-have-length.md',
    },
    fixable: 'code',
    messages: {
      useToHaveLength: 'Use toHaveLength() instead',
    },
    schema: [],
    type: 'suggestion',
  },
} as Rule.RuleModule;
