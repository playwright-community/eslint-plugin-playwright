import { Rule } from 'eslint';
import { getAmountData } from '../utils/misc';
import * as ESTree from 'estree';
import { isDescribeCall, isTest, isTestHook } from '../utils/ast';

export default {
  create(context) {
    const { maxTopLevelDescribes } = {
      maxTopLevelDescribes: Infinity,
      ...((context.options?.[0] as {}) ?? {}),
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
                node,
                messageId: 'tooManyDescribes',
                data: getAmountData(maxTopLevelDescribes),
              });
            }
          }
        } else if (!describeCount) {
          if (isTest(node)) {
            context.report({ node, messageId: 'unexpectedTest' });
          } else if (isTestHook(node)) {
            context.report({ node, messageId: 'unexpectedHook' });
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
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/require-top-level-describe.md',
    },
    messages: {
      tooManyDescribes:
        'There should not be more than {{max}} describe{{s}} at the top level',
      unexpectedTest: 'All test cases must be wrapped in a describe block.',
      unexpectedHook: 'All hooks must be wrapped in a describe block.',
    },
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          maxTopLevelDescribes: {
            type: 'number',
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
  },
} as Rule.RuleModule;
