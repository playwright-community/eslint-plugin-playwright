import { Rule } from 'eslint';
import { getStringValue } from '../utils/ast';
import { getRangeOffset, replaceAccessorFixer } from '../utils/fixer';
import { parseFnCall } from '../utils/parseFnCall';

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
        const call = parseFnCall(context, node);
        if (call?.type !== 'expect') return;

        // As the name implies, this rule only implies if the not modifier is
        // part of the matcher chain
        const notModifier = call.modifiers.find(
          (mod) => getStringValue(mod) === 'not',
        );
        if (!notModifier) return;

        // This rule only applies to specific matchers that have opposites
        const matcherName = call.matcherName;
        if (matcherName in matcherMap) {
          const newMatcher = matcherMap[matcherName];

          context.report({
            data: { new: newMatcher, old: matcherName },
            fix: (fixer) => [
              fixer.removeRange([
                notModifier.range![0] - getRangeOffset(notModifier),
                notModifier.range![1] + 1,
              ]),
              replaceAccessorFixer(fixer, call.matcher, newMatcher),
            ],
            loc: {
              end: call.matcher.loc!.end,
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
