import { Rule } from 'eslint'
import { replaceAccessorFixer } from '../utils/fixer'
import { parseFnCall } from '../utils/parseFnCall'

export default {
  create(context) {
    return {
      CallExpression(node) {
        const call = parseFnCall(context, node)
        if (call?.type !== 'expect') return

        if (call.matcherName === 'toEqual') {
          context.report({
            messageId: 'useToStrictEqual',
            node: call.matcher,
            suggest: [
              {
                fix: (fixer) => {
                  return replaceAccessorFixer(
                    fixer,
                    call.matcher,
                    'toStrictEqual',
                  )
                },
                messageId: 'suggestReplaceWithStrictEqual',
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
} as Rule.RuleModule
