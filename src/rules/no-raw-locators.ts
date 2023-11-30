import { Rule } from 'eslint';
import { getStringValue, isPageMethod } from '../utils/ast';

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return;
        const method = getStringValue(node.callee.property);

        if (isPageMethod(node, 'locator') || method === 'locator') {
          context.report({ messageId: 'noRawLocator', node });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallows the usage of raw locators',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-raw-locators.md',
    },
    messages: {
      noRawLocator:
        'Usage of raw locator detected. Use methods like .getByRole() or .getByText() instead of raw locators.',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
