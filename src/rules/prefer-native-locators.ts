import { getStringValue, isPageMethod } from '../utils/ast'
import { createRule } from '../utils/createRule'

export default createRule({
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return
        const method = getStringValue(node.callee.property)
        const query = getStringValue(node.arguments[0])
        const isLocator = isPageMethod(node, 'locator') || method === 'locator'
        if (!isLocator) return

        const ariaLabelPattern = /^\[aria-label=['"](.+?)['"]\]$/
        if (query.match(ariaLabelPattern)) {
          context.report({
            fix(fixer) {
              const [, label] = query.match(ariaLabelPattern) ?? []
              const start =
                node.callee.type === 'MemberExpression'
                  ? node.callee.property.range![0]
                  : node.range![0]
              const end = node.range![1]
              return fixer.replaceTextRange(
                [start, end],
                `getByLabel("${label}")`,
              )
            },
            messageId: 'unexpectedLabelQuery',
            node,
          })
        }

        const rolePattern = /^\[role=['"](.+?)['"]\]$/
        if (query.match(rolePattern)) {
          context.report({
            fix(fixer) {
              const [, role] = query.match(rolePattern) ?? []
              const start =
                node.callee.type === 'MemberExpression'
                  ? node.callee.property.range![0]
                  : node.range![0]
              const end = node.range![1]
              return fixer.replaceTextRange(
                [start, end],
                `getByRole("${role}")`,
              )
            },
            messageId: 'unexpectedRoleQuery',
            node,
          })
        }

        const placeholderPattern = /^\[placeholder=['"](.+?)['"]\]$/
        if (query.match(placeholderPattern)) {
          context.report({
            fix(fixer) {
              const [, placeholder] = query.match(placeholderPattern) ?? []
              const start =
                node.callee.type === 'MemberExpression'
                  ? node.callee.property.range![0]
                  : node.range![0]
              const end = node.range![1]
              return fixer.replaceTextRange(
                [start, end],
                `getByPlaceholder("${placeholder}")`,
              )
            },
            messageId: 'unexpectedPlaceholderQuery',
            node,
          })
        }

        const altTextPattern = /^\[alt=['"](.+?)['"]\]$/
        if (query.match(altTextPattern)) {
          context.report({
            fix(fixer) {
              const [, alt] = query.match(altTextPattern) ?? []
              const start =
                node.callee.type === 'MemberExpression'
                  ? node.callee.property.range![0]
                  : node.range![0]
              const end = node.range![1]
              return fixer.replaceTextRange(
                [start, end],
                `getByAltText("${alt}")`,
              )
            },
            messageId: 'unexpectedAltTextQuery',
            node,
          })
        }
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prefer native locator functions',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-native-locators.md',
    },
    fixable: 'code',
    messages: {
      unexpectedAltTextQuery: 'Use .getByAltText() instead',
      unexpectedLabelQuery: 'Use .getByLabel() instead',
      unexpectedPlaceholderQuery: 'Use .getByPlaceholder() instead',
      unexpectedRoleQuery: 'Use .getByRole() instead',
      unexpectedTestIdQuery: 'Use .getByTestId() instead',
    },
    schema: [],
    type: 'suggestion',
  },
})
