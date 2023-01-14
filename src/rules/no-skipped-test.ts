import { Rule } from 'eslint';
import {
  isTest,
  isDescribeCall,
  isPropertyAccessor,
  isTestIdentifier,
} from '../utils/ast';

export default {
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;

        if (
          (isTestIdentifier(callee) || isDescribeCall(node)) &&
          callee.type === 'MemberExpression' &&
          isPropertyAccessor(callee, 'skip')
        ) {
          const isHook = isTest(node) || isDescribeCall(node);

          context.report({
            messageId: 'noSkippedTest',
            suggest: [
              {
                messageId: 'removeSkippedTestAnnotation',
                fix: (fixer) => {
                  return isHook
                    ? fixer.removeRange([
                        callee.property.range![0] - 1,
                        callee.range![1],
                      ])
                    : fixer.remove(node.parent);
                },
              },
            ],
            node: isHook ? callee.property : node,
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
