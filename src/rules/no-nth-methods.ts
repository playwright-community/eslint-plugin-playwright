import { Rule } from 'eslint'
import { getStringValue } from '../utils/ast'

const methods = new Set(['first', 'last', 'nth'])

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return

        const method = getStringValue(node.callee.property)
        if (!methods.has(method)) return

        context.report({
          data: { method },
          loc: {
            end: node.loc!.end,
            start: node.callee.property.loc!.start,
          },
          messageId: 'noNthMethod',
        })
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow usage of nth methods',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-nth-methods.md',
    },
    messages: {
      noNthMethod: 'Use of {{method}}() is discouraged. These methods can be prone to flakiness if the DOM structure changes.',
    },
    type: 'problem',
  },
} as Rule.RuleModule
