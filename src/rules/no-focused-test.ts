import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { isIdentifier, isTestIdentifier } from '../utils/ast';

function isTestGroup(node: ESTree.MemberExpression) {
  const testGroups = new Set(['describe', 'parallel', 'serial']);

  return (
    node.object.type === 'MemberExpression' &&
    node.object.property.type === 'Identifier' &&
    testGroups.has(node.object.property.name)
  );
}

export default {
  create(context) {
    return {
      MemberExpression(node) {
        if (
          (isTestIdentifier(node) || isTestGroup(node)) &&
          isIdentifier(node.property, 'only')
        ) {
          const range = node.property.range!;

          context.report({
            messageId: 'noFocusedTest',
            suggest: [
              {
                messageId: 'removeFocusedTestAnnotation',
                // - 1 to remove the `.only` annotation with dot notation
                fix: (fixer) => fixer.removeRange([range[0] - 1, range[1]]),
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
} as Rule.RuleModule;
