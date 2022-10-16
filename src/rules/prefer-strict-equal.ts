import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { isExpectCall, getMatchers, getStringValue } from '../utils/ast';

const getRangeOffset = (node: ESTree.Node) =>
  node.type === 'Identifier' ? 0 : 1;

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (!isExpectCall(node)) {
          return;
        }

        const [matcher] = getMatchers(node).slice(-1);
        if ((getStringValue(matcher) ?? '') !== 'toEqual') {
          return;
        }

        context.report({
          node: matcher,
          messageId: 'useToStrictEqual',
          suggest: [
            {
              messageId: 'suggestReplaceWithStrictEqual',
              fix: (fixer) => {
                return fixer.replaceTextRange(
                  [
                    matcher.range![0] + getRangeOffset(matcher),
                    matcher.range![1] - getRangeOffset(matcher),
                  ],
                  'toStrictEqual'
                );
              },
            },
          ],
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toStrictEqual()`',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-strict-equal.md',
    },
    messages: {
      useToStrictEqual: 'Use toStrictEqual() instead',
      suggestReplaceWithStrictEqual: 'Replace with `toStrictEqual()`',
    },
    fixable: 'code',
    type: 'suggestion',
    hasSuggestions: true,
    schema: [],
  },
} as Rule.RuleModule;
