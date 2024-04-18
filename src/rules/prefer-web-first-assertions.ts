import { Rule } from 'eslint'
import ESTree from 'estree'
import {
  findParent,
  getRawValue,
  getStringValue,
  isBooleanLiteral,
} from '../utils/ast'
import { createRule } from '../utils/createRule'
import { parseFnCall } from '../utils/parseFnCall'

type MethodConfig = {
  inverse?: string
  matcher: string
  prop?: string
  type: 'boolean' | 'string'
}

const methods: Record<string, MethodConfig> = {
  getAttribute: {
    matcher: 'toHaveAttribute',
    type: 'string',
  },
  innerText: { matcher: 'toHaveText', type: 'string' },
  inputValue: { matcher: 'toHaveValue', type: 'string' },
  isChecked: {
    matcher: 'toBeChecked',
    prop: 'checked',
    type: 'boolean',
  },
  isDisabled: {
    inverse: 'toBeEnabled',
    matcher: 'toBeDisabled',
    type: 'boolean',
  },
  isEditable: { matcher: 'toBeEditable', type: 'boolean' },
  isEnabled: {
    inverse: 'toBeDisabled',
    matcher: 'toBeEnabled',
    type: 'boolean',
  },
  isHidden: {
    inverse: 'toBeVisible',
    matcher: 'toBeHidden',
    type: 'boolean',
  },
  isVisible: {
    inverse: 'toBeHidden',
    matcher: 'toBeVisible',
    type: 'boolean',
  },
  textContent: { matcher: 'toHaveText', type: 'string' },
}

const supportedMatchers = new Set([
  'toBe',
  'toEqual',
  'toBeTruthy',
  'toBeFalsy',
])

/**
 * If the expect call argument is a variable reference, finds the variable
 * initializer.
 */
function dereference(context: Rule.RuleContext, node: ESTree.Node | undefined) {
  if (node?.type !== 'Identifier') {
    return node
  }

  const scope = context.sourceCode.getScope(node)

  // Find the variable declaration and return the initializer
  for (const ref of scope.references) {
    const refParent = (ref.identifier as Rule.Node).parent

    const isCorrectVariableDeclarator = refParent.type === 'VariableDeclarator' &&
      refParent.id.type === 'Identifier' &&
      refParent.id.name === node.name

    if (isCorrectVariableDeclarator) {
      return refParent.init
    }
  }
}

export default createRule({
  create(context) {
    return {
      CallExpression(node) {
        const call = parseFnCall(context, node)
        if (call?.type !== 'expect') return

        const expect = findParent(call.head.node, 'CallExpression')
        if (!expect) return

        const arg = dereference(context, call.args[0])
        if (
          !arg ||
          arg.type !== 'AwaitExpression' ||
          arg.argument.type !== 'CallExpression' ||
          arg.argument.callee.type !== 'MemberExpression'
        ) {
          return
        }

        // Matcher must be supported
        if (!supportedMatchers.has(call.matcherName)) return

        // Playwright method must be supported
        const method = getStringValue(arg.argument.callee.property)
        const methodConfig = methods[method]
        if (!methodConfig) return

        // Change the matcher
        const notModifier = call.modifiers.find(
          (mod) => getStringValue(mod) === 'not',
        )

        const isFalsy =
          methodConfig.type === 'boolean' &&
          ((!!call.matcherArgs.length &&
            isBooleanLiteral(call.matcherArgs[0], false)) ||
            call.matcherName === 'toBeFalsy')

        const isInverse = methodConfig.inverse
          ? notModifier || isFalsy
          : notModifier && isFalsy

        // Replace the old matcher with the new matcher. The inverse
        // matcher should only be used if the old statement was not a
        // double negation.
        const newMatcher =
          (+!!notModifier ^ +isFalsy && methodConfig.inverse) ||
          methodConfig.matcher

        const { callee } = arg.argument
        context.report({
          data: {
            matcher: newMatcher,
            method,
          },
          fix: (fixer) => {
            const methodArgs =
              arg.argument.type === 'CallExpression'
                ? arg.argument.arguments
                : []

            const methodEnd = methodArgs.length
              ? methodArgs.at(-1)!.range![1] + 1
              : callee.property.range![1] + 2

            const fixes = [
              // Add await to the expect call
              fixer.insertTextBefore(expect, 'await '),
              // Remove the await keyword
              fixer.replaceTextRange(
                [arg.range![0], arg.argument.range![0]],
                '',
              ),
              // Remove the old Playwright method and any arguments
              fixer.replaceTextRange(
                [callee.property.range![0] - 1, methodEnd],
                '',
              ),
            ]

            // Remove not from matcher chain if no longer needed
            if (isInverse && notModifier) {
              const notRange = notModifier.range!
              fixes.push(fixer.removeRange([notRange[0], notRange[1] + 1]))
            }

            // Add not to the matcher chain if no inverse matcher exists
            if (!methodConfig.inverse && !notModifier && isFalsy) {
              fixes.push(fixer.insertTextBefore(call.matcher, 'not.'))
            }

            fixes.push(fixer.replaceText(call.matcher, newMatcher))

            // Remove boolean argument if it exists
            const [matcherArg] = call.matcherArgs ?? []
            if (matcherArg && isBooleanLiteral(matcherArg)) {
              fixes.push(fixer.remove(matcherArg))
            }

            // Add the prop argument if needed
            else if (methodConfig.prop && matcherArg) {
              const propArg = methodConfig.prop
              const variable = getStringValue(matcherArg)
              const args = `{ ${propArg}: ${variable} }`

              fixes.push(fixer.replaceText(matcherArg, args))
            }

            // Add the new matcher arguments if needed
            const hasOtherArgs = !!methodArgs.filter(
              (arg) => !isBooleanLiteral(arg),
            ).length

            if (methodArgs) {
              const range = call.matcher.range!
              const stringArgs = methodArgs
                .map((arg) => getRawValue(arg))
                .concat(hasOtherArgs ? '' : [])
                .join(', ')

              fixes.push(
                fixer.insertTextAfterRange(
                  [range[0], range[1] + 1],
                  stringArgs,
                ),
              )
            }

            return fixes
          },
          messageId: 'useWebFirstAssertion',
          node: expect,
        })
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prefer web first assertions',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-web-first-assertions.md',
    },
    fixable: 'code',
    messages: {
      useWebFirstAssertion: 'Replace {{method}}() with {{matcher}}().',
    },
    type: 'suggestion',
  },
})
