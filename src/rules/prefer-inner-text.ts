import { Rule } from 'eslint';
import { isLocatorMethod } from '../utils/ast';
import { replaceAccessorFixer } from '../utils/fixer';

export default {
  create(context) {
    return {
      CallExpression(node) {
        const callee = isLocatorMethod(node, 'textContent');
        if (callee) {
          context.report({
            node: callee.property,
            messageId: 'useInnerText',
            suggest: [
              {
                messageId: 'suggestReplaceWithInnerText',
                fix: (fixer) => {
                  return replaceAccessorFixer(
                    fixer,
                    callee.property,
                    'innerText'
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
      description: 'Suggest using `innerText()`',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/require-inner-text.md',
    },
    messages: {
      useInnerText: 'Use innerText() instead',
      suggestReplaceWithInnerText: 'Replace with `innerText()`',
    },
    hasSuggestions: true,
    fixable: 'code',
    type: 'suggestion',
    schema: [],
  },
} as Rule.RuleModule;
