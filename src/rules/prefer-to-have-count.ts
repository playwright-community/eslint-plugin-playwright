import { Rule } from 'eslint';
import { equalityMatchers, isPropertyAccessor } from '../utils/ast';
import { replaceAccessorFixer } from '../utils/fixer';
import { parseExpectCall } from '../utils/parseExpectCall';

export default {
  create(context) {
    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(context, node);
        if (!expectCall || !equalityMatchers.has(expectCall.matcherName)) {
          return;
        }

        const [argument] = node.arguments;
        if (
          argument.type !== 'AwaitExpression' ||
          argument.argument.type !== 'CallExpression' ||
          argument.argument.callee.type !== 'MemberExpression' ||
          !isPropertyAccessor(argument.argument.callee, 'count')
        ) {
          return;
        }

        const callee = argument.argument.callee;
        context.report({
          fix(fixer) {
            return [
              // remove the "await" expression
              fixer.removeRange([
                argument.range![0],
                argument.range![0] + 'await'.length + 1,
              ]),
              // remove the "count()" method accessor
              fixer.removeRange([
                callee.property.range![0] - 1,
                argument.argument.range![1],
              ]),
              // replace the current matcher with "toHaveCount"
              replaceAccessorFixer(fixer, expectCall.matcher, 'toHaveCount'),
              // insert "await" to before "expect()"
              fixer.insertTextBefore(node, 'await '),
            ];
          },
          messageId: 'useToHaveCount',
          node: expectCall.matcher,
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toHaveCount()`',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-to-have-count.md',
    },
    fixable: 'code',
    messages: {
      useToHaveCount: 'Use toHaveCount() instead',
    },
    schema: [],
    type: 'suggestion',
  },
} as Rule.RuleModule;
