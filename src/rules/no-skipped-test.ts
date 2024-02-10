import { Rule } from 'eslint';
import {
  isDescribeCall,
  isPropertyAccessor,
  isTestCall,
  isTestIdentifier,
} from '../utils/ast';

export default {
  create(context) {
    return {
      CallExpression(node) {
        const options = context.options[0] || {};
        const allowConditional = !!options.allowConditional;
        const { callee } = node;

        if (
          (isTestIdentifier(context, callee) || isDescribeCall(node)) &&
          callee.type === 'MemberExpression' &&
          isPropertyAccessor(callee, 'skip')
        ) {
          const isHook = isTestCall(context, node) || isDescribeCall(node);

          // If allowConditional is enabled and it's not a test/describe hook,
          // we ignore any `test.skip` calls that have no arguments.
          if (!isHook && allowConditional && node.arguments.length) {
            return;
          }

          context.report({
            messageId: 'noSkippedTest',
            node: isHook ? callee.property : node,
            suggest: [
              {
                fix: (fixer) => {
                  return isHook
                    ? fixer.removeRange([
                        callee.property.range![0] - 1,
                        callee.range![1],
                      ])
                    : fixer.remove(node.parent);
                },
                messageId: 'removeSkippedTestAnnotation',
              },
            ],
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
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowConditional: {
            default: false,
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
} as Rule.RuleModule;
