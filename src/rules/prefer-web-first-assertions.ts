import { Rule } from 'eslint'
import ESTree, { AssignmentExpression } from 'estree'
import {
  findParent,
  getRawValue,
  getStringValue,
  isBooleanLiteral,
} from '../utils/ast'
import { createRule } from '../utils/createRule'
import { parseFnCall } from '../utils/parseFnCall'
import { TypedNodeWithParent } from '../utils/types'

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

const isVariableDeclarator = (
  node: ESTree.Node,
): node is TypedNodeWithParent<'VariableDeclarator'> =>
  node.type === 'VariableDeclarator'

const isAssignmentExpression = (
  node: ESTree.Node,
): node is TypedNodeWithParent<'AssignmentExpression'> =>
  node.type === 'AssignmentExpression'

/**
 * If the expect call argument is a variable reference, finds the variable
 * initializer or last variable assignment.
 *
 * If a variable is assigned after initialization we have to look for the last
 * time it was assigned because it could have been changed multiple times. We
 * then use its right hand assignment operator as the dereferenced node.
 */
function dereference(context: Rule.RuleContext, node: ESTree.Node | undefined) {
  if (node?.type !== 'Identifier') {
    return node
  }

  const scope = context.sourceCode.getScope(node)
  const parents = scope.references
    .map((ref) => ref.identifier as Rule.Node)
    .map((ident) => ident.parent)

  // Look for any variable declarators in the scope references that match the
  // dereferenced node variable name
  const decl = parents
    .filter(isVariableDeclarator)
    .find((p) => p.id.type === 'Identifier' && p.id.name === node.name)

  // Look for any variable assignments in the scope references and pick the last
  // one that matches the dereferenced node variable name
  const expr = parents
    .filter(isAssignmentExpression)
    .reverse()
    .find((assignment) => isNodeLastAssignment(node, assignment))

  return expr?.right ?? decl?.init
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

/**
 * Given a Node and an assignment expression, finds out if the assignment
 * expression happens before the node identifier (based on their range
 * properties) and if the assignment expression left side is of the same name as
 * the name of the given node.
 *
 * @param {ESTree.Identifier} node The node we are comparing the assignment
 *   expression to.
 * @param {AssignmentExpression} assignment The assignment that will be verified
 *   to see if its left operand is the same as the node.name and if it happens
 *   before it.
 * @returns True if the assignment left hand operator belongs to the node and
 *   occurs before it, false otherwise. If either the node or the assignment
 *   expression doen't contain a range array, this will also return false
 *   because their relative positions cannot be calculated.
 */
function isNodeLastAssignment(
  node: ESTree.Identifier,
  assignment: AssignmentExpression,
) {
  const nodeRange = node.range
  const assignmentRange = assignment.range
  const isAssignmentHappeningAfterNode =
    nodeRange && assignmentRange && nodeRange[0] < assignmentRange[1]
  if (isAssignmentHappeningAfterNode) {
    return false
  }
  return (
    assignment.left.type === 'Identifier' && assignment.left.name === node.name
  )
}
