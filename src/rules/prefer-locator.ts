import { isPageMethod } from '../utils/ast'
import { createRule } from '../utils/createRule'

export default createRule({
  create(context) {
    return {
      AwaitExpression(node) {
        // Must be a call expression
        if (node.argument.type !== 'CallExpression') return;

        // Must be a page.fill() call
        const { callee } = node.argument
        if (callee.type !== 'MemberExpression') return;

        if (isPageMethod(node.argument, 'fill')) {
          context.report({
              messageId: "avoidAwaitPageFill",
              node
          });
        }
      }
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: "Discourage using await page methods",
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-locator.md',
    },
    messages: {
      avoidAwaitPageFill: "Avoid using 'await page.fill()', Use locator-based [locator.fill(value[, options])](https://playwright.dev/docs/api/class-locator#locator-fill)",
    },
    schema: [],
    type: 'suggestion'
  }
})
