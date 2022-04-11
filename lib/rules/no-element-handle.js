function isPageIdentifier({ callee }) {
  return (
    callee &&
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'page'
  );
}

function isElementHandleIdentifier({ callee }) {
  return (
    callee &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === '$'
  );
}

function isElementHandlesIdentifier({ callee }) {
  return (
    callee &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === '$$'
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
            suggest: [
              {
                messageId: isElementHandleIdentifier(node)
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
