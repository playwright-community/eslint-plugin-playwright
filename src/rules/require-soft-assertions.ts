import { Rule } from 'eslint';
import { getExpectType } from '../utils/ast';

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (getExpectType(node) === 'standalone') {
          context.report({
            node: node.callee,
            messageId: 'requireSoft',
            fix: (fixer) => fixer.insertTextAfter(node.callee, '.soft'),
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
    messages: {
      requireSoft: 'Unexpected non-soft assertion',
    },
    fixable: 'code',
    type: 'suggestion',
    schema: [],
  },
} as Rule.RuleModule;
