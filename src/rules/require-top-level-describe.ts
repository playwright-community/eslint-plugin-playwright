import { Rule } from 'eslint';
import ESTree from 'estree';
import { isDescribeCall, isTestCall, isTestHook } from '../utils/ast';
import { getAmountData } from '../utils/misc';

export default {
  create(context) {
    const { maxTopLevelDescribes } = {
      maxTopLevelDescribes: Infinity,
      ...((context.options?.[0] as Record<string, unknown>) ?? {}),
    };

    let topLevelDescribeCount = 0;
    let describeCount = 0;

    return {
      CallExpression(node) {
        if (isDescribeCall(node)) {
          describeCount++;

          if (describeCount === 1) {
            topLevelDescribeCount++;

            if (topLevelDescribeCount > maxTopLevelDescribes) {
              context.report({
                data: getAmountData(maxTopLevelDescribes),
                messageId: 'tooManyDescribes',
                node: node.callee,
              });
            }
          }
        } else if (!describeCount) {
          if (isTestCall(context, node)) {
            context.report({ messageId: 'unexpectedTest', node: node.callee });
          } else if (isTestHook(context, node)) {
            context.report({ messageId: 'unexpectedHook', node: node.callee });
          }
        }
      },
      'CallExpression:exit'(node: ESTree.CallExpression) {
        if (isDescribeCall(node)) {
          describeCount--;
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Require test cases and hooks to be inside a `test.describe` block',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/require-top-level-describe.md',
    },
    messages: {
      tooManyDescribes:
        'There should not be more than {{max}} describe{{s}} at the top level',
      unexpectedHook: 'All hooks must be wrapped in a describe block.',
      unexpectedTest: 'All test cases must be wrapped in a describe block.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          maxTopLevelDescribes: {
            minimum: 1,
            type: 'number',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
} as Rule.RuleModule;
