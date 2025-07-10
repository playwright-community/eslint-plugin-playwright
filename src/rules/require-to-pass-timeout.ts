import { createRule } from '../utils/createRule.js'
import { parseFnCall } from '../utils/parseFnCall.js'

export default createRule({
  create(context) {
    return {
      CallExpression(node) {
        const call = parseFnCall(context, node)
        if (call?.type !== 'expect') return

        if (call.matcherName !== 'toPass') return

        const objectArg = call.matcherArgs.find(
          (arg) => arg.type === 'ObjectExpression',
        )

        if (
          !objectArg?.properties.find(
            (prop) =>
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'timeout',
          )
        ) {
          // Look for `toPass` calls without `timeout` in the arguments.
          context.report({
            data: { matcherName: call.matcherName },
            messageId: 'addTimeoutOption',
            node: call.matcher,
          })
        }
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Require a timeout option for `toPass()`',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/require-to-pass-timeout.md',
    },
    messages: {
      addTimeoutOption: 'Add a timeout option to {{ matcherName }}()',
    },
    schema: [],
    type: 'suggestion',
  },
})
