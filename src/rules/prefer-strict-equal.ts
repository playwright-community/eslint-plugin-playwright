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
            messageId: 'useToStrictEqual',
            node: expectCall.matcher,
            suggest: [
              {
                fix: (fixer) => {
                  return replaceAccessorFixer(
                    fixer,
                    expectCall.matcher,
                    'toStrictEqual',
                  );
                },
                messageId: 'suggestReplaceWithStrictEqual',
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
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      suggestReplaceWithStrictEqual: 'Replace with `toStrictEqual()`',
      useToStrictEqual: 'Use toStrictEqual() instead',
    },
    schema: [],
    type: 'suggestion',
  },
} as Rule.RuleModule;
