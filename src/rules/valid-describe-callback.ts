import { Rule } from 'eslint'
import * as ESTree from 'estree'
import { getStringValue, isFunction } from '../utils/ast'
import { parseFnCall } from '../utils/parseFnCall'

const paramsLocation = (
  params: ESTree.CallExpression['arguments'] | ESTree.Pattern[],
) => {
  const [first] = params
  const last = params[params.length - 1]

  return {
    end: last.loc!.end,
    start: first.loc!.start,
  }
}

function parseArgs(node: ESTree.CallExpression) {
  const [name, b, c] = node.arguments
  const options = node.arguments.length === 2 ? b : undefined
  const callback = node.arguments.length === 3 ? c : b

  return [name, options, callback] as const
}

export default {
  create(context) {
    return {
      CallExpression(node) {
        const call = parseFnCall(context, node)
        if (call?.group !== 'describe') return

        // Ignore `describe.configure()` calls
        if (call.members.some((s) => getStringValue(s) === 'configure')) {
          return
        }

        const [name, _, callback] = parseArgs(node)

        if (node.arguments.length < 1) {
          return context.report({
            loc: node.loc!,
            messageId: 'nameAndCallback',
          })
        }

        if (!name || !callback) {
          context.report({
            loc: paramsLocation(node.arguments),
            messageId: 'nameAndCallback',
          })

          return
        }

        if (!isFunction(callback)) {
          context.report({
            loc: paramsLocation(node.arguments),
            messageId: 'invalidCallback',
          })

          return
        }

        if (callback.async) {
          context.report({
            messageId: 'noAsyncDescribeCallback',
            node: callback,
          })
        }

        if (callback.params.length) {
          context.report({
            loc: paramsLocation(callback.params),
            messageId: 'unexpectedDescribeArgument',
          })
        }

        if (callback.body.type === 'CallExpression') {
          context.report({
            messageId: 'unexpectedReturnInDescribe',
            node: callback,
          })
        }

        if (callback.body.type === 'BlockStatement') {
          callback.body.body.forEach((node) => {
            if (node.type === 'ReturnStatement') {
              context.report({
                messageId: 'unexpectedReturnInDescribe',
                node,
              })
            }
          })
        }
      },
    }
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Enforce valid `describe()` callback',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/valid-describe-callback.md',
    },
    messages: {
      invalidCallback: 'Callback argument must be a function',
      nameAndCallback: 'Describe requires name and callback arguments',
      noAsyncDescribeCallback: 'No async describe callback',
      unexpectedDescribeArgument: 'Unexpected argument(s) in describe callback',
      unexpectedReturnInDescribe:
        'Unexpected return statement in describe callback',
    },
    schema: [],
    type: 'problem',
  },
} as Rule.RuleModule
