import type { AST, Rule } from 'eslint';
import type * as ESTree from 'estree';
import {
  isTestIdentifier,
  isObjectProperty,
  isStringLiteral,
  isBooleanLiteral,
  isIdentifier,
} from '../utils/ast';

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
function getSkipRange(
  node: ESTree.MemberExpression & Rule.NodeParentExtension,
  parent: ESTree.CallExpression & Rule.NodeParentExtension
): AST.Range {
  const [first, second] = parent.arguments;

  const isStandaloneSkip =
    !parent.arguments.length ||
    ((first.type === 'BinaryExpression' || isBooleanLiteral(first)) &&
      isStringLiteral(second));

  return isStandaloneSkip
    ? parent.parent.range!
    : [node.property.range![0] - 1, node.property.range![1]];
}

export default {
  create(context) {
    return {
      MemberExpression(node) {
        const parent = node.parent;

        if (
          (isTestIdentifier(node) || isObjectProperty(node, 'describe')) &&
          isIdentifier(node.property, 'skip') &&
          parent.type === 'CallExpression'
        ) {
          context.report({
            messageId: 'noSkippedTest',
            suggest: [
              {
                messageId: 'removeSkippedTestAnnotation',
                fix: (fixer) => fixer.removeRange(getSkipRange(node, parent)),
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
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-skipped-test.md',
    },
    hasSuggestions: true,
    messages: {
      noSkippedTest: 'Unexpected use of the `.skip()` annotation.',
      removeSkippedTestAnnotation: 'Remove the `.skip()` annotation.',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
