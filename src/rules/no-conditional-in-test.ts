import { Rule } from 'eslint'
import { findParent } from '../utils/ast.js'
import { createRule } from '../utils/createRule.js'
import { isTypeOfFnCall } from '../utils/parseFnCall.js'

export default createRule({
  create(context) {
    function checkConditional(node: Rule.Node & Rule.NodeParentExtension) {
      const call = findParent(node, 'CallExpression')
      if (!call) return

      if (isTypeOfFnCall(context, call, ['test', 'step'])) {
        // Check if the conditional is inside the test body (the function passed as the last argument)
        const testFunction = call.arguments[call.arguments.length - 1]

        // If the last argument is not a function, this is not a valid test call
        if (
          !testFunction ||
          (testFunction.type !== 'FunctionExpression' &&
            testFunction.type !== 'ArrowFunctionExpression')
        ) {
          return
        }

        // Check if the conditional node is inside the test function body
        let currentNode: Rule.Node | null = node
        let isInTestBody = false

        while (currentNode && currentNode !== testFunction) {
          if (currentNode === testFunction.body) {
            isInTestBody = true
            break
          }
          currentNode = currentNode.parent
        }

        // Only report if the conditional is inside the test body
        if (isInTestBody) {
          context.report({ messageId: 'conditionalInTest', node })
        }
      }
    }

    return {
      ConditionalExpression: checkConditional,
      IfStatement: checkConditional,
      LogicalExpression: checkConditional,
      SwitchStatement: checkConditional,
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow conditional logic in tests',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-conditional-in-test.md',
    },
    messages: {
      conditionalInTest: 'Avoid having conditionals in tests',
    },
    schema: [],
    type: 'problem',
  },
})
