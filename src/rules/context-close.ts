import * as ESTree from 'estree'
import { createRule } from '../utils/createRule'

function isInvokedMethodCalled(
  node: ESTree.CallExpression,
  name: string,
): boolean {
  return (
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === name
  )
}

function isInvokeExpressionCalled(
  node: ESTree.ExpressionStatement,
  name: string,
): boolean {
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression' &&
    node.expression.callee.type === 'Identifier' &&
    node.expression.callee.name === name
  )
}

export default createRule({
  create(context) {
    const createContextStackAsMethod: Array<ESTree.CallExpression> = []
    const createContextStackAsExpression: Array<ESTree.ExpressionStatement> = []
    return {
      CallExpression: (node) => {
        if (isInvokedMethodCalled(node, 'createContext')) {
          createContextStackAsMethod.push(node)
        } else if (isInvokedMethodCalled(node, 'close')) {
          if (createContextStackAsMethod.length > 0) {
            createContextStackAsMethod.pop()
          }
        }
      },
      ExpressionStatement: (expressionStatementNode) => {
        if (
          isInvokeExpressionCalled(expressionStatementNode, 'createContext')
        ) {
          createContextStackAsExpression.push(expressionStatementNode)
        } else if (isInvokeExpressionCalled(expressionStatementNode, 'close')) {
          if (createContextStackAsExpression.length > 0) {
            createContextStackAsExpression.pop()
          }
        }
      },
      'Program:exit'() {
        if (createContextStackAsMethod.length > 0) {
          for (const createContextNodeAsMethod of createContextStackAsMethod) {
            context.report({
              messageId: 'missingClose',
              node: createContextNodeAsMethod,
            })
          }
        }

        if (createContextStackAsExpression.length > 0) {
          for (const createContextNodeAsExpression of createContextStackAsExpression) {
            context.report({
              messageId: 'missingClose',
              node: createContextNodeAsExpression,
            })
          }
        }
      },
    }
  },
  meta: {
    docs: {
      description:
        'Enforce closing a context once opened to prevent memory leaks',
    },
    messages: {
      missingClose:
        'A context has been created without a matching close function',
    },
    schema: [],
    type: 'problem',
  },
})
