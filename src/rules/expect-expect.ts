import ESTree from 'estree'
import { dig } from '../utils/ast'
import { createRule } from '../utils/createRule'
import { parseFnCall } from '../utils/parseFnCall'

export default createRule({
  create(context) {
    const options = {
      assertFunctionNames: [] as string[],
      ...((context.options?.[0] as Record<string, unknown>) ?? {}),
    }

    const unchecked: ESTree.CallExpression[] = []

    function checkExpressions(nodes: ESTree.Node[]) {
      for (const node of nodes) {
        const index =
          node.type === 'CallExpression' ? unchecked.indexOf(node) : -1

        if (index !== -1) {
          unchecked.splice(index, 1)
          break
        }
      }
    }

    return {
      CallExpression(node) {
        const call = parseFnCall(context, node)

        if (call?.type === 'test') {
          unchecked.push(node)
        } else if (
          call?.type === 'expect' ||
          options.assertFunctionNames.find((name) => dig(node.callee, name))
        ) {
          const ancestors = context.sourceCode.getAncestors(node)
          checkExpressions(ancestors)
        }
      },
      'Program:exit'() {
        unchecked.forEach((node) => {
          context.report({ messageId: 'noAssertions', node })
        })
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce assertion to be made in a test body',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/expect-expect.md',
    },
    messages: {
      noAssertions: 'Test has no assertions',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          assertFunctionNames: {
            items: [{ type: 'string' }],
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
})
