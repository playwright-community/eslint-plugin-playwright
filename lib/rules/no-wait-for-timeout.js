const { isObject, isCalleeProperty } = require('../utils/ast');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (isObject(node, 'page') && isCalleeProperty(node, 'waitForTimeout')) {
          context.report({
            messageId: 'noWaitForTimeout',
            suggest: [
              {
                messageId: 'removeWaitForTimeout',
                fix: (fixer) =>
                  fixer.remove(
                    node.parent && node.parent.type !== 'AwaitExpression' ? node.parent : node.parent.parent
                  ),
              },
            ],
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prevent usage of page.waitForTimeout()',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright#no-wait-for-timeout',
    },
    hasSuggestions: true,
    messages: {
      noWaitForTimeout: 'Unexpected use of page.waitForTimeout().',
      removeWaitForTimeout: 'Remove the page.waitForTimeout() method.',
    },
    type: 'suggestion',
  },
};
