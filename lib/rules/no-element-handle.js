function isPageIdentifier(node) {
  return (
    node.callee &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'page'
  );
}

function isElementHandleIdentifier(node) {
  return (
    node.callee &&
    node.callee.property &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === '$'
  );
}

function isElementHandlesIdentifier(node) {
  return (
    node.callee &&
    node.callee.property &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === '$$'
  );
}

function getRange(node) {
  if (node.parent && node.parent.type === 'AwaitExpression') {
    const [start] = node.parent.range;
    const end = isElementHandleIdentifier(node) ? start + 'await page.$'.length : start + 'await page.$$'.length;

    return [start, end];
  }
}

module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (isPageIdentifier(node) && (isElementHandleIdentifier(node) || isElementHandlesIdentifier(node))) {
          context.report({
            messageId: 'noElementHandle',
            fix: (fixer) => fixer.replaceTextRange(getRange(node), 'page.locator'),
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
    fixable: 'code',
    messages: {
      noElementHandle: 'disallow the use of `page.$` or `page.$$` element handle',
    },
    type: 'problem',
  },
};
