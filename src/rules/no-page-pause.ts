import { Rule } from 'eslint'
import { isPageMethod } from '../utils/ast'

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (isPageMethod(node, 'pause')) {
          context.report({ messageId: 'noPagePause', node })
        }
      },
    }
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Prevent usage of page.pause()',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-page-pause.md',
    },
    messages: {
      noPagePause: 'Unexpected use of page.pause(). This method requires Playwright to be started in a headed mode.',
    },
    type: 'problem',
  },
} as Rule.RuleModule
