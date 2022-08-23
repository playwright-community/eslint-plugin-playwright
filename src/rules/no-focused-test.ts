import { Rule } from 'eslint';
import { isDescribeCall, isPropertyAccessor, isTest } from '../utils/ast';

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (
          (isTest(node) || isDescribeCall(node)) &&
          node.callee.type === 'MemberExpression' &&
          isPropertyAccessor(node.callee, 'only')
        ) {
          const { callee } = node;

          context.report({
            messageId: 'noFocusedTest',
            suggest: [
              {
                messageId: 'suggestRemoveOnly',
                // - 1 to remove the `.only` annotation with dot notation
                fix: (fixer) =>
                  fixer.removeRange([
                    callee.property.range![0] - 1,
                    callee.range![1],
                  ]),
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
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-focused-test.md',
    },
    hasSuggestions: true,
    messages: {
      noFocusedTest: 'Unexpected focused test.',
      suggestRemoveOnly: 'Remove .only() annotation.',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
