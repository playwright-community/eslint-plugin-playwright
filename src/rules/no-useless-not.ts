import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { getStringValue, isExpectCall, isPropertyAccessor } from '../utils/ast';

const matcherMap = {
  toBeVisible: 'toBeHidden',
  toBeHidden: 'toBeVisible',
  toBeEnabled: 'toBeDisabled',
  toBeDisabled: 'toBeEnabled',
};

const getRangeOffset = (node: ESTree.Node) =>
  node.type === 'Identifier' ? 0 : 1;

export default {
  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object.type === 'MemberExpression' &&
          node.object.object.type === 'CallExpression' &&
          isExpectCall(node.object.object) &&
          isPropertyAccessor(node.object, 'not')
        ) {
          const matcher = getStringValue(node.property) as
            | keyof typeof matcherMap
            | undefined;

          if (matcher && matcher in matcherMap) {
            const { property } = node.object;

            context.report({
              fix: (fixer) => [
                fixer.removeRange([
                  property.range![0] - getRangeOffset(property),
                  property.range![1] + 1,
                ]),
                fixer.replaceTextRange(
                  [
                    node.property.range![0] + getRangeOffset(node.property),
                    node.property.range![1] - getRangeOffset(node.property),
                  ],
                  matcherMap[matcher]
                ),
              ],
              messageId: 'noUselessNot',
              node: node,
              data: {
                old: matcher,
                new: matcherMap[matcher],
              },
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: `Disallow usage of 'not' matchers when a more specific matcher exists`,
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-useless-not.md',
    },
    fixable: 'code',
    messages: {
      noUselessNot: 'Unexpected usage of not.{{old}}(). Use {{new}}() instead.',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
