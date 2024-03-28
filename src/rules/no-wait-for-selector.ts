import { Rule } from 'eslint'
import { isPageMethod } from '../utils/ast'

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (isPageMethod(node, 'waitForSelector')) {
          context.report({
            messageId: 'noWaitForSelector',
            node,
            suggest: [
              {
                fix: (fixer) =>
                  fixer.remove(
                    node.parent && node.parent.type !== 'AwaitExpression'
                      ? node.parent
                      : node.parent.parent,
                  ),
                messageId: 'removeWaitForSelector',
              },
            ],
          })
        }
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prevent usage of page.waitForSelector()',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-wait-for-selector.md',
    },
    hasSuggestions: true,
    messages: {
      noWaitForSelector: 'Unexpected use of `page.waitForSelector()`. Use web assertions that assert visibility or a locator-based `locator.waitFor()` instead, or remove the call.',
      removeWaitForSelector: 'Remove the `page.waitForSelector()` call.',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule
