import { Rule } from 'eslint';
import { getNodeName, isIdentifier } from '../utils/ast';

const matcherMap = {
  toBeVisible: 'toBeHidden',
  toBeHidden: 'toBeVisible',
  toBeEnabled: 'toBeDisabled',
  toBeDisabled: 'toBeEnabled',
};

export default {
  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object.type === 'MemberExpression' &&
          node.object.object.type === 'CallExpression' &&
          isIdentifier(node.object.object.callee, 'expect') &&
          isIdentifier(node.object.property, 'not')
        ) {
          const matcher = getNodeName(node.property) as
            | keyof typeof matcherMap
            | undefined;

          if (matcher && matcher in matcherMap) {
            const range = node.object.property.range!;

            context.report({
              fix: (fixer) => [
                fixer.removeRange([range[0], range[1] + 1]),
                fixer.replaceText(node.property, matcherMap[matcher]),
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
