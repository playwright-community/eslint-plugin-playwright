import { Rule } from 'eslint';
import { getExpectType } from '../utils/ast';

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (getExpectType(node) === 'standalone') {
          context.report({
            fix: (fixer) => fixer.insertTextAfter(node.callee, '.soft'),
            messageId: 'requireSoft',
            node: node.callee,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Require all assertions to use `expect.soft`',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/require-soft-assertions.md',
    },
    fixable: 'code',
    messages: {
      requireSoft: 'Unexpected non-soft assertion',
    },
    schema: [],
    type: 'suggestion',
  },
} as Rule.RuleModule;
