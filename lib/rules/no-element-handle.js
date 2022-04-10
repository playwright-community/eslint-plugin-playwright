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
  const awaitLength = 'await '.length;
  const elementHandleLength = 'page.$'.length;
  const elementHandlesLength = 'page.$$'.length;

  let start = 0;
  let end = 0;

  if (node.parent && node.parent.type === 'AwaitExpression') {
    start = start + node.parent.range[0];
    end = start + awaitLength;
  } else {
    start = start + node.range[0];
    end += start;
  }

  if (isElementHandleIdentifier(node)) end += elementHandleLength;
  if (isElementHandlesIdentifier(node)) end += elementHandlesLength;

  return [start, end];
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
