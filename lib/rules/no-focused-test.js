const { isTestIdentifier, hasAnnotation } = require('../utils/ast');

function isTestGroup(node) {
  const testGroups = new Set(['describe', 'parallel', 'serial']);

  return (
    node.object &&
    node.object.type === 'MemberExpression' &&
    node.object.property.type === 'Identifier' &&
    testGroups.has(node.object.property.name)
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      MemberExpression(node) {
        if ((isTestIdentifier(node) || isTestGroup(node)) && hasAnnotation(node, 'only')) {
          context.report({
            messageId: 'noFocusedTest',
            suggest: [
              {
                messageId: 'removeFocusedTestAnnotation',
                // - 1 to remove the `.only` annotation with dot notation
                fix: (fixer) => fixer.removeRange([node.property.range[0] - 1, node.property.range[1]]),
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
      description: 'Prevent usage of `.only()` focus test annotation',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright#no-focused-test',
    },
    hasSuggestions: true,
    messages: {
      noFocusedTest: 'Unexpected use of .only() annotation.',
      removeFocusedTestAnnotation: 'Remove .only() annotation',
    },
    type: 'problem',
  },
};
