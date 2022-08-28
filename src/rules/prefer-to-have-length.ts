import { Rule } from 'eslint';
import * as ESTree from 'estree';
import {
  isExpectCall,
  getMatcherChain,
  isPropertyAccessor,
  getStringValue,
} from '../utils/ast';

const matchers = new Set(['toBe', 'toEqual', 'toStrictEqual']);

const getRangeOffset = (node: ESTree.Node) =>
  node.type === 'Identifier' ? 0 : 1;

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (!isExpectCall(node)) {
          return;
        }

        const [argument] = node.arguments;
        const [matcher] = getMatcherChain(node).slice(-1);

        if (
          !matcher ||
          !matchers.has(getStringValue(matcher) ?? '') ||
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
              fixer.replaceTextRange(
                [
                  matcher.range![0] + getRangeOffset(matcher),
                  matcher.range![1] - getRangeOffset(matcher),
                ],
                'toHaveLength'
              ),
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
