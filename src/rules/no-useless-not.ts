import { Rule } from 'eslint';
import { getStringValue } from '../utils/ast';
import { getRangeOffset, replaceAccessorFixer } from '../utils/fixer';
import { parseExpectCall } from '../utils/parseExpectCall';

const matcherMap: Record<string, string> = {
  toBeDisabled: 'toBeEnabled',
  toBeEnabled: 'toBeDisabled',
  toBeHidden: 'toBeVisible',
  toBeVisible: 'toBeHidden',
};

export default {
  create(context) {
    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(context, node);
        if (!expectCall) return;

        // As the name implies, this rule only implies if the not modifier is
        // part of the matcher chain
        const notModifier = expectCall.modifiers.find(
          (mod) => getStringValue(mod) === 'not',
        );
        if (!notModifier) return;

        // This rule only applies to specific matchers that have opposites
        if (expectCall.matcherName in matcherMap) {
          const newMatcher = matcherMap[expectCall.matcherName];

          context.report({
            data: { new: newMatcher, old: expectCall.matcherName },
            fix: (fixer) => [
              fixer.removeRange([
                notModifier.range![0] - getRangeOffset(notModifier),
                notModifier.range![1] + 1,
              ]),
              replaceAccessorFixer(fixer, expectCall.matcher, newMatcher),
            ],
            loc: {
              end: expectCall.matcher.loc!.end,
              start: notModifier.loc!.start,
            },
            messageId: 'noUselessNot',
          });
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
