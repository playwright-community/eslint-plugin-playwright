const {
  isTestIdentifier,
  isObjectProperty,
  hasAnnotation,
  isStringLiteral,
  isBooleanLiteral,
  isBinaryExpression,
} = require('../utils/ast');

/**
 * This function returns needed range to remove skip annotation.
 *
 * To cover the standalone cases:
 * 1. test.skip() => when there's no arguments
 * 2. test.skip(browserName === 'firefox', 'Working on it') => when there's first argument is a binary expression and the second argument is a string literal
 * 3. test.skip(true, 'Working on it') => when there's first argument is a boolean literal and the second argument is a string literal
 *
 * So, if it's standalone skip then we need to remove the whole line
 *
 * Otherwise we need to remove the range of `.skip` annotation - 1 (dot notation).
 */
function getSkipRange(node) {
  const [first, second] = node.parent.arguments;

  const isStandaloneSkip =
    !node.parent.arguments.length ||
    ((isBinaryExpression(first) || isBooleanLiteral(first)) && isStringLiteral(second));

  return isStandaloneSkip ? node.parent.parent.range : [node.property.range[0] - 1, node.property.range[1]];
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      MemberExpression(node) {
        if ((isTestIdentifier(node) || isObjectProperty(node, 'describe')) && hasAnnotation(node, 'skip')) {
          context.report({
            messageId: 'noSkippedTest',
            suggest: [
              {
                messageId: 'removeSkippedTestAnnotation',
                fix: (fixer) => fixer.removeRange(getSkipRange(node)),
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
      description: 'Prevent usage of the `.skip()` skip test annotation.',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright#no-skipped-test',
    },
    hasSuggestions: true,
    messages: {
      noSkippedTest: 'Unexpected use of the `.skip()` annotation.',
      removeSkippedTestAnnotation: 'Remove the `.skip()` annotation.',
    },
    type: 'suggestion',
  },
};
