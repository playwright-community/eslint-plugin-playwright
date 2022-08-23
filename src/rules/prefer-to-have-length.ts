import { Rule } from 'eslint';
import {
  isExpectCall,
  getNodeName,
  getMatchers,
  isPropertyAccessor,
} from '../utils/ast';

const matchers = new Set(['toBe', 'toEqual', 'toStrictEqual']);

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (!isExpectCall(node)) {
          return;
        }

        const [argument] = node.arguments;
        const [matcher] = getMatchers(node).slice(-1);

        if (
          !matcher ||
          !matchers.has(getNodeName(matcher) ?? '') ||
          argument?.type !== 'MemberExpression' ||
          !isPropertyAccessor(argument, 'length')
        ) {
          return;
        }

        context.report({
          fix(fixer) {
            return [
              // remove the "length" property accessor
              fixer.removeRange([
                argument.property.range![0] - 1,
                argument.range![1],
              ]),
              // replace the current matcher with "toHaveLength"
              fixer.replaceText(matcher, 'toHaveLength'),
            ];
          },
          messageId: 'useToHaveLength',
          node: matcher,
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toHaveLength()`',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-to-have-length.md',
    },
    messages: {
      useToHaveLength: 'Use toHaveLength() instead',
    },
    fixable: 'code',
    type: 'suggestion',
    schema: [],
  },
} as Rule.RuleModule;
