import { isPageMethod } from '../utils/ast'
import { createRule } from '../utils/createRule'

export default createRule({
  create(context) {
    return {
      CallExpression(node) {
        const isEval = isPageMethod(node, '$eval')

        if (isEval || isPageMethod(node, '$$eval')) {
          context.report({
            messageId: isEval ? 'noEval' : 'noEvalAll',
            node: node.callee,
          })
        }
      },
    }
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description:
        'The use of `page.$eval` and `page.$$eval` are discouraged, use `locator.evaluate` or `locator.evaluateAll` instead',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-eval.md',
    },
    messages: {
      noEval: 'Unexpected use of page.$eval().',
      noEvalAll: 'Unexpected use of page.$$eval().',
    },
    type: 'problem',
  },
})
