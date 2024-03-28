import { Rule } from 'eslint'
import { isPageMethod } from '../utils/ast'

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (isPageMethod(node, 'waitForTimeout')) {
          context.report({
            messageId: 'noWaitForTimeout',
            node,
            suggest: [
              {
                fix: (fixer) =>
                  fixer.remove(
                    node.parent && node.parent.type !== 'AwaitExpression'
                      ? node.parent
                      : node.parent.parent,
                  ),
                messageId: 'removeWaitForTimeout',
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
      description: 'Prevent usage of page.waitForTimeout()',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-wait-for-timeout.md',
    },
    hasSuggestions: true,
    messages: {
      noWaitForTimeout: 'Never wait for timeout in production. Tests that wait for time are inherently flaky. Use Locator actions and web assertions that wait automatically, or remove the wait.',
      removeWaitForTimeout: 'Remove the page.waitForTimeout() method.',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule
