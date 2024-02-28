import { Rule } from 'eslint'
import { getStringValue, isPageMethod } from '../utils/ast'

/** Normalize data attribute locators */
function normalize(str: string) {
  const match = /\[([^=]+?)=['"]?([^'"]+?)['"]?\]/.exec(str)
  return match ? `[${match[1]}=${match[2]}]` : str
}

export default {
  create(context) {
    const options = {
      allowed: [] as string[],
      ...((context.options?.[0] as Record<string, unknown>) ?? {}),
    }

    function isAllowed(arg: string) {
      return options.allowed.some((a) => normalize(a) === normalize(arg))
    }

    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return
        const method = getStringValue(node.callee.property)
        const arg = getStringValue(node.arguments[0])
        const isLocator = isPageMethod(node, 'locator') || method === 'locator'

        if (isLocator && !isAllowed(arg)) {
          context.report({ messageId: 'noRawLocator', node })
        }
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallows the usage of raw locators',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-raw-locators.md',
    },
    messages: {
      noRawLocator:
        'Usage of raw locator detected. Use methods like .getByRole() or .getByText() instead of raw locators.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowed: {
            items: { type: 'string' },
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
} as Rule.RuleModule
