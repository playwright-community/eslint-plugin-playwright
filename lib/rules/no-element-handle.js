const { isObject, isCalleeProperty } = require('../utils/ast');

function getRange(node) {
  const start = node.parent && node.parent.type === 'AwaitExpression' 
    ? node.parent.range[0]
    : node.callee.object.range[0];

  return [start, node.callee.property.range[1]];
}

module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (isObject(node, 'page') && (isCalleeProperty(node, '$') || isCalleeProperty(node, '$$'))) {
          context.report({
            messageId: 'noElementHandle',
            suggest: [
              {
                messageId: isCalleeProperty(node, '$')
                  ? 'replaceElementHandleWithLocator'
                  : 'replaceElementHandlesWithLocator',
                fix: (fixer) => fixer.replaceTextRange(getRange(node), 'page.locator'),
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
      category: 'Possible Errors',
      description: 'The use of ElementHandle is discouraged, use Locator instead',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright#no-element-handle',
    },
    hasSuggestions: true,
    messages: {
      noElementHandle: 'Unexpected use of element handles.',
      replaceElementHandleWithLocator: 'Replace `page.$` with `page.locator`',
      replaceElementHandlesWithLocator: 'Replace `page.$$` with `page.locator`',
    },
    type: 'suggestion',
  },
};
