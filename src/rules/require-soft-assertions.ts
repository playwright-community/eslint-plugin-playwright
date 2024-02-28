import { Rule } from 'eslint'
import { getStringValue } from '../utils/ast'
import { parseFnCall } from '../utils/parseFnCall'

export default {
  create(context) {
    return {
      CallExpression(node) {
        const call = parseFnCall(context, node)
        if (
          call?.type !== 'expect' ||
          call.modifiers.some((m) => {
            const name = getStringValue(m)
            return name === 'soft' || name === 'poll'
          })
        ) {
          return
        }

        context.report({
          fix: (fixer) => fixer.insertTextAfter(call.head.node, '.soft'),
          messageId: 'requireSoft',
          node: call.head.node,
        })
      },
    }
  },
  meta: {
    docs: {
      description: 'Require all assertions to use `expect.soft`',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/require-soft-assertions.md',
    },
    fixable: 'code',
    messages: {
      requireSoft: 'Unexpected non-soft assertion',
    },
    schema: [],
    type: 'suggestion',
  },
} as Rule.RuleModule
