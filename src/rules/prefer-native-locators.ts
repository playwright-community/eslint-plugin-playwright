import { getStringValue, isPageMethod } from '../utils/ast'
import { createRule } from '../utils/createRule'

type Pattern = {
  messageId: string
  pattern: RegExp
  replacement: string
}

export default createRule({
  create(context) {
    const { testIdAttribute } = {
      testIdAttribute: 'data-testid',
      ...((context.options?.[0] as Record<string, unknown>) ?? {}),
    }

    const patterns: Array<Pattern> = [
      {
        messageId: 'unexpectedLabelQuery',
        pattern: /^\[aria-label=['"](.+?)['"]\]$/,
        replacement: 'getByLabel',
      },
      {
        messageId: 'unexpectedRoleQuery',
        pattern: /^\[role=['"](.+?)['"]\]$/,
        replacement: 'getByRole',
      },
      {
        messageId: 'unexpectedPlaceholderQuery',
        pattern: /^\[placeholder=['"](.+?)['"]\]$/,
        replacement: 'getByPlaceholder',
      },
      {
        messageId: 'unexpectedAltTextQuery',
        pattern: /^\[alt=['"](.+?)['"]\]$/,
        replacement: 'getByAltText',
      },
      {
        messageId: 'unexpectedTitleQuery',
        pattern: /^\[title=['"](.+?)['"]\]$/,
        replacement: 'getByTitle',
      },
      {
        messageId: 'unexpectedTestIdQuery',
        pattern: new RegExp(`^\\[${testIdAttribute}=['"](.+?)['"]\\]`),
        replacement: 'getByTestId',
      },
    ]

    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return
        const method = getStringValue(node.callee.property)
        const query = getStringValue(node.arguments[0])
        const isLocator = isPageMethod(node, 'locator') || method === 'locator'
        if (!isLocator) return

        // If it's something like `page.locator`, just replace the `.locator` part
        const start =
          node.callee.type === 'MemberExpression'
            ? node.callee.property.range![0]
            : node.range![0]
        const end = node.range![1]
        const rangeToReplace: [number, number] = [start, end]

        for (const pattern of patterns) {
          const match = query.match(pattern.pattern)
          if (match) {
            context.report({
              fix(fixer) {
                const newText = `${pattern.replacement}("${match[1]}")`
                return fixer.replaceTextRange(rangeToReplace, newText)
              },
              messageId: pattern.messageId,
              node,
            })
          }
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
      unexpectedTitleQuery: 'Use .getByTitle() instead',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          testIdAttribute: {
            default: 'data-testid',
            type: 'string',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
})
