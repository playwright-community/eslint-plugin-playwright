import { Rule } from 'eslint';
import { replaceAccessorFixer } from '../utils/fixer';
import { parseExpectCall } from '../utils/parseExpectCall';

export default {
  create(context) {
    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(node);

        if (expectCall?.matcherName === 'toEqual') {
          context.report({
            node: expectCall.matcher,
            messageId: 'useToStrictEqual',
            suggest: [
              {
                messageId: 'suggestReplaceWithStrictEqual',
                fix: (fixer) => {
                  return replaceAccessorFixer(
                    fixer,
                    expectCall.matcher,
                    'toStrictEqual'
                  );
                },
              },
            ],
          });
        }
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
