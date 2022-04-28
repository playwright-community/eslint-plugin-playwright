function isForceOptionEnabled({ parent }) {
  return (
    parent &&
    parent.arguments &&
    parent.arguments.length &&
    parent.arguments.some(
      (argument) =>
        argument.type === 'ObjectExpression' &&
        argument.properties.some(({ key, value }) => key && key.name === 'force' && value && value.value === true)
    )
  );
}

// https://playwright.dev/docs/api/class-locator
const methodsWithForceOption = new Set([
  'check',
  'uncheck',
  'click',
  'dblclick',
  'dragTo',
  'fill',
  'hover',
  'selectOption',
  'selectText',
  'setChecked',
  'tap',
]);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      MemberExpression(node) {
        if (node.property && methodsWithForceOption.has(node.property.name) && isForceOptionEnabled(node)) {
          context.report({ messageId: 'noForceOption', node });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prevent usage of `{ force: true }` option.',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright#no-force-option',
    },
    messages: {
      noForceOption: 'Unexpected use of { force: true } option.',
    },
    type: 'suggestion',
  },
};
