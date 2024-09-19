import ESTree from 'estree'
import { getStringValue, isPageMethod } from '../utils/ast'
import { createRule } from '../utils/createRule'

const pageMethods = new Set([
  'click',
  'dblclick',
  'dispatchEvent',
  'fill',
  'focus',
  'getAttribute',
  'hover',
  'innerHTML',
  'innerText',
  'inputValue',
  'isChecked',
  'isDisabled',
  'isEditable',
  'isEnabled',
  'isHidden',
  'isVisible',
  'press',
  'selectOption',
  'setChecked',
  'setInputFiles',
  'tap',
  'textContent',
  'uncheck',
])

function isSupportedMethod(node: ESTree.CallExpression) {
  if (node.callee.type !== 'MemberExpression') return false

  const name = getStringValue(node.callee.property)
  return pageMethods.has(name) && isPageMethod(node, name)
}

export default createRule({
  create(context) {
    return {
      AwaitExpression(node) {
        // Must be a call expression
        if (node.argument.type !== 'CallExpression') return

        // Must be a method we care about
        if (!isSupportedMethod(node.argument)) return

        context.report({
          messageId: 'preferLocator',
          node,
        })
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest locators over page methods',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-locator.md',
    },
    messages: {
      preferLocator: 'Prefer locator methods instead of page methods',
    },
    schema: [],
    type: 'suggestion',
  },
})
